import {setupI18n} from './i18n.js';
import {setupFlight} from './flight.js';
const root=document.getElementById('ice-jade-sanctuary');
// Scene controls work independently of SDK or wallet initialization.
setupI18n(document);
setupFlight(root);
root.dataset.uiReady='true';
