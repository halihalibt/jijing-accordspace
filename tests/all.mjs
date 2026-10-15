// Import in one process: this container's nested node --test launch omits the
// registered subtests. Direct execution emits every actual assertion group.
import './engine.test.mjs';
import './wallet.test.mjs';
import './dom.test.mjs';
