import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function uint8ArrayToBase64Url(array: Uint8Array): string {
  return btoa(String.fromCharCode(...array))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function usePushNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsSupported('serviceWorker' in navigator && 'PushManager' in window);
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    try {
      if (!('serviceWorker' in navigator)) return;
      const registration = await navigator.serviceWorker.getRegistration('/push-sw.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setIsSubscribed(!!subscription);
      }
    } catch (e) {
      console.error('Error checking push subscription:', e);
    }
  };

  const getOrCreateVapidKeys = async (): Promise<string | null> => {
    // Try to get existing public key via RPC (does not expose private key)
    const { data } = await supabase.rpc("get_vapid_public_key" as any);
    if (data && typeof data === "string") return data;

    // Generate new VAPID keys using Web Crypto
    const keyPair = await crypto.subtle.generateKey(
      { name: "ECDSA", namedCurve: "P-256" },
      true,
      ["sign", "verify"]
    );
    
    const publicKeyRaw = await crypto.subtle.exportKey("raw", keyPair.publicKey);
    const privateKeyJwk = await crypto.subtle.exportKey("jwk", keyPair.privateKey);
    
    const publicKeyBase64 = uint8ArrayToBase64Url(new Uint8Array(publicKeyRaw));
    const privateKeyBase64 = privateKeyJwk.d!; // Already base64url

    const { error: insertError } = await supabase
      .from("push_config")
      .upsert({
        id: "vapid",
        public_key: publicKeyBase64,
        private_key: privateKeyBase64,
      });

    if (insertError) {
      console.error("Error saving VAPID keys:", insertError);
      return null;
    }

    return publicKeyBase64;
  };

  const subscribe = useCallback(async () => {
    if (!isSupported) return false;
    setIsLoading(true);

    try {
      // Request notification permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission denied');
        setIsLoading(false);
        return false;
      }

      // Register service worker
      const registration = await navigator.serviceWorker.register('/push-sw.js');
      await navigator.serviceWorker.ready;

      // Get VAPID public key
      const publicKey = await getOrCreateVapidKeys();
      if (!publicKey) {
        console.error('Failed to get VAPID keys');
        setIsLoading(false);
        return false;
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      const json = subscription.toJSON();
      const p256dh = json.keys?.p256dh;
      const auth = json.keys?.auth;

      if (!p256dh || !auth) {
        console.error('Missing subscription keys');
        setIsLoading(false);
        return false;
      }

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No user logged in');
        setIsLoading(false);
        return false;
      }

      // Save subscription to database
      const { error } = await supabase.from("push_subscriptions").upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh,
        auth,
      }, { onConflict: 'endpoint' });

      if (error) {
        console.error('Error saving subscription:', error);
        setIsLoading(false);
        return false;
      }

      setIsSubscribed(true);
      setIsLoading(false);
      return true;
    } catch (e) {
      console.error('Error subscribing:', e);
      setIsLoading(false);
      return false;
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    setIsLoading(true);
    try {
      const registration = await navigator.serviceWorker.getRegistration('/push-sw.js');
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (subscription) {
          // Remove from database
          await supabase.from("push_subscriptions").delete().eq("endpoint", subscription.endpoint);
          await subscription.unsubscribe();
        }
      }
      setIsSubscribed(false);
    } catch (e) {
      console.error('Error unsubscribing:', e);
    }
    setIsLoading(false);
  }, []);

  return { isSubscribed, isSupported, isLoading, subscribe, unsubscribe };
}
