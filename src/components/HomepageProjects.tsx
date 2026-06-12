import { useEffect, useState, useRef } from "react";
import { Play, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/language-context";
import IPhoneFrame from "./IPhoneFrame";
import MacBookFrame from "./MacBookFrame";
import { Dialog, DialogContent } from "./ui/dialog";

interface HomepageProject {
  id: string;
  title: string;
  description: string;
  video_url: string | null;
  thumbnail_url: string | null;
  frame_type: string;
}

const HomepageProjects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<HomepageProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<HomepageProject | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("homepage_projects")
        .select("id, title, description, video_url, thumbnail_url, frame_type")
        .eq("is_visible", true)
        .order("sort_order");
      if (data) setProjects(data);
      setLoading(false);
    })();
  }, []);

  if (loading || projects.length === 0) return null;

  const title = t.homepageProjects?.title ?? "Πρόσφατα Projects";
  const subtitle =
    t.homepageProjects?.subtitle ??
    "Μερικές από τις δουλειές που έχουμε ολοκληρώσει για τοπικές επιχειρήσεις.";

  const renderMedia = (p: HomepageProject, inFrame: "card" | "modal") => {
    const isMac = p.frame_type === "macbook";
    // Use object-contain so videos fit inside the frame without ugly cropping,
    // regardless of whether the source is portrait or landscape.
    const fit = "object-contain";
    if (!p.video_url) {
      return p.thumbnail_url ? (
        <img src={p.thumbnail_url} alt={p.title} className={`w-full h-full ${fit}`} />
      ) : (
        <div className="w-full h-full bg-black" />
      );
    }
    if (inFrame === "modal") {
      return (
        <video
          ref={modalVideoRef}
          src={p.video_url}
          className={`w-full h-full ${fit}`}
          controls
          autoPlay
          playsInline
        />
      );
    }
    return (
      <>
        {p.thumbnail_url && (
          <img
            src={p.thumbnail_url}
            alt={p.title}
            className={`absolute inset-0 w-full h-full ${fit} group-hover:opacity-0 transition-opacity duration-300`}
          />
        )}
        <video
          src={p.video_url}
          className={`w-full h-full ${fit} ${
            p.thumbnail_url ? "opacity-0 group-hover:opacity-100 transition-opacity duration-300" : ""
          }`}
          muted
          loop
          playsInline
          onMouseEnter={(e) => e.currentTarget.play()}
          onMouseLeave={(e) => {
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
          }}
        />
      </>
    );
  };

  return (
    <>
      <section className="section-padding relative overflow-hidden">
        <div className="container-max relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
              style={{ color: "hsl(0 0% 100% / 0.95)" }}
            >
              {title}
            </h2>
            <p
              className="max-w-2xl mx-auto text-base md:text-lg"
              style={{ color: "hsl(0 0% 100% / 0.6)" }}
            >
              {subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 justify-items-center items-end">
            {projects.map((p) => {
              const isMac = p.frame_type === "macbook";
              return (
                <div
                  key={p.id}
                  className="group cursor-pointer transition-transform duration-300 hover:scale-[1.02] w-full max-w-[420px] flex flex-col"
                  onClick={() => p.video_url && setSelected(p)}
                >
                  <div className="relative">
                    {isMac ? (
                      <MacBookFrame>
                        <div className="relative w-full h-full bg-black">{renderMedia(p, "card")}</div>
                      </MacBookFrame>
                    ) : (
                      <div className="mx-auto w-[240px]">
                        <IPhoneFrame>
                          <div className="relative w-full h-full bg-black">{renderMedia(p, "card")}</div>
                        </IPhoneFrame>
                      </div>
                    )}
                    {p.video_url && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{
                            background:
                              "linear-gradient(135deg, hsl(195 100% 50% / 0.18) 0%, hsl(195 100% 50% / 0.06) 100%)",
                            backdropFilter: "blur(10px)",
                            border: "1px solid hsl(195 100% 50% / 0.35)",
                            boxShadow: "0 0 30px hsl(195 100% 50% / 0.3)",
                          }}
                        >
                          <Play
                            className="w-7 h-7 ml-1"
                            fill="hsl(195 100% 50%)"
                            style={{ color: "hsl(195 100% 50%)" }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="text-center mt-6">
                    <h3 className="font-semibold text-lg" style={{ color: "hsl(0 0% 100% / 0.95)" }}>
                      {p.title}
                    </h3>
                    {p.description && (
                      <p className="text-sm mt-1" style={{ color: "hsl(0 0% 100% / 0.6)" }}>
                        {p.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent
          hideCloseButton
          className={`p-0 border-0 bg-transparent shadow-none ${
            selected?.frame_type === "macbook" ? "max-w-[900px]" : "max-w-[320px]"
          }`}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute -top-12 right-0 z-50 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
            style={{
              background: "linear-gradient(135deg, hsl(0 0% 0% / 0.8) 0%, hsl(0 0% 0% / 0.6) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid hsl(0 0% 100% / 0.1)",
            }}
          >
            <X className="w-5 h-5" style={{ color: "hsl(0 0% 100%)" }} />
          </button>
          {selected && (
            selected.frame_type === "macbook" ? (
              <MacBookFrame>{renderMedia(selected, "modal")}</MacBookFrame>
            ) : (
              <IPhoneFrame className="w-full max-w-[320px] mx-auto">
                {renderMedia(selected, "modal")}
              </IPhoneFrame>
            )
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HomepageProjects;
