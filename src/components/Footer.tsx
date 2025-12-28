import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-card border-t border-border py-8 mt-auto"
    >
      <div className="container mx-auto px-4 text-center">
        <p className="font-display text-lg text-foreground mb-2">
          Gia đình bà Thận
        </p>
        <p className="font-body text-sm text-muted-foreground">
          Nơi lưu giữ những khoảnh khắc yêu thương
        </p>
        <p className="font-body text-xs text-muted-foreground mt-4">
          © {new Date().getFullYear()} • Được xây dựng với tình yêu
        </p>
      </div>
    </motion.footer>
  );
};

export default Footer;
