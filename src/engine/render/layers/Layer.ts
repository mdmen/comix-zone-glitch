import { Vector } from '../../math';
import { Settings } from '../../Settings';
import type { Camera } from '../Camera';
import type { Drawable } from '../Drawable';

export interface LayerOptions {
  container: HTMLElement;
  width?: number;
  height?: number;
  camera?: Camera;
  transparent?: boolean;
}

type AllowedProps = 'zIndex' | 'position';
type Styles = Pick<CSSStyleDeclaration, AllowedProps>;

export abstract class Layer {
  private readonly container;
  protected readonly camera;
  protected readonly node;
  protected readonly width;
  protected readonly height;
  protected readonly transparent;
  private readonly prevPosition = new Vector();

  constructor({
    container,
    camera,
    width = Settings.get('canvasWidth'),
    height = Settings.get('canvasHeight'),
    transparent = true,
  }: LayerOptions) {
    this.width = width;
    this.height = height;
    this.camera = camera;
    this.container = container;
    this.transparent = transparent;

    this.node = this.create();
    this.init();
  }

  private init(): void {
    this.node.classList.add(Settings.get('canvasClassName'));
    this.node.style.width = `${this.width}px`;
    this.node.style.height = `${this.height}px`;

    if (!Settings.get('antialiasing')) {
      this.node.style.imageRendering = 'pixelated';
      this.node.style.textRendering = 'optimizeSpeed';
    }

    this.container.appendChild(this.node);
  }

  public setStyle<T extends keyof Styles>(name: T, value: Styles[T]): void {
    this.node.style[name] = value;
  }

  public getNode(): HTMLElement {
    return this.node;
  }

  protected shouldDraw(drawable: Drawable): boolean {
    if (!drawable.isVisible()) return false;

    return !this.camera || this.camera.isCollidingWith(drawable);
  }

  private shouldSyncWithCamera(): boolean {
    if (!this.camera) return false;

    const cameraPosition = this.camera.getPosition();

    return !cameraPosition.isEqualTo(this.prevPosition);
  }

  private updatePrevPosition(): void {
    const cameraPosition = (this.camera as Camera).getPosition();
    this.prevPosition.copy(cameraPosition);
  }

  public preDraw(): void {
    if (!this.shouldSyncWithCamera()) return;

    this.syncWithCamera();
    this.updatePrevPosition();
  }

  protected abstract create(): HTMLElement;

  protected abstract syncWithCamera(): void;

  public abstract draw(drawable: Drawable): void;

  public abstract postDraw(): void;
}
