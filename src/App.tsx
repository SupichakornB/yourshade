import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/page";
import UploadPage from "@/pages/upload/page";
import MainLayout from "@/layouts/MainLayout";
import VeinsPage from "@/pages/veins/page";
import StepsPage from "./pages/steps/page";
import LoadingPage from "./pages/loading/page";
import ResultPage from "./pages/result/page";
import Privacy from "@/pages/upload/privacy";

import ProductPage from "./pages/product/page";
import ProductDetailPage from "./pages/product/ProductDetailPage";
import TryOnPage from "./pages/tryon/page";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/veins" element={<VeinsPage />} />
          <Route path="/steps" element={<StepsPage />} />
          <Route path="/loading" element={<LoadingPage />} />
          <Route path="/result" element={<ResultPage />} />

          <Route path="/tryon" element={<TryOnPage />} />
          <Route path="/product/:resultData" element={<ProductPage />} />
          <Route path="/products/:season/:productId" element={<ProductDetailPage />} />
          <Route path="/upload/privacy" element={<Privacy />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;