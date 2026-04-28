"use client";

import { useEffect, useState } from "react";

import ImageUpload from "@/components/imageUpload";

import PrimaryButton from "@/components/PrimaryButton";
import { useNavigate } from "react-router-dom";
import backIcon from "@/assets/icon/ep_back.svg";
import { useAnalyze } from "@/context/useAnalyze";
import { detectFace } from "@/lib/detectFace";
import { loadFaceModels } from "@/lib/faceApi";
import { fileToImage } from "@/lib/fileToImage";

export default function UploadPage() {
  const { state, dispatch } = useAnalyze();
  const [startCamera, setStartCamera] = useState(false);
  const [ready, setReady] = useState(false);
  const [noDetectFaceAlert, setNoDetectFaceAlert] = useState(false);
  const [unsupportFileAlert, setUnsupportFileAlert] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadFaceModels().then(() => setReady(true));
  }, []);


  useEffect(() => {
  document.body.style.overflow = 'hidden';
  return () => {
    document.body.style.overflow = '';
  };
}, []);

  const handleSelectImage = async (file: File) => {
    setNoDetectFaceAlert(false);
    setUnsupportFileAlert(false);

    if (!ready) return;

    dispatch({ type: "SET_IMAGE", payload: file });

    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSize = 3 * 1024 * 1024;

    if (!allowedTypes.includes(file.type) || file.size > maxSize) {
      setUnsupportFileAlert(true);
      return;
    }

    const img = await fileToImage(file);
    const result = await detectFace(img);

    if (!result) {
      setNoDetectFaceAlert(true);
      return;
    }
  };

  const onClear = () => {
  dispatch({ type: "SET_IMAGE", payload: null })
  setStartCamera(false)
  setShowConsent(false)
  setNoDetectFaceAlert(false)
  setUnsupportFileAlert(false)
  };

  const handleNext = () => {
    if (!state.image) return;
    navigate("/veins");
  };

// เปิด camera พร้อม consent เลย
const handleSnap = () => {
  setStartCamera(true);
  setShowConsent(true);
};

  const isButtonDisabled =
    !ready ||
    (state.image ? noDetectFaceAlert || unsupportFileAlert : false);

  return (
  <div className="min-h-screen overflow-hidden p-6 md:bg-[url(@/assets/bg-upload-image.png)] bg-[length:800px] md:bg-[length:1300px] bg-no-repeat bg-fixed bg-center">
      

      <div>
        <img
          src={backIcon}
          alt="homeImage"
          className="max-w-9 cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>

      <h1 className="font-playfair font-semibold py-4 xl:py-4 2xl:py-6 text-center text-[24px] xl:text-[32px] 2xl:text-[40px] text-[#8E1616]">
  {state.image ? "Review your photo" : "Get ready and take your photo"}
      </h1>

      <ImageUpload
        value={state.image}
        noDetectFaceAlert={noDetectFaceAlert}
        unsupportFileAlert={unsupportFileAlert}
        onSelect={handleSelectImage}
        onClear={onClear}
        openCamera={startCamera}
      />

      {!ready && (
        <p className="text-center text-sm text-gray-400 mb-2 animate-pulse">
          Preparing face model...
        </p>
      )}

      <div className="text-center text-[20px] xl:text-[24px] 2xl:text-[28px]">
        <PrimaryButton
          onClick={state.image ? handleNext : handleSnap}
          disabled={isButtonDisabled}
        >
          {state.image ? "Next" : "Start"}
        </PrimaryButton>
      </div>
    </div>
  );
}