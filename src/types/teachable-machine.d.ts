declare module "@teachablemachine/image" {
    export function load(
      modelURL: string,
      metadataURL: string
    ): Promise<{
      predict(
        input: HTMLCanvasElement | HTMLImageElement
      ): Promise<{ className: string; probability: number }[]>;
    }>;
  }