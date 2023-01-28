import { useDrag } from "@use-gesture/react";
import {
  createContext,
  CSSProperties,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  calculateInitialPanelSizes,
  calculatePanelSizes,
} from "./Panels.utils";

export type PanelGroupDirection = "horizontal" | "vertical";

interface PanelGroupContextSchema {
  direction: PanelGroupDirection;
  panels: InternalPanelData[];
  panelSizes: number[];
  splitters: string[];
  registerPanel: (id: string, data: InternalPanelData) => void;
  unregisterPanel: (id: string) => void;
  registerSplitter: (id: string) => void;
  adjustSplitterByStep: (id: string, step: number) => void;
  adjustSplitterByDelta: (id: string, delta: number) => void;
}

const PanelGroupContext = createContext<PanelGroupContextSchema>({
  direction: "horizontal",
  panels: [],
  panelSizes: [],
  splitters: [],
  registerPanel: () => undefined,
  unregisterPanel: () => undefined,
  registerSplitter: () => undefined,
  adjustSplitterByStep: () => undefined,
  adjustSplitterByDelta: () => undefined,
});

export interface InternalPanelData {
  id: string;
  minSize: number;
  maxSize: number;
  initialSize?: number;
}

export interface PanelGroupProps {
  direction: PanelGroupDirection;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export const PanelGroup = forwardRef<HTMLDivElement, PanelGroupProps>(
  function PanelGroup({ direction, children, style, ...props }, ref) {
    const groupRef = useRef<HTMLDivElement>(null);

    const [panels, setPanels] = useState<InternalPanelData[]>([]);
    const [panelSizes, setPanelSizes] = useState<number[]>([]);
    const [splitters, setSplitters] = useState<string[]>([]);

    const registerPanel = useCallback((id: string, data: InternalPanelData) => {
      setPanels((prevPanels) => {
        const panelIndex = prevPanels.findIndex((panel) => panel.id === id);

        if (panelIndex !== -1) {
          const newPanels = [...prevPanels];

          newPanels[panelIndex] = data;

          return newPanels;
        }

        return [...prevPanels, data];
      });
    }, []);

    const unregisterPanel = useCallback((id: string) => {
      setPanels((prevPanels) => {
        return prevPanels.filter((panel) => panel.id !== id);
      });
    }, []);

    const registerSplitter = useCallback((id: string) => {
      setSplitters((prevSplitters) => {
        return [...prevSplitters, id];
      });
    }, []);

    const adjustSplitterByStep = useCallback(
      (id: string, delta: number) => {
        const splitterIndex = splitters.findIndex(
          (splitter) => splitter === id
        );

        if (splitterIndex === -1) {
          return;
        }

        setPanelSizes((prevPanelSizes) => {
          return calculatePanelSizes(
            panels,
            prevPanelSizes,
            splitterIndex,
            delta
          );
        });
      },
      [splitters, setPanels]
    );

    const adjustSplitterByDelta = useCallback(
      (id: string, delta: number) => {
        const size =
          direction === "horizontal"
            ? groupRef.current?.clientWidth
            : groupRef.current?.clientHeight;

        const deltaAsPercent = (delta / size!) * 100;

        adjustSplitterByStep(id, deltaAsPercent);
      },
      [adjustSplitterByStep]
    );

    useLayoutEffect(() => {
      setPanelSizes(calculateInitialPanelSizes(panels));
    }, [panels]);

    return (
      <PanelGroupContext.Provider
        value={{
          direction,
          panels,
          panelSizes,
          splitters,
          registerPanel,
          unregisterPanel,
          registerSplitter,
          adjustSplitterByStep,
          adjustSplitterByDelta,
        }}
      >
        <div
          ref={groupRef}
          style={{
            ...style,
            display: "flex",
            flexDirection: direction === "horizontal" ? "row" : "column",
            alignItems: "stretch",
            height: direction === "vertical" ? "100%" : undefined,
          }}
          {...props}
        >
          {children}
        </div>
      </PanelGroupContext.Provider>
    );
  }
);

export interface PanelProps {
  id: string;
  initialSize?: number;
  minSize?: number;
  maxSize?: number;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { id, children, initialSize, minSize = 0, maxSize = 100, style, ...props },
  ref
) {
  const { registerPanel, unregisterPanel, panels, panelSizes, direction } =
    useContext(PanelGroupContext);

  useEffect(() => {
    registerPanel(id, { id, initialSize, minSize, maxSize });

    return () => {
      unregisterPanel(id);
    };
  }, [id, initialSize, minSize, maxSize, registerPanel, unregisterPanel]);

  const panelIndex = panels.findIndex((panel) => panel.id === id);

  if (panelIndex === -1) {
    return null;
  }

  const size = panelSizes[panelIndex];

  return (
    <div
      id={id}
      ref={ref}
      style={{
        ...style,
        flexBasis: 0,
        flexGrow: size,
        flexShrink: 1,
        overflowX: direction === "horizontal" ? "hidden" : undefined,
        overflowY: direction === "horizontal" ? undefined : "hidden",
      }}
      {...props}
    >
      {children}
    </div>
  );
});

