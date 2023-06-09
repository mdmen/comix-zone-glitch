import { isSafari } from './browsers';
import { createCanvas, createContext2D } from './canvas';

export function getReversedImage(image: HTMLImageElement): HTMLImageElement {
  const canvas = createCanvas(image.width, image.height);
  const context = createContext2D(canvas);

  context.translate(image.width, 0);
  context.scale(-1, 1);
  context.drawImage(image, 0, 0);

  return extractImageFromCanvas(canvas);
}

export function getScaledImage(
  image: HTMLImageElement,
  scale: number
): HTMLImageElement {
  if (scale === 1) return image;

  const width = Math.floor(image.width * scale);
  const height = Math.floor(image.height * scale);
  const canvas = createCanvas(width, height);
  const context = createContext2D(canvas);

  context.drawImage(
    image,
    0,
    0,
    image.width,
    image.height,
    0,
    0,
    width,
    height
  );

  return extractImageFromCanvas(canvas);
}

function extractImageFromCanvas(canvas: HTMLCanvasElement): HTMLImageElement {
  const image = new Image();

  const type = isSafari() ? 'png' : 'webp';
  image.src = canvas.toDataURL(`image/${type}`);

  return image;
}
