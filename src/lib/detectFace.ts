export async function detectFace(img: HTMLImageElement) {
  const faceapi = await import("face-api.js");
  const result = await faceapi
    .detectSingleFace(
      img,
      new faceapi.TinyFaceDetectorOptions({
        inputSize: 512,
        scoreThreshold: 0.5,
      })
    )
  return result ?? null;
}