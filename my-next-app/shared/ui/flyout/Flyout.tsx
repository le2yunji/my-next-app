"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { MoreVertical } from "lucide-react";

type FlyOutContextValue = {
  open: boolean;
  close: () => void;
  toggle: () => void;
};

const FlyOutContext = createContext<FlyOutContextValue | null>(null);

function useFlyOutContext() {
  const context = useContext(FlyOutContext);

  if (!context) {
    throw new Error("FlyOut components must be used within <FlyOut>.");
  }

  return context;
}

type FlyOutProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

function FlyOutRoot({
  children,
  defaultOpen = false,
  className = "",
}: FlyOutProps) {
  const [open, setOpen] = useState(defaultOpen);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const close = () => setOpen(false);
  const toggle = () => setOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) close();
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <FlyOutContext.Provider value={{ open, close, toggle }}>
      <div ref={rootRef} className={`relative inline-block ${className}`}>
        {children}
      </div>
    </FlyOutContext.Provider>
  );
}

type FlyOutToggleProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

function FlyOutToggle({
  children,
  type = "button",
  className = "",
  onClick,
  ...props
}: FlyOutToggleProps) {
  const { open, toggle } = useFlyOutContext();

  return (
    <button
      type={type}
      aria-haspopup="menu"
      aria-expanded={open}
      className={`
        inline-flex h-9 w-9 items-center justify-center
        rounded-full
        text-gray-600
        transition-colors
        hover:bg-gray-100 hover:text-gray-900
        focus:outline-none focus:ring-2 focus:ring-gray-300
        ${className}
      `}
      onClick={(event) => {
        onClick?.(event);
        toggle();
      }}
      {...props}
    >
      {children ?? <MoreVertical size={20} />}
    </button>
  );
}

type FlyOutListProps = HTMLAttributes<HTMLDivElement>;

function FlyOutList({ children, className = "", ...props }: FlyOutListProps) {
  const { open } = useFlyOutContext();

  if (!open) return null;

  return (
    <div
      role="menu"
      className={`
        absolute right-0 z-50 mt-2 w-40
        overflow-hidden rounded-md border border-gray-200
        bg-white p-1 shadow-lg
        animate-in fade-in-0 zoom-in-95
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

type FlyOutItemProps = ButtonHTMLAttributes<HTMLButtonElement>;

function FlyOutItem({
  children,
  type = "button",
  className = "",
  onClick,
  ...props
}: FlyOutItemProps) {
  const { close } = useFlyOutContext();

  return (
    <button
      type={type}
      role="menuitem"
      className={`
        flex w-full items-center rounded-sm px-3 py-2
        text-left text-sm text-gray-700
        transition-colors
        hover:bg-gray-100 hover:text-gray-900
        focus:bg-gray-100 focus:outline-none
        disabled:pointer-events-none disabled:opacity-50
        ${className}
      `}
      onClick={(event) => {
        onClick?.(event);
        close();
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export const FlyOut = Object.assign(FlyOutRoot, {
  Toggle: FlyOutToggle,
  List: FlyOutList,
  Item: FlyOutItem,
});
