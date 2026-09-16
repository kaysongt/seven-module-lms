# Globe interaction and brand assets

Dragging the globe interrupts the tour temporarily. Releasing preserves recent gesture velocity, which decays before the automatic tour resumes. Long-held gestures do not fling the globe. The Pause control and reduced-motion preference suppress automatic release motion. Cancelled/lost pointer capture cannot leave the globe stuck dragging, and vertical touch gestures can still scroll the page.

The header and footer use public/brand/kingsword-complete.png, downloaded unchanged from the official Chicago website:
https://chicago.kingsword.org/wp-content/uploads/2023/03/cropped-Kingsword-Logo.png

This transparent 493 × 319 source includes the full lower sweep and the ministry tagline. The previous 493 × 222 files clipped the lower portion of the mark. Keep the replacement’s natural aspect ratio; do not constrain it to the old logo height.

The globe stage and public page share --kw-canvas so the canvas blends into the warm off-white background. The public header/cards use --kw-surface, and learning pages use --paper/--paper-light.

Motion tests cover deceleration, frame-rate independence, latitude bounds, and long frame gaps. Live browser gesture/layout verification was unavailable because the desktop browser automation sandbox could not initialize.
