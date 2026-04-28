import ScrollToTop from "@/components/ScrollToTop";
import { Outlet } from "react-router-dom";

export default function MainLayout() {

  return (
    <div className="relative min-h-screen bg-[#FAFAFA]">
      <main>
        <Outlet />
      </main>
    </div>
  );
}
