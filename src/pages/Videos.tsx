import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Layout from "../components/Layout";
import MediaCard from "../components/MediaCard";
import MediaModal from "../components/MediaModal";
import YearFilter from "../components/YearFilter";
import { useMediaByYear } from "../hooks/useMedia";
import { MediaItem } from "../services/media";

const Videos = () => {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // Fetch videos from Pinecone
  const { data: videos = [], isLoading, error } = useMediaByYear(selectedYear, 'video');

  // Get unique years from videos
  const years = useMemo(() => {
    const uniqueYears = [...new Set(videos.map((video) => video.year))];
    return uniqueYears.sort((a, b) => b - a);
  }, [videos]);

  return (
    <Layout>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Thư viện <span className="text-gradient">Video</span>
            </h1>
            <p className="font-body text-muted-foreground max-w-2xl">
              Những khoảnh khắc sống động của gia đình qua từng thước phim
            </p>
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
                Đang tải video...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-body text-destructive text-lg">
                Lỗi khi tải video. Vui lòng kiểm tra cấu hình Pinecone.
              </p>
              <p className="font-body text-muted-foreground text-sm mt-2">
                {error instanceof Error ? error.message : 'Unknown error'}
              </p>
            </motion.div>
          ) : videos.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="font-body text-muted-foreground text-lg">
                Chưa có video nào{selectedYear ? ` cho năm ${selectedYear}` : ''}
              </p>
            </motion.div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {videos.map((video) => (
                <MediaCard
                  key={video.id}
                  {...video}
                  onClick={() => setSelectedMedia(video)}
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
        />
      )}
    </Layout>
  );
};

export default Videos;
