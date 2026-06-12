import { useState, useEffect, useRef } from "react";
import { Play, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import IPhoneFrame from "./IPhoneFrame";
import Projects from "./Projects";
import { Dialog, DialogContent } from "./ui/dialog";
import { useLanguage } from "@/contexts/language-context";

interface PortfolioVideo {
  id: string;
  title: string;
  category: string;
  platform: string;
  views: string;
  video_url: string | null;
  thumbnail_url: string | null;
}

interface PortfolioContent {
  title: string;
  subtitle: string;
}

const Portfolio = () => {
  const { t } = useLanguage();
  const [socialMediaVideos, setSocialMediaVideos] = useState<PortfolioVideo[]>([]);
  const [qrMenuVideos, setQrMenuVideos] = useState<PortfolioVideo[]>([]);
  const [websiteVideos, setWebsiteVideos] = useState<PortfolioVideo[]>([]);
  const [content, setContent] = useState<PortfolioContent>({
    title: t.portfolio.defaultTitle,
    subtitle: t.portfolio.defaultSubtitle,
  });
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<PortfolioVideo | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const [videosRes, contentRes] = await Promise.all([
        supabase.from("portfolio_videos").select("id, title, category, platform, views, video_url, thumbnail_url").eq("is_visible", true).order("sort_order"),
        supabase.from("site_content").select("content").eq("id", "portfolio").maybeSingle(),
      ]);
      if (videosRes.data) {
        setQrMenuVideos(videosRes.data.filter(v => v.platform === "QR Menu"));
        setWebsiteVideos(videosRes.data.filter(v => v.platform === "Website"));
        setSocialMediaVideos(videosRes.data.filter(v => v.platform === "Instagram" || v.platform === "TikTok"));
      }
      if (contentRes.data?.content) setContent(contentRes.data.content as unknown as PortfolioContent);
      setLoading(false);
    };
    fetchData();
  }, []);

  const displaySocialMediaVideos = socialMediaVideos.length > 0 ? socialMediaVideos : [
    { id: "1", title: "Instagram Reel", category: "Εστιατόριο", platform: "Instagram", views: "125K", video_url: null, thumbnail_url: null },
    { id: "2", title: "TikTok Promo", category: "Κομμωτήριο", platform: "TikTok", views: "89K", video_url: null, thumbnail_url: null },
    { id: "3", title: "Instagram Reel", category: "Καφέ", platform: "Instagram", views: "210K", video_url: null, thumbnail_url: null },
  ];

  const liquidGlassCard = {
    background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.05) 0%, hsl(0 0% 100% / 0.02) 100%)',
    backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid hsl(0 0% 100% / 0.08)',
    boxShadow: 'inset 0 1px 0 hsl(0 0% 100% / 0.05)',
  };

  const handleVideoClick = (video: PortfolioVideo) => { if (video.video_url) setSelectedVideo(video); };
  const handleCloseModal = () => setSelectedVideo(null);

  const renderVideoCard = (item: PortfolioVideo) => (
    <div key={item.id} className="group relative cursor-pointer transition-all duration-300 hover:scale-[1.02]" onClick={() => handleVideoClick(item)}>
      <IPhoneFrame className="w-[280px]">
        <div className="w-full h-full relative bg-black">
          {item.video_url ? (
            <>
              {item.thumbnail_url && <img src={item.thumbnail_url} alt={item.title} className="absolute inset-0 w-full h-full object-cover group-hover:opacity-0 transition-opacity duration-300" />}
              <video src={item.video_url} className={`w-full h-full object-cover ${item.thumbnail_url ? 'opacity-0 group-hover:opacity-100 transition-opacity duration-300' : ''}`} muted loop playsInline onMouseEnter={(e) => e.currentTarget.play()} onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />
            </>
          ) : item.thumbnail_url ? (
            <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
          ) : (
            <>
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(hsl(0 0% 100% / 0.05) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100% / 0.05) 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(220 30% 20% / 0.8) 0%, hsl(220 25% 15% / 0.9) 100%)' }} />
            </>
          )}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, hsl(195 100% 50% / 0.15), transparent 70%)' }} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 rounded-full flex items-center justify-center scale-75 group-hover:scale-100 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, hsl(195 100% 50% / 0.15) 0%, hsl(195 100% 50% / 0.05) 100%)', backdropFilter: 'blur(10px)', border: '1px solid hsl(195 100% 50% / 0.3)', boxShadow: '0 0 30px hsl(195 100% 50% / 0.3), 0 4px 20px hsl(195 100% 50% / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.1)' }}>
              <Play className="w-7 h-7 ml-1" fill="hsl(195 100% 50%)" style={{ color: 'hsl(195 100% 50%)' }} />
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-4">
            <div className="p-3 rounded-xl" style={{ background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.05) 0%, hsl(0 0% 100% / 0.02) 100%)', backdropFilter: 'blur(10px)', border: '1px solid hsl(0 0% 100% / 0.08)' }}>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: 'hsl(0 0% 100% / 0.5)' }}>{item.category}</p>
                  <h3 className="font-semibold text-sm" style={{ color: 'hsl(0 0% 100% / 0.9)' }}>{item.title}</h3>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm" style={{ color: 'hsl(195 100% 50%)' }}>{item.views}</p>
                  <p className="text-[10px]" style={{ color: 'hsl(0 0% 100% / 0.4)' }}>{item.platform === "QR Menu" ? t.portfolio.customers : t.portfolio.views}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute top-14 left-3">
            <span className="px-3 py-1 rounded-full text-[10px] font-medium" style={{ background: 'linear-gradient(135deg, hsl(0 0% 100% / 0.05) 0%, hsl(0 0% 100% / 0.02) 100%)', backdropFilter: 'blur(10px)', border: '1px solid hsl(0 0% 100% / 0.08)', color: 'hsl(0 0% 100% / 0.7)' }}>{item.platform}</span>
          </div>
        </div>
      </IPhoneFrame>
    </div>
  );

  if (loading) {
    return (
      <section className="section-padding relative overflow-hidden min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-background/20 border-t-primary" />
      </section>
    );
  }

  return (
    <>
      <section id="portfolio" className="section-padding relative overflow-hidden">
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full blur-[150px]" style={{ background: 'hsl(195 100% 50% / 0.08)' }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'hsl(195 100% 50% / 0.06)' }} />
        <div className="container-max relative z-10">
          <div className="text-center mb-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'hsl(0 0% 100% / 0.95)' }}>{content.title}</h1>
            <p className="max-w-2xl mx-auto text-lg" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>{content.subtitle}</p>
          </div>
          <div className="mb-20">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'hsl(0 0% 100% / 0.95)' }}>{t.portfolio.socialMediaTitle}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">{displaySocialMediaVideos.map(renderVideoCard)}</div>
          </div>
          {websiteVideos.length > 0 && (
            <div className="mb-20">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'hsl(0 0% 100% / 0.95)' }}>{t.portfolio.websiteTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">{websiteVideos.map(renderVideoCard)}</div>
            </div>
          )}
          {qrMenuVideos.length > 0 && (
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'hsl(0 0% 100% / 0.95)' }}>{t.portfolio.qrTitle}</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">{qrMenuVideos.map(renderVideoCard)}</div>
            </div>
          )}
          <Projects />
        </div>
      </section>
      <Dialog open={!!selectedVideo} onOpenChange={handleCloseModal}>
        <DialogContent hideCloseButton className="max-w-[320px] p-0 border-0 bg-transparent shadow-none" style={{ background: 'transparent' }}>
          <button onClick={handleCloseModal} className="absolute -top-12 right-0 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110" style={{ background: 'linear-gradient(135deg, hsl(0 0% 0% / 0.8) 0%, hsl(0 0% 0% / 0.6) 100%)', backdropFilter: 'blur(10px)', border: '1px solid hsl(0 0% 100% / 0.1)' }}>
            <X className="w-5 h-5" style={{ color: 'hsl(0 0% 100%)' }} />
          </button>
          {selectedVideo && (
            <IPhoneFrame className="w-full max-w-[320px] mx-auto">
              <video ref={modalVideoRef} src={selectedVideo.video_url || ''} className="w-full h-full object-cover" controls autoPlay playsInline />
            </IPhoneFrame>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Portfolio;
