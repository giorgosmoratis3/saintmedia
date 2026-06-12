import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  Video, 
  FileText, 
  Save, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  ArrowLeft,
  Globe,
  Package,
  Mail,
  Check,
  GripVertical,
  Upload,
  Loader2,
  Image,
  Phone,
  Bell,
  BellOff,
  MessageSquare,
  Users,
  Briefcase,
  MonitorPlay
} from "lucide-react";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import IPhoneFrame from "@/components/IPhoneFrame";
import HomepageProjectsAdmin from "@/components/HomepageProjectsAdmin";
import { User, Session } from "@supabase/supabase-js";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface PortfolioVideo {
  id: string;
  title: string;
  category: string;
  platform: string;
  views: string;
  video_url: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  is_visible: boolean;
}

interface SiteContent {
  id: string;
  section: string;
  content: Record<string, string>;
}

interface PackageItem {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  is_popular: boolean;
  sort_order: number;
  is_visible: boolean;
}

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  business: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface PartnerLogo {
  id: string;
  name: string;
  image_url: string;
  sort_order: number;
  is_visible: boolean;
}

interface CollaborationRequest {
  id: string;
  service_type: string;
  name: string | null;
  email: string | null;
  phone: string;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

// Sortable Item Component
function SortableItem({ id, children }: { id: string; children: React.ReactNode }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing p-2 text-white/40 hover:text-white/70 z-10"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      {children}
    </div>
  );
}

// Push Notification Button Component
function PushNotificationButton() {
  const { isSubscribed, isSupported, isLoading, subscribe, unsubscribe } = usePushNotifications();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={isSubscribed ? unsubscribe : subscribe}
      disabled={isLoading || !isSupported}
      className={cn("text-white/80 hover:text-white flex-shrink-0", liquidGlassButton)}
      title={!isSupported ? "Δεν υποστηρίζονται ειδοποιήσεις σε αυτή τη συσκευή" : isSubscribed ? "Απενεργοποίηση ειδοποιήσεων" : "Ενεργοποίηση ειδοποιήσεων"}
    >
      {isSubscribed ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
    </Button>
  );
}


const liquidGlassCard = "relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-[60px] saturate-[200%] border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_2px_0_rgba(255,255,255,0.2)_inset]";

const liquidGlassHeader = "bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-[60px] saturate-[200%] border-b border-white/20 shadow-[0_4px_30px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.15)_inset]";

const liquidGlassTabActive = "rounded-2xl backdrop-blur-[60px] saturate-[200%] bg-gradient-to-br from-white/25 via-white/15 to-white/10 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.3)_inset]";

const liquidGlassTabInactive = "rounded-2xl backdrop-blur-[40px] saturate-[180%] bg-gradient-to-br from-white/8 via-white/5 to-white/3 border border-white/15 hover:from-white/15 hover:via-white/10 hover:to-white/8 hover:border-white/25 transition-all duration-300";

const liquidGlassInput = "bg-white/90 border border-white/20 backdrop-blur-[40px] saturate-[180%] text-gray-900 placeholder:text-gray-500 focus:border-white/40 focus:ring-2 focus:ring-white/15 rounded-xl shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.1)_inset]";

