# Scene V3 — sword flight, jade echoes and resilient controls

The supplied screenshot showed unstyled language buttons, Chinese scene copy and
unresponsive language controls. It is consistent with a new HTML document loading
cached prior CSS/JS; the exact user-browser cache state was not observable.

All application CSS and JS now have content-derived filenames. The initial HTML
contains English UI before scripts run, with a source-copy seed for Chinese.
The new language preference key starts in English even if the previous version
stored Chinese. The explicit choice made in this version is remembered.
Language and scene controls initialize in a small separate browser bundle, before
and independently of the wallet SDK. The language seal now sits inside the scene
header next to the audio control, with the same jade material and curved edges.

The approved reference HTML and original 1400×876 environment remain immutable.
Build-time scene enhancements increase framebuffer density (up to DPR 2 and a
6.5-million-pixel cap), request high shader precision, add mild local contrast
and reduce persistent inner-realm magnification from 1.78× to 1.115×. This avoids
magnifying the small source so heavily; it does not invent new source detail.
Scene rendering targets up to 60 Hz instead of the former 25 Hz cap.

The cursor is followed by a small vector jade sword with a fading trail. Enter
(or long hold) launches a foreground sword through the gate, with perspective
streaks and an expanding ring. The washout flash is reduced; typography remains
sharp. Three local jade echoes can be discovered, sounded, collected and reset.
They do not modify the negotiated domain or call the blockchain. Touch retains
button/hold entry; reduced motion shortens flight and removes trails.

The actual fingerprinted browser bundles are evaluated in a browser-like DOM,
without Node Buffer/process globals. Checks cover English static HTML, both
language directions before SDK load, full negotiation, raw-text preservation,
no wallet requests on language changes, cursor tracking, flight completion,
echo collection/reset and independent panel open/close. These are DOM/runtime
checks; canvas is stubbed, so they are not real WebGL/audio or device visuals.
The supported managed browser preview remains unavailable in this run.

No wallet signatures, blockchain writes, canonical contract edits or Portal
submission were performed. Full canonical contract SHA256 remains:
f99a6395f539c718027f2b6ab39801ccc22c2c0197fb7cbc27307b64563e886f
