import { GridBuilder, SingleImage, WorldObject } from '@hyperion-framework/atlas';
import { Vault } from '@hyperion-framework/vault';
import { renderWorld } from './render-world';
import { imagesFromIIIF } from './images-from-iiif';

const vault = new Vault();

imagesFromIIIF(vault, location.hash.slice(1) || 'https://view.nls.uk/manifest/9713/97134287/manifest.json').then(
  images => {
    const builder = new GridBuilder();

    builder.setWidth(window.innerWidth);
    builder.setViewingDirection('left-to-right');
    builder.setPadding(72);
    builder.setSpacing(50);

    builder.addContent([
      new WorldObject({
        id: 'test 1',
        width: 239,
        height: 98,
        layers: [
          SingleImage.fromSvg(
            `
            <svg width="239" height="98" xmlns="http://www.w3.org/2000/svg">
              <g transform="translate(-91 -552)" fill="none" fill-rule="evenodd">
                <circle fill="#242E7A" cx="140" cy="601" r="49"/>
                <path fill="#FFF603" d="M139.5 565l29.5 59h-59z"/>
                <path fill="#242E7A" d="M109 604.396L141 574l-27.876 35zM109 613.396L141 583l-27.876 35zM127 640.396L159 610l-27.876 35zM116 628.738L152 594l-31.36 40z"/>
                <path d="M221.064 578.2h9.536l7.296 44.8h-7.04l-1.28-8.896v.128h-8l-1.28 8.768h-6.528l7.296-44.8zm7.68 29.952l-3.136-22.144h-.128l-3.072 22.144h6.336zm15.104-23.552h-7.36v-6.4h21.76v6.4h-7.36V623h-7.04v-38.4zm17.792-6.4h7.04v38.4h11.584v6.4H261.64v-44.8zm27.712 0h9.536l7.296 44.8h-7.04l-1.28-8.896v.128h-8l-1.28 8.768h-6.528l7.296-44.8zm7.68 29.952l-3.136-22.144h-.128l-3.072 22.144h6.336zm21.504 15.488c-3.413 0-5.995-.97-7.744-2.912-1.75-1.941-2.624-4.725-2.624-8.352v-2.56h6.656v3.072c0 2.901 1.216 4.352 3.648 4.352 1.195 0 2.101-.352 2.72-1.056.619-.704.928-1.845.928-3.424 0-1.877-.427-3.53-1.28-4.96-.853-1.43-2.432-3.147-4.736-5.152-2.901-2.56-4.928-4.875-6.08-6.944-1.152-2.07-1.728-4.405-1.728-7.008 0-3.541.896-6.283 2.688-8.224 1.792-1.941 4.395-2.912 7.808-2.912 3.37 0 5.92.97 7.648 2.912 1.728 1.941 2.592 4.725 2.592 8.352v1.856h-6.656v-2.304c0-1.536-.299-2.656-.896-3.36-.597-.704-1.472-1.056-2.624-1.056-2.347 0-3.52 1.43-3.52 4.288 0 1.621.437 3.136 1.312 4.544.875 1.408 2.464 3.115 4.768 5.12 2.944 2.56 4.97 4.885 6.08 6.976 1.11 2.09 1.664 4.544 1.664 7.36 0 3.67-.907 6.485-2.72 8.448-1.813 1.963-4.448 2.944-7.904 2.944z" fill="#FFF"/>
                <path d="M218.738 562.4h1.98v5.13h2.124v-5.13h1.98V575h-1.98v-5.67h-2.124V575h-1.98v-12.6zm9.378 7.236l-2.394-7.236h2.106l1.35 4.626h.036l1.35-4.626h1.926l-2.394 7.236V575h-1.98v-5.364zm5.274-7.236h2.916c.984 0 1.722.264 2.214.792s.738 1.302.738 2.322v1.242c0 1.02-.246 1.794-.738 2.322s-1.23.792-2.214.792h-.936V575h-1.98v-12.6zm2.916 5.67c.324 0 .567-.09.729-.27.162-.18.243-.486.243-.918v-1.494c0-.432-.081-.738-.243-.918-.162-.18-.405-.27-.729-.27h-.936v3.87h.936zm4.032-5.67h5.4v1.8h-3.42v3.33h2.718v1.8h-2.718v3.87h3.42v1.8h-5.4v-12.6zm6.534 0h2.934c1.02 0 1.764.237 2.232.711.468.474.702 1.203.702 2.187v.774c0 1.308-.432 2.136-1.296 2.484v.036c.48.144.819.438 1.017.882.198.444.297 1.038.297 1.782v2.214c0 .36.012.651.036.873.024.222.084.441.18.657h-2.016a2.886 2.886 0 0 1-.144-.576 8.665 8.665 0 0 1-.036-.972v-2.304c0-.576-.093-.978-.279-1.206-.186-.228-.507-.342-.963-.342h-.684v5.4h-1.98v-12.6zm2.7 5.4c.396 0 .693-.102.891-.306.198-.204.297-.546.297-1.026v-.972c0-.456-.081-.786-.243-.99-.162-.204-.417-.306-.765-.306h-.9v3.6h.72zm4.554-5.4h1.98V575h-1.98v-12.6zm6.318 12.78c-.972 0-1.716-.276-2.232-.828-.516-.552-.774-1.332-.774-2.34v-6.624c0-1.008.258-1.788.774-2.34.516-.552 1.26-.828 2.232-.828.972 0 1.716.276 2.232.828.516.552.774 1.332.774 2.34v6.624c0 1.008-.258 1.788-.774 2.34-.516.552-1.26.828-2.232.828zm0-1.8c.684 0 1.026-.414 1.026-1.242v-6.876c0-.828-.342-1.242-1.026-1.242-.684 0-1.026.414-1.026 1.242v6.876c0 .828.342 1.242 1.026 1.242zm4.338-10.98h2.484l1.926 7.542h.036V562.4h1.764V575h-2.034l-2.376-9.198h-.036V575h-1.764v-12.6z" fill="#9E9E9E"/>
              </g>
            </svg>
            `,
            { width: 239, height: 98 },
            { width: 239 * 5, height: 98 * 5 }
          ),
        ],
      }),
    ]);

    builder.addContent(images);

    builder.recalculate();

    window.addEventListener('resize', () => {
      builder.setWidth(window.innerWidth);
      builder.recalculate();
    });

    const world = builder.getWorld();

    // Create an initial viewport.
    const viewport = { width: window.innerWidth, height: window.innerHeight, x: 0, y: 0, scale: 1 };

    renderWorld(world, viewport);
  }
);
