import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [opacity, setOpacity] = useState(0.5);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      
      if (maxScroll <= 0) {
        setOpacity(0.5);
        return;
      }
      setOpacity(scrolled > 0 ? 0.5 : 1); 
      // opacity 0.5 ตอนยังไม่ scroll, ค่อยๆ เพิ่มจนถึง 1 เมื่อ scroll ถึงล่างสุด

    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      style={{ opacity }}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-12 h-12 rounded-full bg-[#F4E8E8] shadow-md transition-opacity duration-200"
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8E1616" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12 7-7 7 7"/>
        <path d="M12 19V5"/>
      </svg>
    </button>
  );
}