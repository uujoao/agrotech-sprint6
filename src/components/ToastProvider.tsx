import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Toast = { icon: string; title: string; body: string };

type ToastContextValue = {
  showToast: (icon: string, title: string, body: string) => void;
  closeToast: () => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa estar dentro de <ToastProvider>");
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeToast = useCallback(() => setToast(null), []);

  const showToast = useCallback((icon: string, title: string, body: string) => {
    setToast({ icon, title, body });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}
      <div className={`toast${toast ? " show" : ""}`}>
        <div className="toast-icon">{toast?.icon}</div>
        <div>
          <div className="toast-title">{toast?.title}</div>
          <div className="toast-body">{toast?.body}</div>
        </div>
        <button className="toast-close" onClick={closeToast} aria-label="Fechar notificação">
          ✕
        </button>
      </div>
    </ToastContext.Provider>
  );
}
