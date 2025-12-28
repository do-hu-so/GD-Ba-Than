import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import Layout from "../components/Layout";
import MediaCard from "../components/MediaCard";
import MediaModal from "../components/MediaModal";
import YearFilter from "../components/YearFilter";
import { useMediaByYear } from "../hooks/useMedia";
import { MediaItem, syncWithCloudinary } from "../services/media";

const Photos = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Fetch photos from local store (via hook)
  const { data: photos = [], isLoading, error } = useMediaByYear(selectedYear, 'image');

  // Handle manual sync
  const handleSync = async () => {
    setIsSyncing(true);
    await syncWithCloudinary();
    // Fake delay to show feedback if sync is too fast
    setTimeout(() => setIsSyncing(false), 1000);
  };

  // Auto-sync on mount (when user visits this page)
  useEffect(() => {
    handleSync();
  }, []);

  // Get unique years from photos
  const years = useMemo(() => {
    const uniqueYears = [...new Set(photos.map((photo) => photo.year))];
    return uniqueYears.sort((a, b) => b - a);
  }, [photos]);

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
                Thư viện <span className="text-gradient">Hình ảnh</span>
              </h1>
              <p className="font-body text-muted-foreground max-w-2xl">
                Những khoảnh khắc đáng nhớ của gia đình qua từng bức ảnh
              </p>
            </div>

            <button
              onClick={handleSync}
              disabled={isSyncing}
              className="p-3 bg-secondary/10 hover:bg-secondary/20 rounded-full transition-colors"
              title="Cập nhật hình ảnh mới"
            >
              <RefreshCw className={`w-6 h-6 text-foreground ${isSyncing ? 'animate-spin' : ''}`} />
            </button>
          </motion.div>

          <YearFilter
            years={years}
            selectedYear={selectedYear}
            onSelect={setSelectedYear}
          />

          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
              <p className="font-body text-muted-foreground text-lg mt-4">
                Đang tải hình ảnh...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-body text-destructive text-lg">
                Lỗi khi tải hình ảnh.
              </p>
              <p className="font-body text-muted-foreground text-sm mt-2">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </motion.div>
          ) : photos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-body text-muted-foreground text-lg">
                Chưa có hình ảnh nào{selectedYear ? ` cho năm ${selectedYear}` : ''}
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {photos.map((photo) => (
                <MediaCard
                  key={photo.id}
                  {...photo}
                  onClick={() => setSelectedMedia(photo)}
                />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {selectedMedia && (
        <MediaModal
          isOpen={!!selectedMedia}
          onClose={() => setSelectedMedia(null)}
          type={selectedMedia.type}
          src={selectedMedia.src}
          title={selectedMedia.title}
          year={selectedMedia.year}
          id={selectedMedia.id}
        />
      )}
    </Layout>
  );
};

export default Photos;