export interface SplitterProps {
  id: string;
  className?: string;
  style?: CSSProperties;

  step?: number;
  disabled?: boolean;
}

export const Splitter = forwardRef<HTMLDivElement, SplitterProps>(
  function Splitter({ id, step = 10, style, disabled, ...props }, ref) {
    const splitterRef = useRef<HTMLDivElement>(null);
    const {
      direction,
      registerSplitter,
      adjustSplitterByDelta,
      adjustSplitterByStep,
      panels,
      panelSizes,
      splitters,
    } = useContext(PanelGroupContext);

    useEffect(() => {
      registerSplitter(id);
    }, [registerSplitter]);

    useLayoutEffect(() => {
      const handleKeyDown = ({ key }: KeyboardEvent) => {
        if (direction === "horizontal") {
          if (key === "ArrowLeft") {
            adjustSplitterByStep(id, -step);
          } else if (key === "ArrowRight") {
            adjustSplitterByStep(id, step);
          }
        }

        if (direction === "vertical") {
          if (key === "ArrowUp") {
            adjustSplitterByStep(id, -step);
          } else if (key === "ArrowDown") {
            adjustSplitterByStep(id, step);
          }
        }
      };

      if (splitterRef.current) {
        splitterRef.current.addEventListener("keydown", handleKeyDown);
      }

      return () => {
        if (splitterRef.current)
          splitterRef.current.removeEventListener("keydown", handleKeyDown);
      };
    }, [adjustSplitterByStep, direction, id]);

    useDrag(
      ({ delta: [x, y] }) => {
        adjustSplitterByDelta(id, direction === "horizontal" ? x : y);
      },
      {
        target: splitterRef,
        enabled: !disabled,
      }
    );

    const splitterIndex = splitters.findIndex((splitter) => splitter === id);

    const curValue =
      panelSizes.slice(0, splitterIndex).reduce((acc, size) => acc + size, 0) +
      (panelSizes[splitterIndex] || 0);

    const minValue = panels
      .slice(0, splitterIndex + 1)
      .reduce((acc, panel) => acc + (panel.minSize || 0), 0);

    const maxValue =
      100 -
      panels
        .slice(splitterIndex + 1)
        .reduce((acc, panel) => acc + (panel.minSize || 0), 0);

    return (
      <div
        ref={splitterRef}
        role="separator"
        aria-orientation={
          direction === "horizontal" ? "vertical" : "horizontal"
        }
        aria-valuenow={curValue}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        aria-disabled={disabled || undefined}
        tabIndex={disabled ? undefined : 0}
        style={{
          ...style,
          touchAction: "none",
          cursor:
            (!disabled &&
              (direction === "horizontal" ? "ew-resize" : "ns-resize")) ||
            undefined,
        }}
        {...props}
      />
    );
  }
);
