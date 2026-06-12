self.addEventListener('push', function(event) {
  let data = { title: 'Νέο Αίτημα Συνεργασίας', body: 'Ένα νέο αίτημα συνεργασίας υποβλήθηκε!' };
  
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    console.error('Error parsing push data:', e);
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'SaintMedia', {
      body: data.body || 'Νέο αίτημα συνεργασίας',
      icon: '/favicon.png',
      badge: '/favicon.png',
      tag: 'collaboration-request',
      data: { url: '/admin' },
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/admin';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(url);
    })
  );
});
