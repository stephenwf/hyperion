import { ColdSubscription, easing, inertia, listen, pointer, tween, value } from 'popmotion';
import { Runtime } from '../renderer/runtime';
import { Projection, Position } from '../types';
import { RuntimeController } from './controller';

type PopmotionControllerConfig = {
  zoomOut?: HTMLElement | null;
  zoomIn?: HTMLElement | null;
  printX?: HTMLElement | null;
  printY?: HTMLElement | null;
  zoomOutFactor?: number;
  zoomInFactor?: number;
  maxZoomFactor?: number;
  minZoomFactor?: number;
  zoomDuration?: number;
  zoomWheelConstant?: number;
  panBounceStiffness?: number;
  panBounceDamping?: number;
  panTimeConstant?: number;
  panPower?: number;
  nudgeDistance?: number;
  panPadding?: number;
  devicePixelRatio?: number;
  enableWheel?: boolean;
  enableClickToZoom?: boolean;
};

const defaultConfig: Required<PopmotionControllerConfig> = {
  // Optional HTML Elements
  zoomOut: null,
  zoomIn: null,
  printX: null,
  printY: null,
  // Zoom options
  zoomOutFactor: 0.8,
  zoomInFactor: 1.25,
  maxZoomFactor: 1,
  minZoomFactor: 0.05,
  zoomDuration: 300,
  zoomWheelConstant: 100,
  // Pan options.
  panBounceStiffness: 120,
  panBounceDamping: 15,
  panTimeConstant: 240,
  panPower: 0.1,
  nudgeDistance: 100,
  panPadding: 100,
  devicePixelRatio: 1,
  // Flags
  enableWheel: true,
  enableClickToZoom: true,
};

