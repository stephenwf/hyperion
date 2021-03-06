/**
 * Simple viewer context
 * *****************************************************************************
 *
 * This will be the context to use to get a basic IIIF viewer up and running.
 * It will not focus on having compatibility with the full range of IIIF
 * resources, instead offering a viewer for a Manifest, cycling through canvases
 * while ignoring the paged/facing-pages/continuous behaviors.
 *
 * There will not be support for canvas-on-canvas annotations. Annotations will
 * be filtered, giving details of the canvas space and images to be annotated
 * onto that space. The demo implementation of this viewer will use
 * OpenSeadragon to display.
 *
 * Navigation functions will include the basics:
 * - nextCanvas()
 * - previousCanvas()
 * - goToCanvas(id)
 * - goToFirstCanvas()
 * - goToLastCanvas()
 *
 * It will take in only a Manifest ID and will load that Manifest when the
 * context loads.
 *
 * There will be no support for external or embedded annotation lists, although
 * you can set up a nested context to support this.
 *
 * There will be no support for ranges in this view.
 *
 * To use this component, first you will need the provider:
 * import { SimpleViewerProvider } from '...';
 *
 * <SimpleViewerProvider id="http://example.org/manifest.json">
 *   <CustomComponent />
 * </SimpleViewerProvider>
 *
 * This is in addition to the core Vault context further up the tree.
 *
 * In components that you want to use parts of the state you can grab the hooks
 * from this file.
 *
 * import { useSimpleViewer } from '...';
 *
 * And use them in your components to get the actions.
 *
 * function NextButton() {
 *   const { nextCanvas } = useSimpleViewer();
 *
 *   return <button onClick={nextCanvas}>Next</button>;
 * }
 *
 * Since this is a single-context, there is only ever one manifest, canvas and
 * annotation list. You can access the current resource using the normal hooks.
 *
 * function CanvasMetadata() {
 *   const metadata = useCanvas(metadataSelector);
 *
 *   return <div> ... </div>
 * }
 *
 * So long as this is inside the provider, it will have the correct context.
 */

export const simpleViewerHyperionContext = null;

export const SimpleViewerProvider = null;

export function useSimpleViewer() {
  return null;
}
