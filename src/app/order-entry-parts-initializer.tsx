"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    initializeOrderEntryParts?: () => void;
  }
}

export function OrderEntryPartsInitializer() {
  useEffect(() => {
    const initialize = () => window.initializeOrderEntryParts?.();
    if (window.initializeOrderEntryParts) {
      initialize();
      return;
    }

    const script = document.createElement("script");
    script.src = "/order-entry-parts.js";
    script.async = true;
    script.addEventListener("load", initialize);
    document.body.appendChild(script);

    return () => {
      script.removeEventListener("load", initialize);
      script.remove();
    };
  }, []);

  return null;
}
