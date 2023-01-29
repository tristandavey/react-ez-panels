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
  adjustSplitterByDelta: (id: string, delta: number) => void;
  calculateSplitterBounds: (id: string) => Bounds | undefined;
}

const PanelGroupContext = createContext<PanelGroupContextSchema>({
  direction: "horizontal",
  panels: [],
  panelSizes: [],
  splitters: [],
  registerPanel: () => undefined,
  unregisterPanel: () => undefined,
  registerSplitter: () => undefined,
  adjustSplitterByDelta: () => undefined,
  calculateSplitterBounds: () => undefined,
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

    const adjustSplitterByDelta = useCallback(
      (id: string, delta: number) => {
        const size =
          direction === "horizontal"
            ? groupRef.current?.clientWidth
            : groupRef.current?.clientHeight;

        const deltaAsPercent = (delta / size!) * 100;

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
            deltaAsPercent
          );
        });
      },
      [splitters]
    );

    const calculateSplitterBounds = useCallback(
      (id: string) => {
        const splitterIndex = splitters.findIndex(
          (splitter) => splitter === id
        );

        if (splitterIndex === -1) {
          return;
        }

        if (direction === "horizontal") {
          const groupWidth = groupRef.current?.clientWidth || 0;

          const leftMinSize = panels
            .slice(0, splitterIndex + 1)
            .reduce(
              (acc, panel) => acc + (groupWidth / 100) * panel.minSize,
              0
            );

          const left =
            panelSizes
              .slice(0, splitterIndex + 1)
              .reduce((acc, size) => acc + (groupWidth / 100) * size, 0) * -1;

          const rightMinSize = panels
            .slice(splitterIndex + 1)
            .reduce(
              (acc, panel) => acc + (groupWidth / 100) * panel.minSize,
              0
            );

          const right = panelSizes
            .slice(splitterIndex + 1)
            .reduce((acc, size) => acc + (groupWidth / 100) * size, 0);

          return { left: left + leftMinSize, right: right - rightMinSize };
        }

        const groupHeight = groupRef.current?.clientHeight || 0;

        const topMinSize = panels
          .slice(0, splitterIndex + 1)
          .reduce((acc, panel) => acc + (groupHeight / 100) * panel.minSize, 0);

        const top =
          panelSizes
            .slice(0, splitterIndex + 1)
            .reduce((acc, size) => acc + (size / 100) * groupHeight, 0) * -1;

        const bottomMinSize = panels
          .slice(splitterIndex + 1)
          .reduce((acc, panel) => acc + (groupHeight / 100) * panel.minSize, 0);

        const bottom = panelSizes
          .slice(splitterIndex + 1)
          .reduce((acc, size) => acc + (size / 100) * groupHeight, 0);

        return { top: top + topMinSize, bottom: bottom - bottomMinSize };
      },
      [panels, panelSizes, splitters, direction]
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
          adjustSplitterByDelta,
          calculateSplitterBounds,
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
  maxSize?: number;
  children?: ReactNode;
  style?: CSSProperties;
  className?: string;
}

export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { id, children, initialSize, minSize = 0, maxSize = 100, style, ...props },
  ref
) {
  const internalId = useInternalId(id);

  const { registerPanel, unregisterPanel, panels, panelSizes, direction } =
    useContext(PanelGroupContext);

  useEffect(() => {
    registerPanel(internalId, {
      id: internalId,
      initialSize,
      minSize,
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

  if (panelIndex === -1) {
    return null;
  }

  const size = panelSizes[panelIndex];

  return (
    <div
      id={internalId}
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
  id?: string;
  className?: string;
  style?: CSSProperties;
  step?: number;
  disabled?: boolean;
}

export const Splitter = forwardRef<HTMLDivElement, SplitterProps>(
  function Splitter({ id, step = 10, style, disabled, ...props }, ref) {
    const internalId = useInternalId(id);
    const splitterRef = useRef<HTMLDivElement>(null);
    const {
      direction,
      registerSplitter,
      adjustSplitterByDelta,
      panels,
      panelSizes,
      splitters,
      calculateSplitterBounds,
    } = useContext(PanelGroupContext);

    useEffect(() => {
      registerSplitter(internalId);
    }, [registerSplitter]);

    useDrag(
      ({ delta: [deltaX, deltaY] }) => {
        if (direction === "horizontal" && deltaX !== 0) {
          adjustSplitterByDelta(internalId, deltaX);
        }

        if (direction === "vertical" && deltaY !== 0) {
          adjustSplitterByDelta(internalId, deltaY);
        }
      },
      {
        target: splitterRef,
        enabled: !disabled,
        bounds: calculateSplitterBounds(internalId),
      }
    );

    const splitterIndex = splitters.findIndex(
      (splitter) => splitter === internalId
    );

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
        id={internalId}
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

function useInternalId(id?: string) {
  const internalId = useId();
  return id || internalId;
}
