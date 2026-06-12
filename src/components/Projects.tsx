import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/language-context";

interface Project {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  link_url: string | null;
}

const Projects = () => {
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from("projects")
        .select("id, title, description, image_url, link_url")
        .eq("is_visible", true)
        .order("sort_order");
      if (data) setProjects(data);
      setLoading(false);
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section className="py-20 relative">
        <div className="container-max flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-foreground/20 border-t-primary" />
        </div>
      </section>
    );
  }

  if (projects.length === 0) return null;

  return (
    <section className="py-20 relative">
      <div className="container-max relative z-10">
        <h2
          className="text-2xl md:text-3xl font-bold text-center mb-12"
          style={{ color: "hsl(0 0% 100% / 0.95)" }}
        >
          {t.portfolio.projectsTitle}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl overflow-hidden transition-all duration-500 hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(135deg, hsl(0 0% 100% / 0.06) 0%, hsl(0 0% 100% / 0.02) 100%)",
                border: "1px solid hsl(0 0% 100% / 0.08)",
                boxShadow:
                  "0 4px 24px hsl(0 0% 0% / 0.2), inset 0 1px 0 hsl(0 0% 100% / 0.05)",
              }}
            >
              {/* Image */}
              {project.image_url && (
                <div className="aspect-[4/3] overflow-hidden m-4 rounded-xl">
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Content */}
              <div className="px-5 pb-5 pt-1">
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="font-semibold text-base"
                    style={{ color: "hsl(0 0% 100% / 0.9)" }}
                  >
                    {project.title}
                  </h3>
                  {project.link_url && (
                    <a
                      href={project.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg transition-all duration-300 hover:scale-110"
                      style={{
                        color: "hsl(0 0% 100% / 0.5)",
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
                {project.description && (
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "hsl(0 0% 100% / 0.5)" }}
                  >
                    {project.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
