import { createRoot } from "react-dom/client";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWhatsapp, faTiktok, faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import App from "./App.tsx";
import "./index.css";

// Add FontAwesome icons to the library
library.add(faWhatsapp, faTiktok, faFacebook, faTwitter, faInstagram, faPhone);

createRoot(document.getElementById("root")!).render(<App />);
