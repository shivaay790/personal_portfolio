import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './fx/text-fx.css'
import { init as initTextFx } from './fx/text-fx'

createRoot(document.getElementById("root")!).render(<App />);
// Initialize text effects after mount
window.requestIdleCallback?.(() => initTextFx());