export const popmotionController = (canvas: HTMLElement, config: PopmotionControllerConfig = {}): RuntimeController => (
  runtime: Runtime
) => {
  const {
    zoomOut,
    zoomIn,
    zoomOutFactor,
    zoomInFactor,
    zoomDuration,
    zoomWheelConstant,
    printX,
    printY,
    maxZoomFactor,
    minZoomFactor,
    panBounceStiffness,
    panBounceDamping,
    panTimeConstant,
    panPower,
    nudgeDistance,
    panPadding,
    enableWheel,
    enableClickToZoom,
    devicePixelRatio,
  } = {
    ...defaultConfig,
    ...config,
  };

  // Some user interactions, using popmotion. This is an observer, listening
  //  to the x, y, height and width co-ordinates and updating the views.
  // This acts as a bridge to popmotion, allowing us to twean these values as
  // we see fit.
  const viewer = value(
    {
      x: runtime.target[1],
      y: runtime.target[2],
      width: runtime.target[3] - runtime.target[1],
      height: runtime.target[4] - runtime.target[2],
    } as Projection,
    // This takes in a {x, y, width, height} and updates the viewport.
    runtime.setViewport
  );

  // These two control the dragging, panning and zooming. The second has inertia
  // so it will slow down and bounce on the sides.
  listen(canvas, 'mousedown touchstart').start(() => {
    const { x, y } = viewer.get() as Position;
    pointer({
      x: (-x * runtime.scaleFactor) / devicePixelRatio,
      y: (-y * runtime.scaleFactor) / devicePixelRatio,
    })
      .pipe((v: Position): Position => ({ x: v.x * devicePixelRatio, y: v.y * devicePixelRatio }))
      .pipe((v: Position): Position => ({ x: -v.x / runtime.scaleFactor, y: -v.y / runtime.scaleFactor }))
      .start(viewer);
  });

  listen(document, 'mouseup touchend').start(() => {
    inertia({
      min: runtime.getMinViewportPosition(panPadding),
      max: runtime.getMaxViewportPosition(panPadding),
      bounceStiffness: panBounceStiffness,
      bounceDamping: panBounceDamping,
      timeConstant: panTimeConstant,
      power: panPower,
      velocity: viewer.getVelocity(),
      from: viewer.get(),
    }).start(viewer);
  });

  // A generic zoom to function, with an optional origin parameter.
  // All of the points referenced are world points. You can pass your
  // own in or it will simply default to the middle of the viewport.
  // Note: the factor changes the size of the VIEWPORT on the canvas.
  // So smaller values will zoom in, and larger values will zoom out.
  let currentZoom: ColdSubscription | undefined;
  function zoomTo(factor: number, origin?: Position, stream: boolean = false) {
    if (factor < 1 && runtime.scaleFactor / factor > (1 / minZoomFactor) * devicePixelRatio) {
      factor = runtime.scaleFactor * (minZoomFactor / devicePixelRatio);
    }
    if (factor >= 1 && runtime.scaleFactor / factor < 1 / maxZoomFactor) {
      factor = runtime.scaleFactor;
    }
    // Save the before for the tween.
    const fromPos = runtime.getViewport();
    // set the new scale.
    runtime.setScale(factor, origin);
    // Need to update our observables, for pop-motion
    if (currentZoom) {
      currentZoom.stop();
    }
    currentZoom = tween({
      from: fromPos,
      to: runtime.getViewport(),
      duration: zoomDuration,
      ease: stream ? easing.easeOut : easing.easeInOut,
    }).start(viewer);
  }

  // Let's use that new zoom method, first we will hook up the UI buttons to zoom.
  // Simple zoom out control.
  if (zoomOut) {
    zoomOut.addEventListener('click', () => zoomTo(1 / zoomOutFactor));
  }
  if (zoomIn) {
    // Simple zoom in control.
    zoomIn.addEventListener('click', () => zoomTo(1 / zoomInFactor));
  }

  document.addEventListener('keydown', e => {
    switch (e.code) {
      case 'ArrowLeft':
        tween({
          from: { x: runtime.x, y: runtime.y },
          to: { x: runtime.x - nudgeDistance / runtime.scaleFactor, y: runtime.y },
          duration: zoomDuration,
        }).start(viewer);
        break;
      case 'ArrowRight':
        tween({
          from: { x: runtime.x, y: runtime.y },
          to: { x: runtime.x + nudgeDistance / runtime.scaleFactor, y: runtime.y },
          duration: zoomDuration,
        }).start(viewer);
        break;
      case 'ArrowUp':
        tween({
          from: { x: runtime.x, y: runtime.y },
          to: { x: runtime.x, y: runtime.y - nudgeDistance / runtime.scaleFactor },
          duration: zoomDuration,
        }).start(viewer);
        break;
      case 'ArrowDown':
        tween({
          from: { x: runtime.x, y: runtime.y },
          to: { x: runtime.x, y: runtime.y + nudgeDistance / runtime.scaleFactor },
          duration: zoomDuration,
        }).start(viewer);
        break;
    }
  });

  if (enableWheel) {
    // Next we will add a scrolling event to the scroll-wheel.
    canvas.addEventListener('wheel', e => {
      e.preventDefault();
      zoomTo(
        // Generating a zoom from the wheel delta
        1 + (e.deltaY * devicePixelRatio) / zoomWheelConstant,
        // Convert the cursor to an origin
        runtime.viewerToWorld(e.pageX * devicePixelRatio - canvasPos.left, e.pageY * devicePixelRatio - canvasPos.top),
        true
      );
    });
  }

  // Need this anyway to be in scope.
  let click = false;
  const canvasPos = canvas.getBoundingClientRect();
  if (enableClickToZoom) {
    // For clicking its a little trickier. We want to still allow panning. So this
    // little temporary variable will nuke the value when the mouse is down.
    canvas.addEventListener('mousedown', () => {
      click = true;
      setTimeout(() => {
        click = false;
      }, 500);
    });

    // Next we will add another zoom option, click to zoom. This time the origin will
    // be where our mouse is in relation to the world.
    canvas.addEventListener('click', ({ pageX, pageY }) => {
      if (click) {
        zoomTo(
          0.6,
          runtime.viewerToWorld(pageX * devicePixelRatio - canvasPos.left, pageY * devicePixelRatio - canvasPos.top)
        );
      }
    });
  }

  if (printX || printY || enableClickToZoom) {
    // On mouse move we will display the world co-ordinates over the mouse in the UI.
    canvas.addEventListener('mousemove', ({ pageX, pageY }) => {
      // Here we stop a click if the mouse has moved (starting a drag).
      click = false;
      const { x, y } = runtime.viewerToWorld(
        pageX * devicePixelRatio - canvasPos.left,
        devicePixelRatio * pageY - canvasPos.top
      );

      if (printX) {
        printX.innerText = '' + Math.floor(x);
      }
      if (printY) {
        printY.innerText = '' + Math.floor(y);
      }
    });
  }

  // We won't be changing the runtime here.
  return runtime;
};