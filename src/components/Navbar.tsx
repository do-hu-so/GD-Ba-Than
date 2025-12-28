import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const navItems = [
  { path: "/", label: "Trang chủ" },
  { path: "/photos", label: "Hình ảnh" },
  { path: "/videos", label: "Video" },
  { path: "/upload", label: "Tải lên" },
];

const Navbar = () => {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-background/95 via-card/95 to-background/95 backdrop-blur-lg border-b-2 border-primary/20 shadow-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo with gradient and icon */}
          <Link to="/" className="group flex items-center gap-2">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg"
            >
              <Heart className="w-5 h-5 text-white fill-white" />
            </motion.div>
            <span className="font-display text-2xl font-bold">
              <span className="text-gradient header-gradient bg-clip-text text-transparent">
                Gia đình bà Thận
              </span>
            </span>
          </Link>

          {/* Badge in center */}
          <motion.span
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="hidden md:inline-block px-4 py-2 bg-white/90 backdrop-blur-sm text-primary font-body text-sm font-bold rounded-full border-2 border-primary shadow-lg"
          >
            Không gian ký ức số
          </motion.span>

          {/* Navigation items */}
          <div className="flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2.5 font-body font-semibold text-sm transition-all duration-300 rounded-full ${isActive
                    ? "text-white shadow-lg"
                    : "text-muted-foreground hover:text-foreground hover:scale-105"
                    }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="navbar-active"
                      className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
