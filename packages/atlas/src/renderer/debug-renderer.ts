import { FrameData } from 'framesync';
import { SpacialContent } from '../spacial-content';
import { World } from '../world';
import { Renderer } from './renderer';

export class DebugRenderer implements Renderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  heightRatio: number = 1;
  widthRatio: number = 1;
  target: Float32Array = new Float32Array(5);

  firstRender = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  afterFrame(world: World, data: FrameData, target: Float32Array) {
    // Everything in this debugger happens at the end of the render cycle.
    // This debugger is made to be hacked and changed as needed, so some
    // variables are set up as a convenience.
    // First we clear.
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // We figure out the size of the debugger in relation to the world.
    if (this.firstRender) {
      this.widthRatio = this.canvas.width / world.width;
      this.heightRatio = this.canvas.height / world.height;
      if (this.widthRatio > this.heightRatio) {
        this.widthRatio = this.heightRatio;
        this.canvas.width = world.width * this.widthRatio;
      } else {
        this.heightRatio = this.widthRatio;
        this.canvas.height = world.height * this.heightRatio;
      }
      this.firstRender = false;
    }

    // If it needs to be used in other methods, it can be.
    this.target = target;

    // Get every point on the world, that is laying out the world items, but
    // not the images that make up the world items. (i.e. canvas dimensions and
    // their positions)
    world.getPoints().forEach((v, k, arr) => {
      // Technically not needed, but some might have been hidden.
      // Could make these a different border.
      if (k % 5 === 0 && v) {
        // Descriptive drawing object, doesn't need to be fast.
        // We are not using all of these fields.
        const toDraw = {
          x1: arr[k + 1] * this.widthRatio,
          y1: arr[k + 2] * this.heightRatio,
          x2: arr[k + 3] * this.widthRatio,
          y2: arr[k + 4] * this.heightRatio,
          width: (arr[k + 3] - arr[k + 1]) * this.widthRatio,
          height: (arr[k + 4] - arr[k + 2]) * this.heightRatio,
        };

        // World items are red bordered boxes.
        this.context.strokeStyle = 'red';
        this.context.strokeRect(toDraw.x1, toDraw.y1, toDraw.width, toDraw.height);
      }
    });

    // If there's a viewport attached, we can render that too
    // There may not be a target, if someone is just debugging a world.
    if (target) {
      // This will be a green box.
      this.context.strokeStyle = 'green';
      this.context.strokeRect(
        target[1] * this.widthRatio,
        target[2] * this.heightRatio,
        (target[3] - target[1]) * this.widthRatio,
        (target[4] - target[2]) * this.heightRatio
      );
    }
  }

  getScale(width: number, height: number): number {
    return 1;
  }

  beforeFrame(world: World, data: FrameData) {
    // no op.
  }

  drawImage(url: string, x: number, y: number, width: number, height: number) {
    // no op.
  }

  afterPaintLayer(paint: SpacialContent, transform?: Float32Array): void {
    // paint.
  }

  paint(paint: SpacialContent, index: number, x: number, y: number, width: number, height: number): void {
    // paint.
  }

  prepareLayer(paint: SpacialContent): void {
    // prepare
  }

  pendingUpdate(): boolean {
    // change this to true if you want to render every frame.
    return false;
  }
}
