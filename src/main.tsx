import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import {GoogleOAuthProvider} from "@react-oauth/google";
import { CLIENT } from '../Google-config.tsx';

const clientIDKey = CLIENT;

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={clientIDKey}>
    <App />
  </GoogleOAuthProvider>
);
