import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import { useToast } from "@/hooks/use-toast";
import { uploadMedia } from "@/services/media";

const Upload = () => {
  const { toast } = useToast();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    );

    if (validFiles.length !== droppedFiles.length) {
      toast({
        title: "Lưu ý",
        description: "Chỉ chấp nhận file hình ảnh hoặc video",
        variant: "destructive",
      });
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (files.length === 0) {
      toast({
        title: "Chưa có file",
        description: "Vui lòng chọn ít nhất một hình ảnh hoặc video",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Upload each file
      let successCount = 0;
      let failCount = 0;

      for (const file of files) {
        try {
          await uploadMedia({
            file,
            title: title || "Gia đình",
            year: parseInt(year),
            description,
            onProgress: (progress) => {
              console.log(`Upload progress for ${file.name}: ${progress}%`);
            },
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to upload ${file.name}:`, error);
          failCount++;
        }
      }

      if (successCount > 0) {
        toast({
          title: "Thành công!",
          description: `Đã tải lên ${successCount} file${failCount > 0 ? ` (${failCount} file thất bại)` : ''}`,
        });
      } else {
        toast({
          title: "Lỗi",
          description: "Không thể tải lên file. Vui lòng kiểm tra cấu hình Cloudinary.",
          variant: "destructive",
        });
      }

      setFiles([]);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi khi tải lên",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Tải <span className="text-gradient">kỷ niệm</span> lên
            </h1>
            <p className="font-body text-muted-foreground">
              Thêm những khoảnh khắc mới vào kho tàng ký ức gia đình
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Drop Zone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${dragActive
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/50"
                }`}
            >
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />

              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <span className="text-3xl">📷</span>
                </div>
                <div>
                  <p className="font-body font-semibold text-foreground">
                    Kéo thả file vào đây
                  </p>
                  <p className="font-body text-sm text-muted-foreground mt-1">
                    hoặc click để chọn file từ máy tính
                  </p>
                </div>
                <p className="font-body text-xs text-muted-foreground">
                  Hỗ trợ: JPG, PNG, GIF, MP4, MOV
                </p>
              </div>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="bg-card rounded-2xl p-4"
              >
                <p className="font-body font-semibold text-foreground mb-3">
                  Đã chọn {files.length} file
                </p>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-background rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">
                          {file.type.startsWith("image/") ? "🖼️" : "🎬"}
                        </span>
                        <div>
                          <p className="font-body text-sm text-foreground line-clamp-1">
                            {file.name}
                          </p>
                          <p className="font-body text-xs text-muted-foreground">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="w-8 h-8 rounded-full bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors"
                      >
                        <span className="text-destructive text-sm">×</span>
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-body font-semibold text-foreground mb-2">
                  Năm <span className="text-destructive">*</span>
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-body font-semibold text-foreground mb-2">
                  Tiêu đề
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="VD: Sinh nhật bà"
                  className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block font-body font-semibold text-foreground mb-2">
                Ghi chú
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả ngắn về kỷ niệm này..."
                rows={3}
                className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={uploading || files.length === 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-warm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Đang tải lên...
                </span>
              ) : (
                "Tải lên"
              )}
            </motion.button>
          </motion.form>
        </div>
      </section>
    </Layout>
  );
};

export default Upload;
