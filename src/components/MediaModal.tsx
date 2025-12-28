import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Pencil, Check, X, Trash2 } from "lucide-react";
import { useUpdateMedia, useDeleteMedia, useDownloadMedia } from "../hooks/useMedia";
import { useToast } from "@/hooks/use-toast";

interface MediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "image" | "video";
  src: string;
  title: string;
  year: number;
  id: string;
}

const MediaModal = ({ isOpen, onClose, type, src, title: initialTitle, year, id }: MediaModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const { mutate: downloadMedia } = useDownloadMedia();
  const { mutate: updateMedia } = useUpdateMedia();
  const { mutate: deleteMedia } = useDeleteMedia();
  const { toast } = useToast();

  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleDownload = () => {
    downloadMedia({ id, type, src, title, year } as any);
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này không? Hành động này không thể hoàn tác.")) {
      deleteMedia(
        { id, src, type, title, year } as any, // Only id is strictly needed based on implementation
        {
          onSuccess: () => {
            toast({
              title: "Đã xóa",
              description: "Ảnh đã được xóa khỏi bộ sưu tập",
            });
            onClose();
          },
          onError: () => {
            toast({
              title: "Lỗi",
              description: "Không thể xóa ảnh",
              variant: "destructive",
            });
          },
        }
      );
    }
  };


  const handleSaveTitle = () => {
    if (title.trim() === "") return;

    updateMedia(
      { id, updates: { title } },
      {
        onSuccess: () => {
          setIsEditing(false);
          toast({
            title: "Thành công",
            description: "Đã cập nhật tên hình ảnh",
          });
        },
        onError: () => {
          toast({
            title: "Lỗi",
            description: "Không thể cập nhật tên hình ảnh",
            variant: "destructive",
          });
          setTitle(initialTitle);
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setTitle(initialTitle);
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-foreground/80 backdrop-blur-sm" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2 }}
            className="relative z-10 max-w-5xl w-full max-h-[90vh] bg-card rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex-1 mr-4">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-xl font-display text-card-foreground bg-background border border-border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-xs"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveTitle();
                        if (e.key === "Escape") handleCancelEdit();
                      }}
                    />
                    <button
                      onClick={handleSaveTitle}
                      className="p-1 hover:bg-green-100 rounded text-green-600 transition-colors"
                      title="Lưu"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-1 hover:bg-red-100 rounded text-red-600 transition-colors"
                      title="Hủy"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-2">
                    <h2 className="font-display text-xl text-card-foreground">{title}</h2>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="p-1 hover:bg-muted rounded transition-all text-muted-foreground hover:text-foreground"
                      title="Sửa tên"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <span className="font-body text-sm text-muted-foreground">{year}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownload}
                  className="btn-warm text-sm py-2"
                >
                  Tải về
                </button>
                <button
                  onClick={handleDelete}
                  className="w-10 h-10 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors text-destructive"
                  title="Xóa ảnh"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-muted hover:bg-accent/20 flex items-center justify-center transition-colors"
                >
                  <span className="text-xl text-muted-foreground">×</span>
                </button>
              </div>
            </div>

            <div className="p-4 flex items-center justify-center bg-muted/50 max-h-[calc(90vh-80px)] overflow-auto">
              {type === "image" ? (
                <img
                  src={src}
                  alt={title}
                  className="max-w-full max-h-[70vh] object-contain rounded-lg"
                />
              ) : (
                <video
                  src={src}
                  controls
                  autoPlay
                  className="max-w-full max-h-[70vh] rounded-lg"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MediaModal;
