import uploadImageIcon from "@/assets/icon/upload-image.svg";
import { useRef, useState, useEffect } from "react";
import CameraModal from "./camera";
import ConsentModal from "@/components/consentModal";
import "@/styles/uploadImage.css";

type Props = {
  value: File | null;
  onSelect: (file: File) => void;
  onClear: () => void;
  openCamera: boolean;
  onConsentClose: () => void;
  noDetectFaceAlert: boolean;
  unsupportFileAlert: boolean;
};

export default function ImageUpload({
  value,
  onSelect,
  onClear,
  onConsentClose,
  openCamera,
  noDetectFaceAlert,
  unsupportFileAlert,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [openConsentModal, setOpenConsentModal] = useState(true);


  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onSelect(file);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
  <div className="text-center">

    <button
      onClick={handleClick}
      className="py-2 px-4 rounded-full inline-flex items-center gap-2 cursor-pointer bg-white text-[20px] xl:text-[24px] 2xl:text-[28px] text-[#8E1616] border border-[#8E1616]"
    >
        <img className="w-4 h-4 xl:w-6 xl:h-6 2xl:w-8 2xl:h-8" src={uploadImageIcon} alt="uploadImageIcon" />
        <span>Upload image</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <div className="flex justify-center">
        <div className="m-5 min-w-full md:min-w-325">
          <div className="flex justify-center">
            {value ? (
<div className="relative w-[384px] h-[512px] xl:w-[660px] xl:h-[440px] 2xl:w-[1096px] 2xl:h-[720px] mx-auto aspect-[4/3] rounded-3xl overflow-hidden border border-gray">             {noDetectFaceAlert && (
                  <div className="rounded-3xl absolute inset-0 z-10 flex items-start justify-center p-4">
                    <div className="relative rounded-[24px] bg-white/60 py-3 px-6 text-center shadow-lg">
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-semibold"
              onClick={onClear}
            >
              ✕
            </span>                   
<p className="text-[12px] xl:text-[16px] 2xl:text-[20px] pr-4 text-center">
  Please try again.{" "}
  <br className="xl:hidden" />
  <span className="text-[12px] xl:text-[16px] 2xl:text-[20px]">We couldn't detect a face in the image.</span>
</p>
                    </div>
                  </div>
                )}

                {unsupportFileAlert && (
                  <div className="rounded-3xl absolute inset-0 z-10 flex items-start justify-center p-4">
                    <div className="relative bg-white/60 rounded-[24px] py-4 px-2 xl:py-4 2xl:py-4 xl:px-6 2xl:px-6 shadow-lg text-left flex flex-col justify-center max-h-[84px] xl:max-h-[120px] 2xl:max-h-[170px] w-full max-w-[396px] xl:max-w-[484px] 2xl:max-w-[576px]">
            <span
              className="absolute top-1 xl:top-2 2xl:top-3 right-1 xl:right-2 2xl:right-2 cursor-pointer pr-[8px] xl:pr-[24px] 2xl:pr-[24px] text-[16px] xl:text-[20px] 2xl:text-[24px] font-semibold"
              onClick={onClear}
            >
              ✕
            </span>     
                      <p className="text-[12px] xl:text-[16px] 2xl:text-[20px] pr-4 text-center">
                        Unsupported file format or file size exceeds the limit. <br/>
                        Please upload a JPG or PNG file under 3 MB.
                      </p>
                    </div>
                  </div>
                )}

                <img
                  src={URL.createObjectURL(value)}
                  className="relative h-full w-full mx-auto rounded-3xl object-cover"
                  alt="preview"
                />
<button
  onClick={onClear}
  className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full bg-white text-[#8E1616] border border-[#8E1616] z-20"
>
  Retake
</button>
              </div>
            ) : (
  <div className="relative">
    <CameraModal startCapture={openCamera} onCapture={onSelect} onClear={onClear} />
    {openConsentModal && (
      <ConsentModal onClose={() => {
        setOpenConsentModal(false);
        onConsentClose();
      }} />
    )}
  </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}