import { useState, useEffect } from "react";
import { Search, MessageSquare, AlertCircle } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface LibraryVideo {
  id: string;
  title: string;
  keywords: string[] | null;
  usage_count: number;
}

interface Props {
  productName: string;
  selectedVideoId: string;
  onSelectVideo: (videoId: string) => void;
  onRequestTranslation: () => void;
}

export default function LSCLibrarySearch({
  productName,
  selectedVideoId,
  onSelectVideo,
  onRequestTranslation,
}: Props) {
  const [videos, setVideos] = useState<LibraryVideo[]>([]);
  const [suggestions, setSuggestions] = useState<LibraryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadLibrary();
  }, []);

  useEffect(() => {
    // Auto-suggest based on product name
    if (productName.trim()) {
      const productText = productName.toLowerCase();
      const autoSuggestions = videos.filter((video) => {
        const keywords = video.keywords || [];
        return (
          video.title.toLowerCase() === productText ||
          keywords.some((kw) => productText.includes(kw.toLowerCase()))
        );
      });
      setSuggestions(autoSuggestions);
    } else {
      setSuggestions([]);
    }
  }, [productName, videos]);

  const loadLibrary = async () => {
    try {
      const { data } = await supabase
        .from("lsc_library")
        .select("id, title, keywords, usage_count")
        .eq("status", "active");

      setVideos(data || []);
    } catch (err) {
      console.error("Error loading LSC library:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = searchTerm
    ? videos.filter((video) =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (video.keywords || []).some((kw) => kw.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : videos;

  const selectedVideo = videos.find((v) => v.id === selectedVideoId);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-foreground">Video LSC VISUALSC</label>

      {/* Selected Video Display */}
      {selectedVideo && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-green-900">{selectedVideo.title}</p>
              <p className="text-sm text-green-700 mt-1">
                Asociado a {selectedVideo.usage_count} productos
              </p>
            </div>
            <button
              onClick={() => onSelectVideo("")}
              className="text-green-600 hover:text-green-700 font-medium text-sm"
            >
              Cambiar
            </button>
          </div>
        </div>
      )}

      {!selectedVideo && (
        <div className="space-y-4">
          {/* Auto-Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="font-semibold text-blue-900 mb-3">
                Sugerencias automaticas para "{productName}"
              </p>
              <div className="space-y-2">
                {suggestions.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => onSelectVideo(video.id)}
                    className="w-full text-left p-3 rounded-lg bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <p className="font-medium text-blue-900">{video.title}</p>
                    <p className="text-xs text-blue-700 mt-1">
                      Asociado a {video.usage_count} productos
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Manual Search */}
          <div>
            <div className="relative mb-3">
              <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar en biblioteca maestra..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {loading ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Cargando biblioteca...
              </p>
            ) : filteredVideos.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {filteredVideos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => onSelectVideo(video.id)}
                    className="w-full text-left p-3 rounded-lg border border-border hover:border-primary hover:bg-background transition-colors"
                  >
                    <p className="font-medium text-foreground text-sm">{video.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {(video.keywords || []).join(", ")} - {video.usage_count} asociaciones
                    </p>
                  </button>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-6">
                <AlertCircle size={24} className="text-orange-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No hay videos para "{searchTerm}"
                </p>
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground text-sm">
                {videos.length} videos disponibles en la biblioteca VISUALSC
              </div>
            )}
          </div>

          {/* Request Translation */}
          {suggestions.length === 0 && !selectedVideo && (
            <button
              onClick={onRequestTranslation}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-dashed border-orange-300 text-orange-600 hover:border-orange-400 hover:bg-orange-50 transition-colors"
            >
              <MessageSquare size={20} />
              <span className="font-medium">Solicitar traduccion LSC</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