const liquidGlassButton = "bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-[40px] saturate-[180%] border border-white/25 shadow-[0_4px_16px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.2)_inset] hover:from-white/25 hover:via-white/15 hover:to-white/10 hover:border-white/35 transition-all duration-300";

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"videos" | "homepage" | "content" | "footer" | "packages" | "submissions" | "logos" | "collab" | "newsletter" | "businesses">("collab");
  const [videos, setVideos] = useState<PortfolioVideo[]>([]);
  const [siteContent, setSiteContent] = useState<SiteContent[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [logos, setLogos] = useState<PartnerLogo[]>([]);
  const [collabRequests, setCollabRequests] = useState<CollaborationRequest[]>([]);
  const [newsletterSubs, setNewsletterSubs] = useState<{id: string; email: string; created_at: string}[]>([]);
  const [businesses, setBusinesses] = useState<{id: string; name: string; scenario: string; notes: string; created_at: string; updated_at: string}[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = useState<{id: string; email: string; created_at: string} | null>(null);
  const [selectedCollab, setSelectedCollab] = useState<CollaborationRequest | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingVideoId, setUploadingVideoId] = useState<string | null>(null);
  const [uploadingThumbnailId, setUploadingThumbnailId] = useState<string | null>(null);
  const [uploadingLogoId, setUploadingLogoId] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const thumbnailInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const logoInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (!session) {
          navigate("/admin-auth");
        } else {
          setTimeout(() => {
            checkAdminAndLoadData(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (!session) {
        navigate("/admin-auth");
      } else {
        checkAdminAndLoadData(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminAndLoadData = async (userId: string) => {
    const { data: roleData } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      await supabase.auth.signOut();
      navigate("/admin-auth");
      return;
    }

    setIsAdmin(true);
    await loadData();
    setLoading(false);
  };

  const loadData = async () => {
    const [videosRes, contentRes, packagesRes, submissionsRes, logosRes, collabRes, newsletterRes, businessesRes] = await Promise.all([
      supabase.from("portfolio_videos").select("*").order("sort_order"),
      supabase.from("site_content").select("*"),
      supabase.from("packages").select("*").order("sort_order"),
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("partner_logos").select("*").order("sort_order"),
      supabase.from("collaboration_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("newsletter_subscribers" as any).select("*").order("created_at", { ascending: false }),
      supabase.from("businesses" as any).select("*").order("created_at", { ascending: false }),
    ]);

    if (videosRes.data) setVideos(videosRes.data);
    if (contentRes.data) {
      setSiteContent(contentRes.data.map(item => ({
        ...item,
        content: item.content as Record<string, string>
      })));
    }
    if (packagesRes.data) setPackages(packagesRes.data);
    if (submissionsRes.data) setSubmissions(submissionsRes.data);
    if (logosRes.data) setLogos(logosRes.data);
    if (collabRes.data) setCollabRequests(collabRes.data);
    if (newsletterRes.data) setNewsletterSubs(newsletterRes.data as any);
    if (businessesRes.data) setBusinesses(businessesRes.data as any);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin-auth");
  };

  // Drag and Drop handlers
  const handleDragEndVideos = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setVideos((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, idx) => ({ ...item, sort_order: idx }));
      });
    }
  };

  const handleDragEndPackages = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setPackages((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, idx) => ({ ...item, sort_order: idx }));
      });
    }
  };

  // Video functions
  const saveVideos = async () => {
    setIsSaving(true);
    try {
      for (const video of videos) {
        await supabase
          .from("portfolio_videos")
          .update({
            title: video.title,
            category: video.category,
            platform: video.platform,
            views: video.views,
            video_url: video.video_url,
            thumbnail_url: video.thumbnail_url,
            sort_order: video.sort_order,
            is_visible: video.is_visible,
          })
          .eq("id", video.id);
      }
      toast({ title: "Αποθηκεύτηκε!", description: "Τα βίντεο ενημερώθηκαν." });
    } catch (error) {
      toast({ title: "Σφάλμα", description: "Κάτι πήγε στραβά.", variant: "destructive" });
    }
    setIsSaving(false);
  };

  const addVideo = async (section: 'social' | 'website') => {
    const platform = section === 'social' ? 'Instagram' : 'Website';
    const category = section === 'social' ? 'Εστιατόριο' : 'Εστιατόριο';
    
    const { data, error } = await supabase
      .from("portfolio_videos")
      .insert({
        title: "Νέο Βίντεο",
        category: category,
        platform: platform,
        views: "0",
        sort_order: videos.length,
      })
      .select()
      .single();

    if (data) {
      setVideos([...videos, data]);
      const sectionName = section === 'social' ? 'Social Media' : 'Ιστοσελίδα & QR Menu';
      toast({ title: "Προστέθηκε!", description: `Νέο βίντεο στο ${sectionName}.` });
    }
  };

  const deleteVideo = async (id: string) => {
    await supabase.from("portfolio_videos").delete().eq("id", id);
    setVideos(videos.filter((v) => v.id !== id));
    toast({ title: "Διαγράφηκε!", description: "Το βίντεο αφαιρέθηκε." });
  };

  const updateVideo = (id: string, field: keyof PortfolioVideo, value: string | boolean | null) => {
    setVideos(videos.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleVideoUpload = async (videoId: string, file: File) => {
    // File size validation (500MB max)
    const MAX_FILE_SIZE = 500 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "Σφάλμα", description: "Το αρχείο είναι πολύ μεγάλο (μέγιστο 500MB).", variant: "destructive" });
      return;
    }

    // MIME type validation
    if (!file.type.startsWith('video/')) {
      toast({ title: "Σφάλμα", description: "Παρακαλώ επιλέξτε αρχείο βίντεο.", variant: "destructive" });
      return;
    }

    // Extension whitelist validation
    const ALLOWED_EXTENSIONS = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      toast({ title: "Σφάλμα", description: `Μη επιτρεπτός τύπος αρχείου. Επιτρέπονται: ${ALLOWED_EXTENSIONS.join(', ')}`, variant: "destructive" });
      return;
    }

    setUploadingVideoId(videoId);
    
    try {
      const fileName = `${videoId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('portfolio-videos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-videos')
        .getPublicUrl(fileName);

      updateVideo(videoId, 'video_url', publicUrl);
      
      // Save immediately
      await supabase
        .from('portfolio_videos')
        .update({ video_url: publicUrl })
        .eq('id', videoId);

      toast({ title: "Επιτυχία!", description: "Το βίντεο ανέβηκε." });
    } catch (error) {
      console.error('Video upload error:', error);
      toast({ title: "Σφάλμα", description: "Αποτυχία ανεβάσματος.", variant: "destructive" });
    } finally {
      setUploadingVideoId(null);
    }
  };

  const handleThumbnailUpload = async (videoId: string, file: File) => {
    // File size validation (10MB max for thumbnails)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "Σφάλμα", description: "Η εικόνα είναι πολύ μεγάλη (μέγιστο 10MB).", variant: "destructive" });
      return;
    }

    // MIME type validation
    if (!file.type.startsWith('image/')) {
      toast({ title: "Σφάλμα", description: "Παρακαλώ επιλέξτε αρχείο εικόνας.", variant: "destructive" });
      return;
    }

    // Extension whitelist validation
    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      toast({ title: "Σφάλμα", description: `Μη επιτρεπτός τύπος αρχείου. Επιτρέπονται: ${ALLOWED_EXTENSIONS.join(', ')}`, variant: "destructive" });
      return;
    }

    setUploadingThumbnailId(videoId);
    
    try {
      const fileName = `thumb-${videoId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('portfolio-videos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-videos')
        .getPublicUrl(fileName);

      updateVideo(videoId, 'thumbnail_url', publicUrl);
      
      // Save immediately
      await supabase
        .from('portfolio_videos')
        .update({ thumbnail_url: publicUrl })
        .eq('id', videoId);

      toast({ title: "Επιτυχία!", description: "Το thumbnail ανέβηκε." });
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      toast({ title: "Σφάλμα", description: "Αποτυχία ανεβάσματος.", variant: "destructive" });
    } finally {
      setUploadingThumbnailId(null);
    }
  };

  // Content functions
  const saveContent = async () => {
    setIsSaving(true);
    try {
      for (const item of siteContent) {
        await supabase
          .from("site_content")
          .update({ content: item.content })
          .eq("id", item.id);
      }
      toast({ title: "Αποθηκεύτηκε!", description: "Το περιεχόμενο ενημερώθηκε." });
    } catch (error) {
      toast({ title: "Σφάλμα", description: "Κάτι πήγε στραβά.", variant: "destructive" });
    }
    setIsSaving(false);
  };

  const updateContent = (id: string, field: string, value: string) => {
    setSiteContent(siteContent.map((item) => 
      item.id === id 
        ? { ...item, content: { ...item.content, [field]: value } } 
        : item
    ));
  };

  // Package functions
  const savePackages = async () => {
    setIsSaving(true);
    try {
      for (const pkg of packages) {
        await supabase
          .from("packages")
          .update({
            name: pkg.name,
            price: pkg.price,
            description: pkg.description,
            features: pkg.features,
            is_popular: pkg.is_popular,
            sort_order: pkg.sort_order,
            is_visible: pkg.is_visible,
          })
          .eq("id", pkg.id);
      }
      toast({ title: "Αποθηκεύτηκε!", description: "Τα πακέτα ενημερώθηκαν." });
    } catch (error) {
      toast({ title: "Σφάλμα", description: "Κάτι πήγε στραβά.", variant: "destructive" });
    }
    setIsSaving(false);
  };

  const addPackage = async () => {
    const { data, error } = await supabase
      .from("packages")
      .insert({
        name: "Νέο Πακέτο",
        price: "0",
        description: "Περιγραφή πακέτου",
        features: ["Feature 1"],
        sort_order: packages.length,
      })
      .select()
      .single();

    if (data) {
      setPackages([...packages, data]);
      toast({ title: "Προστέθηκε!", description: "Νέο πακέτο δημιουργήθηκε." });
    }
  };

  const deletePackage = async (id: string) => {
    await supabase.from("packages").delete().eq("id", id);
    setPackages(packages.filter((p) => p.id !== id));
    toast({ title: "Διαγράφηκε!", description: "Το πακέτο αφαιρέθηκε." });
  };

  const updatePackage = (id: string, field: keyof PackageItem, value: string | boolean | string[]) => {
    setPackages(packages.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  // Submission functions
  const markAsRead = async (id: string) => {
    await supabase.from("contact_submissions").update({ is_read: true }).eq("id", id);
    setSubmissions(submissions.map((s) => (s.id === id ? { ...s, is_read: true } : s)));
  };

  const deleteSubmission = async (id: string) => {
    await supabase.from("contact_submissions").delete().eq("id", id);
    setSubmissions(submissions.filter((s) => s.id !== id));
    toast({ title: "Διαγράφηκε!", description: "Η φόρμα αφαιρέθηκε." });
  };

  // Collaboration Request functions
  const markCollabAsRead = async (id: string) => {
    await supabase.from("collaboration_requests").update({ is_read: true }).eq("id", id);
    setCollabRequests(collabRequests.map((r) => (r.id === id ? { ...r, is_read: true } : r)));
  };

  const deleteCollabRequest = async (id: string) => {
    await supabase.from("collaboration_requests").delete().eq("id", id);
    setCollabRequests(collabRequests.filter((r) => r.id !== id));
    toast({ title: "Διαγράφηκε!", description: "Το αίτημα αφαιρέθηκε." });
  };

  // Logo functions
  const handleDragEndLogos = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setLogos((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, idx) => ({ ...item, sort_order: idx }));
      });
    }
  };

  const saveLogos = async () => {
    setIsSaving(true);
    try {
      for (const logo of logos) {
        await supabase
          .from("partner_logos")
          .update({
            name: logo.name,
            image_url: logo.image_url,
            sort_order: logo.sort_order,
            is_visible: logo.is_visible,
          })
          .eq("id", logo.id);
      }
      toast({ title: "Αποθηκεύτηκε!", description: "Τα logos ενημερώθηκαν." });
    } catch (error) {
      toast({ title: "Σφάλμα", description: "Κάτι πήγε στραβά.", variant: "destructive" });
    }
    setIsSaving(false);
  };

  const addLogo = async () => {
    const { data, error } = await supabase
      .from("partner_logos")
      .insert({
        name: "Νέο Logo",
        image_url: "",
        sort_order: logos.length,
      })
      .select()
      .single();

    if (data) {
      setLogos([...logos, data]);
      toast({ title: "Προστέθηκε!", description: "Νέο logo δημιουργήθηκε." });
    }
  };

  const deleteLogo = async (id: string) => {
    await supabase.from("partner_logos").delete().eq("id", id);
    setLogos(logos.filter((l) => l.id !== id));
    toast({ title: "Διαγράφηκε!", description: "Το logo αφαιρέθηκε." });
  };

  const updateLogo = (id: string, field: keyof PartnerLogo, value: string | boolean | number) => {
    setLogos(logos.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const handleLogoUpload = async (logoId: string, file: File) => {
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: "Σφάλμα", description: "Η εικόνα είναι πολύ μεγάλη (μέγιστο 10MB).", variant: "destructive" });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({ title: "Σφάλμα", description: "Παρακαλώ επιλέξτε αρχείο εικόνας.", variant: "destructive" });
      return;
    }

    const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !ALLOWED_EXTENSIONS.includes(fileExt)) {
      toast({ title: "Σφάλμα", description: `Μη επιτρεπτός τύπος αρχείου. Επιτρέπονται: ${ALLOWED_EXTENSIONS.join(', ')}`, variant: "destructive" });
      return;
    }

    setUploadingLogoId(logoId);
    
    try {
      const fileName = `logo-${logoId}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('portfolio-videos')
        .upload(fileName, file, { upsert: true });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-videos')
        .getPublicUrl(fileName);

      updateLogo(logoId, 'image_url', publicUrl);
      
      await supabase
        .from('partner_logos')
        .update({ image_url: publicUrl })
        .eq('id', logoId);

      toast({ title: "Επιτυχία!", description: "Το logo ανέβηκε." });
    } catch (error) {
      console.error('Logo upload error:', error);
      toast({ title: "Σφάλμα", description: "Αποτυχία ανεβάσματος.", variant: "destructive" });
    } finally {
      setUploadingLogoId(null);
    }
  };

  // Business functions
  const addBusiness = async () => {
    const { data, error } = await supabase
      .from("businesses" as any)
      .insert({ name: "Νέα Επιχείρηση" } as any)
      .select()
      .single();

    if (data) {
      setBusinesses([data as any, ...businesses]);
      setSelectedBusiness((data as any).id);
      toast({ title: "Προστέθηκε!", description: "Νέα επιχείρηση δημιουργήθηκε." });
    }
  };

  const deleteBusiness = async (id: string) => {
    await supabase.from("businesses" as any).delete().eq("id", id);
    setBusinesses(businesses.filter((b) => b.id !== id));
    if (selectedBusiness === id) setSelectedBusiness(null);
    toast({ title: "Διαγράφηκε!", description: "Η επιχείρηση αφαιρέθηκε." });
  };

  const updateBusiness = (id: string, field: string, value: string) => {
    setBusinesses(businesses.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const saveBusiness = async (id: string) => {
    const biz = businesses.find((b) => b.id === id);
    if (!biz) return;
    setIsSaving(true);
    try {
      await supabase
        .from("businesses" as any)
        .update({ name: biz.name, scenario: biz.scenario, notes: biz.notes } as any)
        .eq("id", id);
      toast({ title: "Αποθηκεύτηκε!", description: "Η επιχείρηση ενημερώθηκε." });
    } catch (error) {
      toast({ title: "Σφάλμα", description: "Κάτι πήγε στραβά.", variant: "destructive" });
    }
    setIsSaving(false);
  };

  const unreadCount = submissions.filter(s => !s.is_read).length;
  const unreadCollabCount = collabRequests.filter(r => !r.is_read).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className={cn("p-8 rounded-2xl", liquidGlassCard)}>
          <div className="text-white text-xl">Φόρτωση...</div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "collab" as const, label: "Αιτήματα", icon: Phone, badge: unreadCollabCount > 0 ? unreadCollabCount : null },
    { id: "newsletter" as const, label: "Newsletter", icon: Users, badge: newsletterSubs.length > 0 ? newsletterSubs.length : null },
    { id: "submissions" as const, label: "Φόρμες", icon: Mail, badge: unreadCount > 0 ? unreadCount : null },
    { id: "videos" as const, label: "Videos", icon: Video, badge: null },
    { id: "homepage" as const, label: "Homepage Projects", icon: MonitorPlay, badge: null },
    { id: "logos" as const, label: "Logos", icon: Image, badge: null },
    { id: "packages" as const, label: "Πακέτα", icon: Package, badge: null },
    { id: "businesses" as const, label: "Businesses", icon: Briefcase, badge: businesses.length > 0 ? businesses.length : null },
    { id: "content" as const, label: "Content", icon: FileText, badge: null },
    { id: "footer" as const, label: "Footer", icon: Globe, badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a1a]">
      {/* Header */}
      <header className={cn("sticky top-0 z-50 px-4 py-3", liquidGlassHeader)}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <a href="/" className="text-white/60 hover:text-white transition-colors flex-shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </a>
            <h1 className="text-xl font-bold text-white truncate">
              Admin Panel
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm text-white/60 truncate max-w-[200px]">{user?.email}</span>
            <PushNotificationButton />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className={cn("text-white/80 hover:text-white", liquidGlassButton)}
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Αποσύνδεση</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all flex-shrink-0 relative",
                activeTab === tab.id ? liquidGlassTabActive : liquidGlassTabInactive
              )}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-white/60'}`} />
              <span className={activeTab === tab.id ? 'text-white' : 'text-white/70'}>{tab.label}</span>
              {tab.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Videos Tab */}
        {activeTab === "videos" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Διαχείριση Βίντεο</h2>
              <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                <Button 
                  variant="ghost" 
                  onClick={() => addVideo('social')} 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none text-white", liquidGlassButton)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Social Media
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => addVideo('website')} 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none text-white", liquidGlassButton)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Ιστοσελίδα & QR
                </Button>
                <Button 
                  onClick={saveVideos} 
                  disabled={isSaving} 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none text-white", liquidGlassTabActive)}
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? "..." : "Αποθήκευση"}
                </Button>
              </div>
            </div>

            <p className="text-white/50 text-sm flex items-center gap-2">
              <GripVertical className="w-4 h-4" /> Σύρε για αλλαγή σειράς
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndVideos}>
              <SortableContext items={videos.map(v => v.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {videos.map((video, index) => (
                    <SortableItem key={video.id} id={video.id}>
                      <div className={cn("p-4 pl-12", liquidGlassCard)}>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-mono text-white/50 px-2 py-1 rounded bg-white/10">
                              #{index + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateVideo(video.id, "is_visible", !video.is_visible)}
                                className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                              >
                                {video.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteVideo(video.id)}
                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex flex-col lg:flex-row gap-4">
                            {/* Video Upload & Preview */}
                            <div className="flex-shrink-0">
                              <label className="text-xs text-white/50 mb-2 block">Βίντεο</label>
                              <div className="w-[140px]">
                                <IPhoneFrame>
                                  <div className="w-full h-full bg-black flex items-center justify-center relative">
                                    {video.video_url ? (
                                      <video 
                                        src={video.video_url} 
                                        className="w-full h-full object-cover"
                                        muted
                                        loop
                                        playsInline
                                        onMouseEnter={(e) => e.currentTarget.play()}
                                        onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                      />
                                    ) : (
                                      <div className="text-white/30 text-xs text-center p-2">
                                        Κανένα βίντεο
                                      </div>
                                    )}
                                  </div>
                                </IPhoneFrame>
                                <input
                                  type="file"
                                  accept="video/*"
                                  className="hidden"
                                  ref={(el) => { fileInputRefs.current[video.id] = el; }}
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) handleVideoUpload(video.id, file);
                                  }}
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => fileInputRefs.current[video.id]?.click()}
                                  disabled={uploadingVideoId === video.id}
                                  className={cn("w-full mt-2 text-white/70 hover:text-white text-xs", liquidGlassInput)}
                                >
                                  {uploadingVideoId === video.id ? (
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  ) : (
                                    <Upload className="w-3 h-3 mr-1" />
                                  )}
                                  {uploadingVideoId === video.id ? "..." : "Video"}
                                </Button>
                              </div>
                            </div>

                            {/* Thumbnail Preview */}
                            <div className="flex flex-col items-center">
                              <label className="text-xs text-white/50 mb-1 block">Thumbnail</label>
                              <div 
                                className="w-20 h-20 rounded-lg overflow-hidden flex items-center justify-center"
                                style={{
                                  background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.05) 0%, hsl(0 0% 100% / 0.02) 100%)',
                                  border: '1px solid hsl(0 0% 100% / 0.1)',
                                }}
                              >
                                {video.thumbnail_url ? (
                                  <img 
                                    src={video.thumbnail_url} 
                                    alt="Thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="text-white/30 text-xs text-center p-2">
                                    Καμία εικόνα
                                  </div>
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                ref={(el) => { thumbnailInputRefs.current[video.id] = el; }}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleThumbnailUpload(video.id, file);
                                }}
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => thumbnailInputRefs.current[video.id]?.click()}
                                disabled={uploadingThumbnailId === video.id}
                                className={cn("w-full mt-2 text-white/70 hover:text-white text-xs", liquidGlassInput)}
                              >
                                {uploadingThumbnailId === video.id ? (
                                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                ) : (
                                  <Upload className="w-3 h-3 mr-1" />
                                )}
                                {uploadingThumbnailId === video.id ? "..." : "Thumb"}
                              </Button>
                            </div>

                            {/* Other fields */}
                            <div className="flex-1 grid grid-cols-2 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Τίτλος</label>
                                <Input
                                  value={video.title}
                                  onChange={(e) => updateVideo(video.id, "title", e.target.value)}
                                  className={cn("h-9 text-sm", liquidGlassInput)}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Κατηγορία</label>
                                <select
                                  value={video.category}
                                  onChange={(e) => updateVideo(video.id, "category", e.target.value)}
                                  className={cn("w-full h-9 px-3 text-sm rounded-xl", liquidGlassInput)}
                                  style={{ colorScheme: 'dark' }}
                                >
                                  <option value="Εστιατόριο" className="bg-[#1a1a1a] text-white">Εστιατόριο</option>
                                  <option value="Καφετέρια" className="bg-[#1a1a1a] text-white">Καφετέρια</option>
                                  <option value="Bar" className="bg-[#1a1a1a] text-white">Bar</option>
                                  <option value="Κομμωτήριο" className="bg-[#1a1a1a] text-white">Κομμωτήριο</option>
                                  <option value="Καφέ" className="bg-[#1a1a1a] text-white">Καφέ</option>
                                  <option value="Ξενοδοχείο" className="bg-[#1a1a1a] text-white">Ξενοδοχείο</option>
                                  <option value="Κατάστημα" className="bg-[#1a1a1a] text-white">Κατάστημα</option>
                                  <option value="Άλλο" className="bg-[#1a1a1a] text-white">Άλλο</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Ενότητα / Platform</label>
                                <select
                                  value={video.platform}
                                  onChange={(e) => updateVideo(video.id, "platform", e.target.value)}
                                  className={cn("w-full h-9 px-3 text-sm rounded-xl", liquidGlassInput)}
                                  style={{ colorScheme: 'dark' }}
                                >
                                  <optgroup label="📱 Social Media" className="bg-[#1a1a1a] text-white">
                                    <option value="Instagram" className="bg-[#1a1a1a] text-white">Instagram</option>
                                    <option value="TikTok" className="bg-[#1a1a1a] text-white">TikTok</option>
                                  </optgroup>
                                  <optgroup label="🌐 Ιστοσελίδα & QR Menu" className="bg-[#1a1a1a] text-white">
                                    <option value="QR Menu" className="bg-[#1a1a1a] text-white">QR Menu</option>
                                    <option value="Website" className="bg-[#1a1a1a] text-white">Ιστοσελίδα</option>
                                  </optgroup>
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-white/50 mb-1 block">Views</label>
                                <Input
                                  value={video.views}
                                  onChange={(e) => updateVideo(video.id, "views", e.target.value)}
                                  className={cn("h-9 text-sm", liquidGlassInput)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Homepage Projects Tab */}
        {activeTab === "homepage" && (
          <HomepageProjectsAdmin
            liquidGlassCard={liquidGlassCard}
            liquidGlassButton={liquidGlassButton}
            liquidGlassInput={liquidGlassInput}
            liquidGlassTabActive={liquidGlassTabActive}
          />
        )}


        {/* Content Tab */}
        {activeTab === "content" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Διαχείριση Περιεχομένου</h2>
              <Button 
                onClick={saveContent} 
                disabled={isSaving} 
                size="sm" 
                className={cn("w-full sm:w-auto text-white", liquidGlassTabActive)}
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? "Αποθήκευση..." : "Αποθήκευση"}
              </Button>
            </div>

            {siteContent.filter(s => s.section !== "footer" && s.section !== "why_us").map((section) => (
              <div key={section.id} className={cn("p-4", liquidGlassCard)}>
                <h3 className="text-base font-semibold text-white mb-3 capitalize">
                  {section.section.replace("_", " ")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(section.content).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-xs text-white/50 mb-1 block capitalize">
                        {key.replace(/_/g, " ")}
                      </label>
                      {value.length > 100 ? (
                        <Textarea
                          value={value}
                          onChange={(e) => updateContent(section.id, key, e.target.value)}
                          className={cn("resize-none text-sm", liquidGlassInput)}
                          rows={3}
                        />
                      ) : (
                        <Input
                          value={value}
                          onChange={(e) => updateContent(section.id, key, e.target.value)}
                          className={cn("h-9 text-sm", liquidGlassInput)}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === "packages" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Διαχείριση Πακέτων</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button 
                  variant="ghost" 
                  onClick={addPackage} 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none text-white", liquidGlassButton)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Νέο
                </Button>
                <Button 
                  onClick={savePackages} 
                  disabled={isSaving} 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none text-white", liquidGlassTabActive)}
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? "..." : "Αποθήκευση"}
                </Button>
              </div>
            </div>

            <p className="text-white/50 text-sm flex items-center gap-2">
              <GripVertical className="w-4 h-4" /> Σύρε για αλλαγή σειράς
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndPackages}>
              <SortableContext items={packages.map(p => p.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-4">
                  {packages.map((pkg, index) => (
                    <SortableItem key={pkg.id} id={pkg.id}>
                      <div className={cn("p-4 pl-12", liquidGlassCard)}>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-mono text-white/50 px-2 py-1 rounded bg-white/10">
                                #{index + 1}
                              </span>
                              {pkg.is_popular && (
                                <span className="text-xs bg-white/20 text-white px-2 py-1 rounded">Δημοφιλές</span>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updatePackage(pkg.id, "is_popular", !pkg.is_popular)}
                                className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                                title="Δημοφιλές"
                              >
                                <Check className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updatePackage(pkg.id, "is_visible", !pkg.is_visible)}
                                className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                              >
                                {pkg.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deletePackage(pkg.id)}
                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="text-xs text-white/50 mb-1 block">Όνομα</label>
                              <Input
                                value={pkg.name}
                                onChange={(e) => updatePackage(pkg.id, "name", e.target.value)}
                                className={cn("h-9 text-sm", liquidGlassInput)}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-white/50 mb-1 block">Τιμή (€)</label>
                              <Input
                                value={pkg.price}
                                onChange={(e) => updatePackage(pkg.id, "price", e.target.value)}
                                className={cn("h-9 text-sm", liquidGlassInput)}
                              />
                            </div>
                            <div>
                              <label className="text-xs text-white/50 mb-1 block">Σειρά</label>
                              <Input
                                type="number"
                                value={pkg.sort_order}
                                onChange={(e) => updatePackage(pkg.id, "sort_order", e.target.value)}
                                className={cn("h-9 text-sm", liquidGlassInput)}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs text-white/50 mb-1 block">Περιγραφή</label>
                            <Input
                              value={pkg.description}
                              onChange={(e) => updatePackage(pkg.id, "description", e.target.value)}
                              className={cn("h-9 text-sm", liquidGlassInput)}
                            />
                          </div>

                          <div>
                            <label className="text-xs text-white/50 mb-1 block">Features (ένα ανά γραμμή)</label>
                            <Textarea
                              value={pkg.features.join("\n")}
                              onChange={(e) => updatePackage(pkg.id, "features", e.target.value.split("\n").filter(f => f.trim()))}
                              className={cn("resize-none text-sm", liquidGlassInput)}
                              rows={4}
                            />
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        )}

        {/* Logos Tab */}
        {activeTab === "logos" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Διαχείριση Partner Logos</h2>
              <div className="flex gap-2 w-full sm:w-auto flex-wrap">
                <Button 
                  variant="ghost" 
                  onClick={addLogo} 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none text-white", liquidGlassButton)}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Νέο Logo
                </Button>
                <Button 
                  onClick={saveLogos} 
                  disabled={isSaving} 
                  size="sm" 
                  className={cn("flex-1 sm:flex-none text-white", liquidGlassTabActive)}
                >
                  <Save className="w-4 h-4 mr-1" />
                  {isSaving ? "..." : "Αποθήκευση"}
                </Button>
              </div>
            </div>

            <p className="text-white/50 text-sm flex items-center gap-2">
              <GripVertical className="w-4 h-4" /> Σύρε για αλλαγή σειράς
            </p>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndLogos}>
              <SortableContext items={logos.map(l => l.id)} strategy={verticalListSortingStrategy}>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {logos.map((logo, index) => (
                    <SortableItem key={logo.id} id={logo.id}>
                      <div className={cn("p-4 pl-10", liquidGlassCard)}>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-mono text-white/50 px-2 py-1 rounded bg-white/10">
                              #{index + 1}
                            </span>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateLogo(logo.id, "is_visible", !logo.is_visible)}
                                className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/10"
                              >
                                {logo.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => deleteLogo(logo.id)}
                                className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {/* Logo Preview */}
                          <div 
                            className="w-full h-32 rounded-xl overflow-hidden flex items-center justify-center"
                            style={{
                              background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.08) 0%, hsl(0 0% 100% / 0.03) 100%)',
                              border: '1px solid hsl(0 0% 100% / 0.15)',
                            }}
                          >
                            {logo.image_url ? (
                              <img 
                                src={logo.image_url} 
                                alt={logo.name}
                                className="max-w-full max-h-full object-contain p-3"
                              />
                            ) : (
                              <div className="text-white/30 text-sm text-center p-2">
                                Καμία εικόνα
                              </div>
                            )}
                          </div>
                          
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            ref={(el) => { logoInputRefs.current[logo.id] = el; }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleLogoUpload(logo.id, file);
                            }}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => logoInputRefs.current[logo.id]?.click()}
                            disabled={uploadingLogoId === logo.id}
                            className={cn("w-full text-white/70 hover:text-white text-xs", liquidGlassInput)}
                          >
                            {uploadingLogoId === logo.id ? (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            ) : (
                              <Upload className="w-3 h-3 mr-1" />
                            )}
                            {uploadingLogoId === logo.id ? "Ανεβαίνει..." : "Ανέβασε Logo"}
                          </Button>

                          <div>
                            <label className="text-xs text-white/50 mb-1 block">Όνομα</label>
                            <Input
                              value={logo.name}
                              onChange={(e) => updateLogo(logo.id, "name", e.target.value)}
                              className={cn("h-9 text-sm", liquidGlassInput)}
                              placeholder="Όνομα εταιρείας"
                            />
                          </div>
                        </div>
                      </div>
                    </SortableItem>
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {logos.length === 0 && (
              <div className={cn("p-8 text-center text-white/50", liquidGlassCard)}>
                Δεν υπάρχουν logos. Πάτησε "Νέο Logo" για να προσθέσεις.
              </div>
            )}
          </div>
        )}

        {/* Submissions Tab */}
        {activeTab === "submissions" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                Φόρμες Επικοινωνίας
                {unreadCount > 0 && (
                  <span className="ml-2 text-sm text-white/50">({unreadCount} νέα)</span>
                )}
              </h2>
            </div>

            {submissions.length === 0 ? (
              <div className={cn("p-8 text-center text-white/50", liquidGlassCard)}>
                Δεν υπάρχουν φόρμες επικοινωνίας.
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => (
                  <div 
                    key={sub.id} 
                    className={cn(
                      "p-4 cursor-pointer hover:border-white/40 transition-all",
                      liquidGlassCard,
                      !sub.is_read && "border-white/40"
                    )}
                    onClick={() => { setSelectedSubmission(sub); if (!sub.is_read) markAsRead(sub.id); }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate">{sub.name}</span>
                          {!sub.is_read && (
                            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded flex-shrink-0">Νέο</span>
                          )}
                        </div>
                        <p className="text-sm text-white/60 truncate">{sub.email}</p>
                      </div>
                      <span className="text-xs text-white/40 flex-shrink-0 hidden sm:inline">
                        {new Date(sub.created_at).toLocaleString("el-GR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collaboration Requests Tab */}
        {activeTab === "collab" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-white">
                Αιτήματα Συνεργασίας
                {unreadCollabCount > 0 && (
                  <span className="ml-2 text-sm text-white/50">({unreadCollabCount} νέα)</span>
                )}
              </h2>
            </div>

            {collabRequests.length === 0 ? (
              <div className={cn("p-8 text-center text-white/50", liquidGlassCard)}>
                Δεν υπάρχουν αιτήματα συνεργασίας.
              </div>
            ) : (
              <div className="space-y-3">
                {collabRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className={cn(
                      "p-4 cursor-pointer hover:border-white/40 transition-all",
                      liquidGlassCard,
                      !req.is_read && "border-white/40"
                    )}
                    onClick={() => { setSelectedCollab(req); if (!req.is_read) markCollabAsRead(req.id); }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white truncate">{req.name || "Χωρίς όνομα"}</span>
                          {!req.is_read && (
                            <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded flex-shrink-0">Νέο</span>
                          )}
                        </div>
                        <p className="text-sm text-white/50 truncate">{req.service_type}</p>
                      </div>
                      <span className="text-xs text-white/40 flex-shrink-0 hidden sm:inline">
                        {new Date(req.created_at).toLocaleString("el-GR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Newsletter Tab */}
        {activeTab === "newsletter" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Newsletter Subscribers ({newsletterSubs.length})</h2>
            </div>

            {newsletterSubs.length === 0 ? (
              <div className={cn("p-8 text-center text-white/50", liquidGlassCard)}>
                Δεν υπάρχουν εγγραφές newsletter ακόμα.
              </div>
            ) : (
              <div className="space-y-2">
                {newsletterSubs.map((sub) => (
                  <div
                    key={sub.id}
                    className={cn("p-4 cursor-pointer hover:border-white/40 transition-all", liquidGlassCard)}
                    onClick={() => setSelectedEmail(sub)}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <Mail className="w-4 h-4 text-white/50 flex-shrink-0" />
                        <span className="text-white font-medium text-sm truncate">{sub.email}</span>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-white/40 hidden sm:inline">
                          {new Date(sub.created_at).toLocaleString("el-GR")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Email Detail Modal */}
        {selectedEmail && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedEmail(null)}
          >
            <div 
              className={cn("w-full max-w-md p-6 space-y-5", liquidGlassCard)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Subscriber</h3>
                <button onClick={() => setSelectedEmail(null)} className="text-white/50 hover:text-white text-xl leading-none">&times;</button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Email</label>
                  <p className="text-white font-medium break-all">{selectedEmail.email}</p>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Ημερομηνία εγγραφής</label>
                  <p className="text-white/80 text-sm">{new Date(selectedEmail.created_at).toLocaleString("el-GR")}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("flex-1 text-white", liquidGlassButton)}
                  onClick={() => {
                    navigator.clipboard.writeText(selectedEmail.email);
                    toast({ title: "Αντιγράφηκε!", description: "Το email αντιγράφηκε." });
                  }}
                >
                  Αντιγραφή Email
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => {
                    const pin = prompt("Εισάγετε PIN για διαγραφή:");
                    if (pin === "2222") {
                      (async () => {
                        await supabase.from("newsletter_subscribers" as any).delete().eq("id", selectedEmail.id);
                        setNewsletterSubs(newsletterSubs.filter(s => s.id !== selectedEmail.id));
                        setSelectedEmail(null);
                        toast({ title: "Διαγράφηκε!", description: "Ο συνδρομητής αφαιρέθηκε." });
                      })();
                    } else if (pin !== null) {
                      toast({ title: "Λάθος PIN", description: "Η διαγραφή ακυρώθηκε.", variant: "destructive" });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Διαγραφή
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Collab Detail Modal */}
        {selectedCollab && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCollab(null)}
          >
            <div 
              className={cn("w-full max-w-md p-6 space-y-5", liquidGlassCard)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Αίτημα Συνεργασίας</h3>
                <button onClick={() => setSelectedCollab(null)} className="text-white/50 hover:text-white text-xl leading-none">&times;</button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Όνομα</label>
                  <p className="text-white font-medium">{selectedCollab.name || "Χωρίς όνομα"}</p>
                </div>
                {selectedCollab.email && (
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Email</label>
                    <p className="text-white break-all">{selectedCollab.email}</p>
                  </div>
                )}
                {selectedCollab.phone && (
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Τηλέφωνο</label>
                    <p className="text-white">{selectedCollab.phone}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Υπηρεσία</label>
                  <p className="text-white">{selectedCollab.service_type}</p>
                </div>
                {selectedCollab.message && (
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Μήνυμα</label>
                    <p className="text-white/80 text-sm whitespace-pre-wrap">{selectedCollab.message}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Ημερομηνία</label>
                  <p className="text-white/80 text-sm">{new Date(selectedCollab.created_at).toLocaleString("el-GR")}</p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => {
                    const pin = prompt("Εισάγετε PIN για διαγραφή:");
                    if (pin === "2222") {
                      deleteCollabRequest(selectedCollab.id);
                      setSelectedCollab(null);
                    } else if (pin !== null) {
                      toast({ title: "Λάθος PIN", description: "Η διαγραφή ακυρώθηκε.", variant: "destructive" });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Διαγραφή
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Submission Detail Modal */}
        {selectedSubmission && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedSubmission(null)}
          >
            <div 
              className={cn("w-full max-w-md p-6 space-y-5", liquidGlassCard)}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Φόρμα Επικοινωνίας</h3>
                <button onClick={() => setSelectedSubmission(null)} className="text-white/50 hover:text-white text-xl leading-none">&times;</button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Όνομα</label>
                  <p className="text-white font-medium">{selectedSubmission.name}</p>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Email</label>
                  <p className="text-white break-all">{selectedSubmission.email}</p>
                </div>
                {selectedSubmission.phone && (
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Τηλέφωνο</label>
                    <p className="text-white">{selectedSubmission.phone}</p>
                  </div>
                )}
                {selectedSubmission.business && (
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Επιχείρηση</label>
                    <p className="text-white">{selectedSubmission.business}</p>
                  </div>
                )}
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Μήνυμα</label>
                  <p className="text-white/80 text-sm whitespace-pre-wrap">{selectedSubmission.message}</p>
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Ημερομηνία</label>
                  <p className="text-white/80 text-sm">{new Date(selectedSubmission.created_at).toLocaleString("el-GR")}</p>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => {
                    const pin = prompt("Εισάγετε PIN για διαγραφή:");
                    if (pin === "2222") {
                      deleteSubmission(selectedSubmission.id);
                      setSelectedSubmission(null);
                    } else if (pin !== null) {
                      toast({ title: "Λάθος PIN", description: "Η διαγραφή ακυρώθηκε.", variant: "destructive" });
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Διαγραφή
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === "footer" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Διαχείριση Footer</h2>
              <Button 
                onClick={saveContent} 
                disabled={isSaving} 
                size="sm" 
                className={cn("w-full sm:w-auto text-white", liquidGlassTabActive)}
              >
                <Save className="w-4 h-4 mr-1" />
                {isSaving ? "Αποθήκευση..." : "Αποθήκευση"}
              </Button>
            </div>

            {siteContent.filter(s => s.section === "footer").map((section) => (
              <div key={section.id} className={cn("p-4 space-y-4", liquidGlassCard)}>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Instagram URL</label>
                  <Input
                    value={section.content.instagram_url || ""}
                    onChange={(e) => updateContent(section.id, "instagram_url", e.target.value)}
                    placeholder="https://instagram.com/..."
                    className={cn("h-9 text-sm", liquidGlassInput)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">TikTok URL</label>
                  <Input
                    value={section.content.tiktok_url || ""}
                    onChange={(e) => updateContent(section.id, "tiktok_url", e.target.value)}
                    placeholder="https://tiktok.com/..."
                    className={cn("h-9 text-sm", liquidGlassInput)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Website URL</label>
                  <Input
                    value={section.content.website_url || ""}
                    onChange={(e) => updateContent(section.id, "website_url", e.target.value)}
                    placeholder="https://saintmedia.gr"
                    className={cn("h-9 text-sm", liquidGlassInput)}
                  />
                </div>
                <div>
                  <label className="text-xs text-white/50 mb-1 block">Copyright Text</label>
                  <Input
                    value={section.content.copyright_text || ""}
                    onChange={(e) => updateContent(section.id, "copyright_text", e.target.value)}
                    placeholder="© 2025 SaintMedia. All rights reserved."
                    className={cn("h-9 text-sm", liquidGlassInput)}
                  />
                </div>
              </div>
            ))}

            {siteContent.filter(s => s.section === "footer").length === 0 && (
              <div className={cn("p-4 text-center text-white/50", liquidGlassCard)}>
                Δεν υπάρχει footer content. Θα δημιουργηθεί αυτόματα.
              </div>
            )}
          </div>
        )}

        {/* Businesses Tab */}
        {activeTab === "businesses" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-xl font-semibold text-white">Businesses</h2>
              <Button
                variant="ghost"
                onClick={addBusiness}
                size="sm"
                className={cn("text-white", liquidGlassButton)}
              >
                <Plus className="w-4 h-4 mr-1" />
                Νέα Επιχείρηση
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Business List */}
              <div className="space-y-2">
                {businesses.map((biz) => (
                  <div
                    key={biz.id}
                    onClick={() => setSelectedBusiness(biz.id)}
                    className={cn(
                      "p-4 cursor-pointer transition-all",
                      selectedBusiness === biz.id ? liquidGlassTabActive : liquidGlassCard,
                      "hover:border-white/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium truncate">{biz.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => { e.stopPropagation(); deleteBusiness(biz.id); }}
                        className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10 flex-shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                    <span className="text-xs text-white/40">
                      {new Date(biz.created_at).toLocaleDateString('el-GR')}
                    </span>
                  </div>
                ))}
                {businesses.length === 0 && (
                  <div className={cn("p-4 text-center text-white/50", liquidGlassCard)}>
                    Δεν υπάρχουν επιχειρήσεις.
                  </div>
                )}
              </div>

              {/* Business Detail */}
              <div className="lg:col-span-2">
                {selectedBusiness ? (() => {
                  const biz = businesses.find((b) => b.id === selectedBusiness);
                  if (!biz) return null;
                  return (
                    <div className={cn("p-0 overflow-hidden", liquidGlassCard)}>
                      {/* Header */}
                      <div className={cn("px-5 py-4 flex items-center justify-between", liquidGlassHeader)}>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400/30 to-blue-600/20 flex items-center justify-center border border-white/15">
                            <Briefcase className="w-4 h-4 text-blue-300" />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-sm">{biz.name || "Νέα Επιχείρηση"}</h3>
                            <span className="text-[10px] text-white/40">
                              Τελευταία ενημέρωση: {new Date(biz.updated_at).toLocaleString('el-GR')}
                            </span>
                          </div>
                        </div>
                        <Button
                          onClick={() => saveBusiness(biz.id)}
                          disabled={isSaving}
                          size="sm"
                          className={cn("text-white", liquidGlassTabActive)}
                        >
                          <Save className="w-4 h-4 mr-1" />
                          {isSaving ? "Αποθήκευση..." : "Αποθήκευση"}
                        </Button>
                      </div>

                      <div className="p-5 space-y-6">
                        {/* Business Name */}
                        <div>
                          <label className="text-xs font-medium text-white/60 mb-1.5 block flex items-center gap-1.5">
                            <Briefcase className="w-3 h-3" /> Όνομα Επιχείρησης
                          </label>
                          <Input
                            value={biz.name}
                            onChange={(e) => updateBusiness(biz.id, "name", e.target.value)}
                            className={cn("text-sm", liquidGlassInput)}
                          />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/10" />

                        {/* Scenario Section */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-white/60 flex items-center gap-1.5">
                              <FileText className="w-3 h-3" /> Σενάριο
                            </label>
                            <span className="text-[10px] text-white/30">{biz.scenario.length} χαρακτήρες</span>
                          </div>
                          <Textarea
                            value={biz.scenario}
                            onChange={(e) => {
                              updateBusiness(biz.id, "scenario", e.target.value);
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            ref={(el) => {
                              if (el) {
                                el.style.height = 'auto';
                                el.style.height = el.scrollHeight + 'px';
                              }
                            }}
                            placeholder="Γράψε το σενάριο εδώ..."
                            className={cn("min-h-[120px] text-sm leading-relaxed resize-none overflow-hidden", liquidGlassInput)}
                          />
                        </div>

                        {/* Divider */}
                        <div className="border-t border-white/10" />

                        {/* Notes Section */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs font-medium text-white/60 flex items-center gap-1.5">
                              <MessageSquare className="w-3 h-3" /> Σημειώσεις
                            </label>
                            <span className="text-[10px] text-white/30">{biz.notes.length} χαρακτήρες</span>
                          </div>
                          <Textarea
                            value={biz.notes}
                            onChange={(e) => updateBusiness(biz.id, "notes", e.target.value)}
                            placeholder="Σημειώσεις για την επιχείρηση..."
                            className={cn("min-h-[160px] text-sm leading-relaxed", liquidGlassInput)}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })() : (
                  <div className={cn("p-12 text-center text-white/40", liquidGlassCard)}>
                    <Briefcase className="w-14 h-14 mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Επίλεξε μια επιχείρηση από τη λίστα</p>
                    <p className="text-xs text-white/25 mt-1">ή πρόσθεσε νέα επιχείρηση</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
