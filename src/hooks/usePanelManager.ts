import { useState, useCallback, useEffect } from "react";

export type Panel =
  | "notifications"
  | "chat"
  | "publish"
  | "saved"
  | "pricing"
  | "settings"
  | "discover"
  | "history"
  | "map"
  | "events"
  | null;

export const usePanelManager = () => {
  const [activePanel, setActivePanel] = useState<Panel>(null);

  const openPanel = useCallback((panel: Panel) => setActivePanel(panel), []);
  const closePanel = useCallback(() => setActivePanel(null), []);
  const togglePanel = useCallback(
    (panel: Panel) =>
      setActivePanel((prev) => (prev === panel ? null : panel)),
    []
  );

  // Close on Escape key (accessibility fix from audit)
  useEffect(() => {
    if (!activePanel) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activePanel, closePanel]);

  return { activePanel, openPanel, closePanel, togglePanel };
};
