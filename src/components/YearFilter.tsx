import { motion } from "framer-motion";

interface YearFilterProps {
  years: number[];
  selectedYear: number | null;
  onSelect: (year: number | null) => void;
}

const YearFilter = ({ years, selectedYear, onSelect }: YearFilterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap items-center gap-2 mb-8"
    >
      <span className="font-body text-sm text-muted-foreground mr-2">Lọc theo năm:</span>
      
      <button
        onClick={() => onSelect(null)}
        className={`relative px-4 py-2 font-body text-sm rounded-full transition-all duration-200 ${
          selectedYear === null
            ? "text-primary-foreground"
            : "text-muted-foreground hover:text-foreground bg-muted hover:bg-accent/20"
        }`}
      >
        {selectedYear === null && (
          <motion.span
            layoutId="year-filter"
            className="absolute inset-0 bg-primary rounded-full"
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10">Tất cả</span>
      </button>
      
      {years.map((year) => (
        <button
          key={year}
          onClick={() => onSelect(year)}
          className={`relative px-4 py-2 font-body text-sm rounded-full transition-all duration-200 ${
            selectedYear === year
              ? "text-primary-foreground"
              : "text-muted-foreground hover:text-foreground bg-muted hover:bg-accent/20"
          }`}
        >
          {selectedYear === year && (
            <motion.span
              layoutId="year-filter"
              className="absolute inset-0 bg-primary rounded-full"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{year}</span>
        </button>
      ))}
    </motion.div>
  );
};

export default YearFilter;
