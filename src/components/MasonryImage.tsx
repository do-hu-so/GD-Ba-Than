import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Heart, Play } from "lucide-react";
import { toggleLike, getLikes, isLikedByUser, setUserLike } from "../services/media";

interface MasonryImageProps {
  src: string;
  thumbnail?: string;
  title: string;
  year: number;
  photoId: string;
  type?: 'image' | 'video';
  onClick: () => void;
}

const MasonryImage = ({ src, thumbnail, title, year, photoId, type = 'image', onClick }: MasonryImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  // Load initial likes and user's like status
  useEffect(() => {
    setLikes(getLikes(photoId));
    setIsLiked(isLikedByUser(photoId));
  }, [photoId]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();

    // Toggle like in media store
    const newLikes = toggleLike(photoId, isLiked);
    setLikes(newLikes);

    // Toggle user's like status
    setUserLike(photoId, !isLiked);
    setIsLiked(!isLiked);

    // Show animation when liking
    if (!isLiked) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 600);
    }
  };

  // Use thumbnail for video, src for image
  const displaySrc = type === 'video' && thumbnail ? thumbnail : src;
  const isVideo = type === 'video';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="break-inside-avoid mb-4 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <img
          src={displaySrc}
          alt={title}
          className={`w-full object-cover transition-all duration-500 group-hover:scale-110 ${isLoaded ? "opacity-100" : "opacity-0"
            }`}
          onLoad={() => setIsLoaded(true)}
        />

        {!isLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted min-h-[200px]" />
        )}

        {/* Video play icon overlay */}
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 text-primary-foreground fill-primary-foreground ml-1" />
            </div>
          </div>
        )}

        {/* Heart animation on like */}
        <AnimatePresence>
          {showHeartAnimation && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 1.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <Heart className="w-20 h-20 text-destructive fill-destructive" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Like button - always visible */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200 shadow-md"
        >
          <Heart
            className={`w-4 h-4 transition-all duration-200 ${isLiked ? "text-destructive fill-destructive scale-110" : "text-muted-foreground"
              }`}
          />
          <span className={`text-xs font-semibold font-body ${isLiked ? "text-destructive" : "text-muted-foreground"}`}>
            {likes}
          </span>
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="inline-block px-2 py-1 text-xs font-body font-semibold bg-primary text-primary-foreground rounded-full mb-2">
            {year}
          </span>
          <h3 className="font-display text-lg text-primary-foreground line-clamp-2">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default MasonryImage;
