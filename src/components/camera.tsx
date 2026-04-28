import { useEffect, useRef, useState } from "react";
import frame from "@/assets/face-frame.png";

type Props = {
  startCapture: boolean;
  onCapture: (file: File) => void;
  onClear: () => void;
};

export default function CameraModal({ startCapture, onCapture, onClear }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTips(false), 120000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    })();

    return () => {
      stream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  useEffect(() => {
    if (!startCapture) return;
    setCountdown(3);
  }, [startCapture]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      capture();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((c) => (c !== null ? c - 1 : null));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  const capture = () => {
    const video = videoRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL("image/jpeg");
    setPreviewImage(dataUrl);
    stopCamera();

    canvas.toBlob((blob) => {
      if (!blob) return;

      const file = new File([blob], "camera.jpg", {
        type: "image/jpeg",
      });

      onCapture(file);
    }, "image/jpeg");
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="relative w-[384px] h-[512px] xl:w-[660px] xl:h-[440px] 2xl:w-[1096px] 2xl:h-[720px] mx-auto aspect-[4/3] rounded-3xl overflow-hidden border border-gray">
      {!previewImage && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: "scaleX(-1)" }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 rounded-3xl" />
      
{/* Frame - centered overlay */}
<div className="opacity-100 absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
  <img
    src={frame}
    alt="frame"
    className="w-[262px] h-auto xl:w-auto xl:h-[368px] 2xl:w-auto 2xl:h-[368px]"
  />
</div>

{/* Tips - top overlay */}
{showTips && (
  <div className="absolute inset-0 z-20 flex items-start justify-center p-4">
    <div className="relative bg-white/60 rounded-[24px] py-4 px-4 xl:py-4 2xl:py-6 xl:px-6 2xl:px-6 shadow-lg text-left flex flex-col justify-center max-h-[84px] xl:max-h-[120px] 2xl:max-h-[170px] w-full max-w-[372px] xl:max-w-[484px] 2xl:max-w-[660px]">
      <span
        className="absolute top-2 xl:top-2 2xl:top-6 right-2 xl:right-3 2xl:right-3 cursor-pointer pr-[12px] xl:pr-[24px] 2xl:pr-[24px] text-[16px] xl:text-[20px] 2xl:text-[24px] font-semibold"
        onClick={() => setShowTips(false)}
      >
        ✕
      </span>
      <ul className="font-inter font-normal text-[12px] xl:text-[16px] 2xl:text-[24px] pr-4 text-left leading-4 xl:leading-6 2xl:leading-8">
        <li>• Clean face (bare-faced, no foundation or lipstick)</li>
        <li>• If you have bangs, pin them back</li>
        <li>• Wear a white shirt if possible</li>
        <li>• Use natural daylight (not too yellow)</li>
      </ul>
    </div>
  </div>
)}

      {countdown !== null && !previewImage && (
        <div className="absolute inset-0 flex items-center justify-center text-white text-6xl font-bold bg-black/40 rounded-3xl">
          {countdown}
        </div>
      )}

      <canvas ref={canvasRef} hidden />
    </div>
  );
}