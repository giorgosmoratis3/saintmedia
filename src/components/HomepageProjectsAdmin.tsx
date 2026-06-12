import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Eye, EyeOff, Upload, Loader2, Save, Smartphone, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import IPhoneFrame from "./IPhoneFrame";
import MacBookFrame from "./MacBookFrame";

interface HomepageProject {
  id: string;
  title: string;
  description: string;
  video_url: string | null;
  thumbnail_url: string | null;
  frame_type: string;
  sort_order: number;
  is_visible: boolean;
}

interface Props {
  liquidGlassCard: string;
  liquidGlassButton: string;
  liquidGlassInput: string;
  liquidGlassTabActive: string;
}

const HomepageProjectsAdmin = ({ liquidGlassCard, liquidGlassButton, liquidGlassInput, liquidGlassTabActive }: Props) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<HomepageProject[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingVid, setUploadingVid] = useState<string | null>(null);
  const [uploadingThumb, setUploadingThumb] = useState<string | null>(null);
  const vidRefs = useRef<{ [k: string]: HTMLInputElement | null }>({});
  const thumbRefs = useRef<{ [k: string]: HTMLInputElement | null }>({});

  const load = async () => {
    const { data } = await supabase.from("homepage_projects").select("*").order("sort_order");
    if (data) setProjects(data);
  };

  useEffect(() => { load(); }, []);

  const addProject = async () => {
    const { data, error } = await supabase
      .from("homepage_projects")
      .insert({ title: "Νέο Project", description: "", frame_type: "iphone", sort_order: projects.length })
      .select()
      .single();
    if (error) { toast({ title: "Σφάλμα", description: error.message, variant: "destructive" }); return; }
    if (data) setProjects([...projects, data]);
  };

  const update = (id: string, field: keyof HomepageProject, value: any) => {
    setProjects(projects.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const remove = async (id: string) => {
    await supabase.from("homepage_projects").delete().eq("id", id);
    setProjects(projects.filter(p => p.id !== id));
  };

  const save = async () => {
    setSaving(true);
    try {
      for (const p of projects) {
        await supabase.from("homepage_projects").update({
          title: p.title, description: p.description, frame_type: p.frame_type,
          sort_order: p.sort_order, is_visible: p.is_visible,
          video_url: p.video_url, thumbnail_url: p.thumbnail_url,
        }).eq("id", p.id);
      }
      toast({ title: "Αποθηκεύτηκε!" });
    } catch (e: any) {
      toast({ title: "Σφάλμα", description: e.message, variant: "destructive" });
    }
    setSaving(false);
  };

  const uploadFile = async (
    id: string, file: File, kind: "video" | "thumb"
  ) => {
    const ALLOWED_VID = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'm4v'];
    const ALLOWED_IMG = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const MAX = kind === 'video' ? 100 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > MAX) { toast({ title: "Σφάλμα", description: "Πολύ μεγάλο αρχείο.", variant: "destructive" }); return; }
    if (kind === 'video' && (!file.type.startsWith('video/') || !ALLOWED_VID.includes(ext))) {
      toast({ title: "Σφάλμα", description: "Μη επιτρεπτός τύπος.", variant: "destructive" }); return;
    }
    if (kind === 'thumb' && (!file.type.startsWith('image/') || !ALLOWED_IMG.includes(ext))) {
      toast({ title: "Σφάλμα", description: "Μη επιτρεπτός τύπος.", variant: "destructive" }); return;
    }

    if (kind === 'video') setUploadingVid(id); else setUploadingThumb(id);
    try {
      const fileName = `${kind === 'video' ? 'hp' : 'hp-thumb'}-${id}-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('portfolio-videos').upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('portfolio-videos').getPublicUrl(fileName);
      const field = kind === 'video' ? 'video_url' : 'thumbnail_url';
      update(id, field as keyof HomepageProject, publicUrl);
      await supabase.from("homepage_projects").update({ [field]: publicUrl }).eq("id", id);
      toast({ title: "Ανέβηκε!" });
    } catch (e: any) {
      toast({ title: "Σφάλμα", description: e.message, variant: "destructive" });
    } finally {
      setUploadingVid(null); setUploadingThumb(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-xl font-semibold text-white">Projects Αρχικής</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="ghost" size="sm" onClick={addProject} className={cn("text-white", liquidGlassButton)}>
            <Plus className="w-4 h-4 mr-1" /> Νέο
          </Button>
          <Button onClick={save} disabled={saving} size="sm" className={cn("text-white", liquidGlassTabActive)}>
            <Save className="w-4 h-4 mr-1" /> {saving ? "..." : "Αποθήκευση"}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {projects.map((p, i) => {
          const isMac = p.frame_type === 'macbook';
          return (
            <div key={p.id} className={cn("p-4", liquidGlassCard)}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-mono text-white/50 px-2 py-1 rounded bg-white/10">#{i + 1}</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => update(p.id, "is_visible", !p.is_visible)} className="h-8 w-8 text-white/50 hover:text-white">
                    {p.is_visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => remove(p.id)} className="h-8 w-8 text-red-400 hover:text-red-300">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row gap-4">
                {/* Preview */}
                <div className="flex-shrink-0">
                  <label className="text-xs text-white/50 mb-2 block">Preview</label>
                  <div className={isMac ? "w-[220px]" : "w-[120px]"}>
                    {isMac ? (
                      <MacBookFrame>
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          {p.video_url ? (
                            <video src={p.video_url} className="w-full h-full object-cover" muted loop playsInline
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />
                          ) : <div className="text-white/30 text-xs">Κανένα βίντεο</div>}
                        </div>
                      </MacBookFrame>
                    ) : (
                      <IPhoneFrame>
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          {p.video_url ? (
                            <video src={p.video_url} className="w-full h-full object-cover" muted loop playsInline
                              onMouseEnter={(e) => e.currentTarget.play()}
                              onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }} />
                          ) : <div className="text-white/30 text-xs p-2 text-center">Κανένα βίντεο</div>}
                        </div>
                      </IPhoneFrame>
                    )}
                  </div>
                  <input type="file" accept="video/*" className="hidden" ref={(el) => { vidRefs.current[p.id] = el; }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(p.id, f, "video"); }} />
                  <Button variant="ghost" size="sm" onClick={() => vidRefs.current[p.id]?.click()} disabled={uploadingVid === p.id}
                    className={cn("w-full mt-2 text-white/70 hover:text-white text-xs", liquidGlassInput)}>
                    {uploadingVid === p.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
                    Video
                  </Button>
                  <input type="file" accept="image/*" className="hidden" ref={(el) => { thumbRefs.current[p.id] = el; }}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(p.id, f, "thumb"); }} />
                  <Button variant="ghost" size="sm" onClick={() => thumbRefs.current[p.id]?.click()} disabled={uploadingThumb === p.id}
                    className={cn("w-full mt-2 text-white/70 hover:text-white text-xs", liquidGlassInput)}>
                    {uploadingThumb === p.id ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Upload className="w-3 h-3 mr-1" />}
                    Thumb
                  </Button>
                </div>

                {/* Fields */}
                <div className="flex-1 space-y-3">
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Τίτλος</label>
                    <Input value={p.title} onChange={(e) => update(p.id, "title", e.target.value)} className={cn("h-9 text-sm", liquidGlassInput)} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Περιγραφή</label>
                    <Input value={p.description} onChange={(e) => update(p.id, "description", e.target.value)} className={cn("h-9 text-sm", liquidGlassInput)} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-1 block">Συσκευή</label>
                    <div className="flex gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => update(p.id, "frame_type", "iphone")}
                        className={cn("flex-1 text-white text-xs", p.frame_type === 'iphone' ? liquidGlassTabActive : liquidGlassButton)}>
                        <Smartphone className="w-4 h-4 mr-1" /> iPhone
                      </Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => update(p.id, "frame_type", "macbook")}
                        className={cn("flex-1 text-white text-xs", p.frame_type === 'macbook' ? liquidGlassTabActive : liquidGlassButton)}>
                        <Laptop className="w-4 h-4 mr-1" /> MacBook
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {projects.length === 0 && (
          <div className={cn("p-8 text-center text-white/50", liquidGlassCard)}>Δεν υπάρχουν projects. Πρόσθεσε ένα!</div>
        )}
      </div>
    </div>
  );
};

export default HomepageProjectsAdmin;
