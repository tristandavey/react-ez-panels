import { Bounds, useDrag } from "@use-gesture/react";
import {
  createContext,
  CSSProperties,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  calculateInitialPanelSizes,
  calculatePanelSizes,
  XY,
} from "./Panels.utils";

export type PanelGroupDirection = "horizontal" | "vertical";

interface PanelGroupContextSchema {
  direction: PanelGroupDirection;
  panels: InternalPanelData[];
  panelSizes: number[];
  splitters: InternalSplitterData[];
  registerPanel: (id: string, data: InternalPanelData) => void;
  unregisterPanel: (id: string) => void;
  registerSplitter: (id: string, ref: HTMLDivElement) => void;
  moveSplitter: (id: string, pointer: XY, delta: XY, dragging: boolean) => void;
}

const PanelGroupContext = createContext<PanelGroupContextSchema>({
  direction: "horizontal",
  panels: [],
  panelSizes: [],
  splitters: [],
  registerPanel: () => undefined,
  unregisterPanel: () => undefined,
  registerSplitter: () => undefined,
  moveSplitter: () => undefined,
});

export interface InternalPanelData {
  id: string;
  ref: HTMLDivElement;
  minSize: number;
  minSizeSnap: boolean;
  maxSize: number;
  initialSize?: number;
}

export interface InternalSplitterData {
  id: string;
  ref: HTMLDivElement;
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
    const [splitters, setSplitters] = useState<InternalSplitterData[]>([]);
    const [panelSizes, setPanelSizes] = useState<number[]>([]);

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

    const registerSplitter = useCallback((id: string, ref: HTMLDivElement) => {
      setSplitters((prevSplitters) => {
        return [
          ...prevSplitters,
          {
            id,
            ref,
          },
        ];
      });
    }, []);

    const moveSplitter = useCallback(
      (id: string, pointer: XY, delta: XY, dragging: boolean) => {
        setPanelSizes((prevPanelSizes) => {
          return calculatePanelSizes({
            panels,
            panelSizes: prevPanelSizes,
            splitters,
            splitterId: id,
            pointer,
            delta,
            direction,
            groupRef: groupRef.current!,
            dragging,
          });
        });
      },
      [splitters]
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
          moveSplitter,
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
  id?: string;
  initialSize?: number;
  minSize?: number;
  minSizeSnap?: boolean;
  maxSize?: number;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  {
    id,
    children,
    initialSize,
    minSize = 0,
    minSizeSnap = false,
    maxSize = 100,
    style,
    ...props
  },
  ref
) {
  const internalId = useInternalId(id);
  const internalRef = useRef<HTMLDivElement>(null);

  const { registerPanel, unregisterPanel, panels, panelSizes, direction } =
    useContext(PanelGroupContext);

  useLayoutEffect(() => {
    registerPanel(internalId, {
      id: internalId,
      ref: internalRef.current!,
      initialSize,
      minSize,
      minSizeSnap,
      maxSize,
    });

    return () => {
      unregisterPanel(internalId);
    };
  }, [
    internalId,
    initialSize,
    minSize,
    maxSize,
    registerPanel,
    unregisterPanel,
  ]);

  const panelIndex = panels.findIndex((panel) => panel.id === internalId);
  const size = panelSizes[panelIndex] > -1 ? panelSizes[panelIndex] : 0;

  return (
    <div
      {...props}
      id={internalId}
      ref={internalRef}
      style={{
        ...style,
        flexBasis: 0,
        flexGrow: size,
        flexShrink: 1,
        overflowX: direction === "horizontal" ? "hidden" : undefined,
        overflowY: direction === "horizontal" ? undefined : "hidden",
      }}
      data-size={size}
    >
      {children}
    </div>
  );
});

export interface SplitterProps {
  id?: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  disabled?: boolean;
}

export const Splitter = forwardRef<HTMLDivElement, SplitterProps>(
  function Splitter({ id, style, disabled, ...props }, ref) {
    const internalId = useInternalId(id);
    const splitterRef = useRef<HTMLDivElement>(null);
    const {
      direction,
      registerSplitter,
      moveSplitter,
      panels,
      panelSizes,
      splitters,
    } = useContext(PanelGroupContext);

    useLayoutEffect(() => {
      registerSplitter(internalId, splitterRef.current!);
    }, [registerSplitter]);

    useDrag(
      ({ xy: [x, y], delta: [deltaX, deltaY], pressed }) => {
        return moveSplitter(internalId, [x, y], [deltaX, deltaY], pressed);
      },
      {
        target: splitterRef,
        enabled: !disabled,
      }
    );

    const splitterIndex = splitters.findIndex(
      (splitter) => splitter.id === internalId
    );

    const curValue =
      panelSizes.slice(0, splitterIndex).reduce((acc, size) => acc + size, 0) +
      (panelSizes[splitterIndex] || 0);

    const minValue = panels
      .slice(0, splitterIndex + 1)
      .reduce((acc, panel) => acc + (panel.minSize || 0), 0);

    const startPanelSize = panelSizes[splitterIndex] || 0;
    const endPanelSize = panelSizes[splitterIndex + 1] || 0;

    const maxValue =
      100 -
      panels
        .slice(splitterIndex + 1)
        .reduce((acc, panel) => acc + (panel.minSize || 0), 0);

    const orientation = direction === "horizontal" ? "vertical" : "horizontal";
    const cursor = direction === "horizontal" ? "ew-resize" : "ns-resize";

    return (
      <div
        id={internalId}
        ref={splitterRef}
        role="separator"
        aria-orientation={orientation}
        aria-valuenow={curValue}
        aria-valuemin={minValue}
        aria-valuemax={maxValue}
        aria-disabled={disabled || undefined}
        data-start-panel-size={startPanelSize}
        data-end-panel-size={endPanelSize}
        tabIndex={disabled ? undefined : 0}
        style={{
          ...style,
          touchAction: "none",
          cursor: disabled ? undefined : cursor,
        }}
        {...props}
      />
    );
  }
);

function useInternalId(id?: string) {
  const internalId = useId();
  return id || internalId;
}
