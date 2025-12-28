import { motion } from "framer-motion";
import { useState } from "react";
import { Download } from "lucide-react";
import { useDownloadMedia } from "@/hooks/useMedia";
import { useToast } from "@/hooks/use-toast";

interface MediaCardProps {
  id: string;
  type: "image" | "video";
  src: string;
  thumbnail?: string;
  title: string;
  year: number;
  description?: string;
  uploadedBy?: string;
  createdAt: string;
  fileSize?: number;
  mimeType?: string;
  onClick: () => void;
}

const MediaCard = ({ id, type, src, thumbnail, title, year, description, uploadedBy, createdAt, fileSize, mimeType, onClick }: MediaCardProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const { mutate: downloadMedia, isPending: isDownloading } = useDownloadMedia();

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click

    downloadMedia(
      { id, type, src, thumbnail, title, year, description, uploadedBy, createdAt, fileSize, mimeType },
      {
        onSuccess: () => {
          toast({
            title: "Thành công!",
            description: `Đã tải xuống ${title}`,
          });
        },
        onError: (error) => {
          toast({
            title: "Lỗi",
            description: error instanceof Error ? error.message : "Không thể tải xuống file",
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="card-memory cursor-pointer group relative"
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {type === "image" ? (
          <img
            src={src}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isLoaded ? "opacity-100" : "opacity-0"
              }`}
            onLoad={() => setIsLoaded(true)}
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={thumbnail || src}
              alt={title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${isLoaded ? "opacity-100" : "opacity-0"
                }`}
              onLoad={() => setIsLoaded(true)}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-foreground/20 group-hover:bg-foreground/30 transition-colors">
              <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary-foreground border-b-8 border-b-transparent ml-1"
                  style={{ borderLeftWidth: '14px' }}
                />
              </div>
            </div>
          </div>
        )}

        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/60 to-transparent">
          <span className="inline-block px-2 py-1 text-xs font-body font-semibold bg-primary text-primary-foreground rounded-full mb-1">
            {year}
          </span>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity shadow-lg disabled:opacity-50"
          title="Tải xuống"
        >
          {isDownloading ? (
            <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          ) : (
            <Download className="w-5 h-5 text-foreground" />
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="font-display text-lg text-card-foreground line-clamp-1">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

export default MediaCard;
