# Workspace V2 — readability and bilingual UI

The previous narrow scroll was rejected by the user. Its original embedded scene
CSS loaded after the product stylesheet, restoring a 540px width and the old
scaled animation. At desktop sizes, four option cards were squeezed into the
remaining space and wrapped almost character by character.

V2 extracts the original scene stylesheet without changing the original visual
source and loads it before product styles. The workspace uses a fixed near-full
viewport layout, up to 1600px wide, with a stationary header and a separately
scrolling body. It has no transform scaling, text blur or translucent workspace
background. At widths up to 1200px, plans use two columns; mobile uses one main
column with two plan cards per row. The original landscape, shaders and audio
source are preserved.

Body text is 17px, supporting copy 15px and ordinary controls 16px, with at least
48px control height. Dark text sits on opaque pale jade surfaces. Metadata and
status codes have a separate smaller type hierarchy.

The UI starts in English on first visit. EN / 中文 controls are present both in
the scene and workspace; the explicit choice is remembered locally. Tutorial,
wallet copy, errors, tooltips and accessibility labels are translated. Decorative
Chinese poetry and glyphs remain part of the original artwork. Language changes
do not reset state, change form values, arm the wallet or send a request. Live
participant text, domain meanings, raw receipts, hashes and protocol identifiers
remain unchanged. English meanings are offered only for the initial editable
live-domain example, before any user session is created.

Validation: all 15 assertion groups pass, including the complete negotiation
lifecycle with mid-session language switching, exact restoration of Chinese copy,
English live UI, input preservation, protected raw text and fixed-layout style
cascade checks. Build and canonical-source/scene integrity checks pass.

This is synthetic DOM and stylesheet validation, not a real browser render or
audio/WebGL check. The supported managed preview browser is unavailable in this
run. Fresh desktop/mobile visual acceptance remains open. No blockchain request,
wallet signature, deployment or Portal submission was made.
