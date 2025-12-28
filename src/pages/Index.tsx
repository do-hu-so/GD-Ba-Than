import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { ImageIcon, Upload } from "lucide-react";
import Layout from "../components/Layout";
import MasonryImage from "../components/MasonryImage";
import MediaModal from "../components/MediaModal";
import { MediaItem, syncWithCloudinary } from "../services/media";
import { useMediaList } from "../hooks/useMedia";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/family-hero.jpg";

const INITIAL_DISPLAY_COUNT = 10;

const Index = () => {
  const { toast } = useToast();
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);
  const [displayCount, setDisplayCount] = useState(INITIAL_DISPLAY_COUNT);
  const [heroImage, setHeroImage] = useState(heroBg);
  const [showHeroMenu, setShowHeroMenu] = useState(false);

  // Auto-sync on mount (when user visits Home page)
  useEffect(() => {
    console.log("Home page mounted, syncing...");
    syncWithCloudinary();

    // Check local storage for hero image
    const storedHero = localStorage.getItem('heroImage');
    if (storedHero) {
      setHeroImage(storedHero);
    }
  }, []);

  // Fetch all media (both photos and videos) from Cloudinary/localStorage
  const { data: allMedia = [] } = useMediaList();

  const displayedPhotos = allMedia.slice(0, displayCount);
  const hasMorePhotos = displayCount < allMedia.length;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const features = [
    {
      title: "Hình ảnh",
      description: "Lưu giữ những khoảnh khắc đáng nhớ qua từng bức ảnh",
      link: "/photos",
      color: "bg-primary/10",
    },
    {
      title: "Video",
      description: "Những thước phim ghi lại tiếng cười, niềm vui",
      link: "/videos",
      color: "bg-secondary/30",
    },
    {
      title: "Tải lên",
      description: "Thêm kỷ niệm mới vào kho tàng gia đình",
      link: "/upload",
      color: "bg-accent/20",
    },
  ];

  return (
    <Layout>
      {/* Hero Image Section - Full image without text overlay */}
      <section className="relative h-[70vh] overflow-hidden group">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />

        {/* Change Hero Image Button */}
        <div className="absolute bottom-4 right-4 z-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHeroMenu(!showHeroMenu)}
            className="bg-white/90 backdrop-blur-sm text-primary px-4 py-2 rounded-full font-body font-semibold shadow-lg border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300 flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Thay đổi ảnh bìa
          </motion.button>

          {/* Menu Options */}
          {showHeroMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-full right-0 mb-2 bg-white rounded-lg shadow-xl border border-border overflow-hidden min-w-[200px]"
            >
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setHeroImage(e.target?.result as string);
                        localStorage.setItem('heroImage', e.target?.result as string);
                        toast({ title: "Thành công!", description: "Đã cập nhật ảnh bìa" });
                      };
                      reader.readAsDataURL(file);
                    }
                  };
                  input.click();
                  setShowHeroMenu(false);
                }}
                className="w-full px-4 py-3 text-left font-body hover:bg-primary/10 transition-colors flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Tải ảnh bìa mới
              </button>
              <button
                onClick={() => {
                  toast({
                    title: "Chọn từ thư viện",
                    description: "Vui lòng chọn ảnh từ thư viện bên dưới",
                  });
                  setShowHeroMenu(false);
                }}
                className="w-full px-4 py-3 text-left font-body hover:bg-primary/10 transition-colors flex items-center gap-2 border-t border-border"
              >
                <ImageIcon className="w-4 h-4" />
                Chọn từ thư viện
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Hero Content Section - Below the image */}
      <section className="relative py-16 bg-background">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto px-4 text-center"
        >
          <motion.h1
            variants={itemVariants}
            className="font-body text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 text-gradient-warm"
            style={{
              fontWeight: 900,
            }}
          >
            Gia đình bà Thận
          </motion.h1>

          {/* Bouncing characters subtitle - Line 1 */}
          <motion.div
            className="font-body text-lg md:text-xl text-foreground max-w-2xl mx-auto -mb-1"
          >
            {"Nơi lưu giữ những khoảnh khắc yêu thương".split("").map((char, i) => (
              <motion.span
                key={`line1-${i}`}
                custom={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: (i: number) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: i * 0.02,
                      duration: 0.3,
                    },
                  }),
                  bounce: {
                    y: [0, -5, 0],
                    transition: {
                      delay: i * 0.05,
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    },
                  },
                }}
                initial="hidden"
                animate={["visible", "bounce"]}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>

          {/* Bouncing characters subtitle - Line 2 */}
          <motion.div
            className="font-body text-lg md:text-xl text-foreground max-w-2xl mx-auto mb-10"
          >
            {"gắn kết thế hệ qua từng bức ảnh, từng thước phim kỷ niệm".split("").map((char, i) => (
              <motion.span
                key={`line2-${i}`}
                custom={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: (i: number) => ({
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: (i + 45) * 0.02, // Continue delay from line 1
                      duration: 0.3,
                    },
                  }),
                  bounce: {
                    y: [0, -5, 0],
                    transition: {
                      delay: (i + 45) * 0.05,
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                      ease: "easeInOut",
                    },
                  },
                }}
                initial="hidden"
                animate={["visible", "bounce"]}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-8">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/photos"
                className="btn-warm inline-block"
              >
                🖼️ Xem thư viện
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1, rotate: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/upload"
                className="px-6 py-3 rounded-full font-body font-semibold bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-lg inline-block"
              >
                📸 Tải kỷ niệm lên
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Pinterest-style Gallery Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Kho tàng <span className="text-gradient">ký ức</span>
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              Những khoảnh khắc đáng nhớ nhất của gia đình ta
            </p>
          </motion.div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
            {displayedPhotos.map((photo) => (
              <MasonryImage
                key={photo.id}
                photoId={photo.id}
                src={photo.src}
                thumbnail={photo.thumbnail}
                type={photo.type}
                title={photo.title}
                year={photo.year}
                onClick={() => setSelectedMedia(photo)}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            {hasMorePhotos ? (
              <button
                onClick={() => setDisplayCount((prev) => prev + 10)}
                className="btn-warm inline-block"
              >
                Hiển thị thêm ({allMedia.length - displayCount} còn lại)
              </button>
            ) : (
              <Link to="/photos" className="btn-warm inline-block">
                Xem tất cả
              </Link>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Khám phá thêm
            </h2>
            <p className="font-body text-muted-foreground max-w-xl mx-auto">
              Mỗi bức ảnh, mỗi video là một câu chuyện, một kỷ niệm đáng trân trọng
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={feature.link} className="block group">
                  <div className={`${feature.color} rounded-3xl p-8 h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg`}>
                    <h3 className="font-display text-2xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="font-body text-muted-foreground mb-6">
                      {feature.description}
                    </p>
                    <span className="font-body font-semibold text-primary group-hover:underline">
                      Khám phá →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "500+", label: "Hình ảnh" },
              { number: "50+", label: "Video" },
              { number: "10+", label: "Năm kỷ niệm" },
              { number: "∞", label: "Yêu thương" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-4xl md:text-5xl font-bold text-gradient mb-2">
                  {stat.number}
                </div>
                <div className="font-body text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal */}
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

export default Index;
