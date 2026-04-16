import uploadImageIcon from "@/assets/icon/upload-image.svg";
import { useRef } from "react";
import { useState } from "react";
import CameraModal from "./camera";
import ConsentModal from "@/components/consentModal";
import "@/styles/uploadImage.css";

type Props = {
  value: File | null;
  onSelect: (file: File) => void;
  onClear: () => void;
  openCamera: boolean;
  noDetectFaceAlert: boolean;
  unsupportFileAlert: boolean;
};

export default function ImageUpload({
  value,
  onSelect,
  onClear,
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
        <img src={uploadImageIcon} alt="uploadImageIcon" />
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
<div className="relative w-[384px] h-[512px] xl:w-[838px] xl:h-[512px] 2xl:w-[838px] 2xl:h-[512px] mx-auto aspect-[4/3] rounded-3xl overflow-hidden border border-gray">             {noDetectFaceAlert && (
                  <div className="rounded-3xl absolute inset-0 z-10 flex items-start justify-center p-4">
                    <div className="relative rounded-[24px] bg-white/60 py-3 px-6 text-center shadow-lg">
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-semibold"
              onClick={onClear}
            >
              ✕
            </span>                   
                      <p className="text-[12px] xl:text-[16px] 2xl:text-[20px] pr-4 text-center">
                        Please try again. We couldn't detect a face in the image.
                      </p>
                    </div>
                  </div>
                )}

                {unsupportFileAlert && (
                  <div className="rounded-3xl absolute inset-0 z-10 flex items-start justify-center p-4">
                    <div className="relative rounded-[24px] bg-white/60 py-3 px-6 text-center shadow-lg w-full md:w-[165px] xl:w-[488px] 2xl:w-[650px]">
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-sm font-semibold"
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
              <div className="">
                {openConsentModal ? (
                  <ConsentModal onClose={() => setOpenConsentModal(false)} />
                ) : (
                  <CameraModal startCapture={openCamera} onCapture={onSelect} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}