import { InternalPanelData, InternalSplitterData } from "./Panels";

export type XY = [x: number, y: number];

interface CalculateOptions {
  panels: InternalPanelData[];
  panelSizes: number[];
  splitters: InternalSplitterData[];
  splitterId: string;
  pointer: XY;
  delta: XY;
  direction: "horizontal" | "vertical";
  groupRef: HTMLDivElement;
  dragging: boolean;
}

export function calculatePanelSizes(options: CalculateOptions): number[] {
  const splitterIndex = options.splitters.findIndex(
    ({ id }) => id === options.splitterId
  );
  const splitter = options.splitters[splitterIndex];

  if (!splitter) {
    return options.panelSizes;
  }

  const snappedPanels = calculateSnappedPanels(options);

  if (snappedPanels) {
    return snappedPanels;
  }

  const delta = calculatePercentageDelta(
    options.delta,
    options.pointer,
    splitter.ref,
    options.groupRef,
    options.direction
  );

  return calculateSizesFromDeltaPercentage(
    options.panels,
    options.panelSizes,
    splitterIndex,
    delta
  );
}

function calculateSnappedPanels(options: CalculateOptions): number[] | null {
  const nextPanelSizes = [...options.panelSizes];
  const [x, y] = options.pointer;
  const [deltaX, deltaY] = options.delta;

  const splitterIndex = options.splitters.findIndex(
    ({ id }) => id === options.splitterId
  );

  const startPanel = options.panels[splitterIndex];
  const startPanelSize = options.panelSizes[splitterIndex];
  const endPanel = options.panels[splitterIndex + 1];
  const endPanelSize = options.panelSizes[splitterIndex + 1];

  if (options.direction === "horizontal") {
    if (deltaX < 0) {
      const startSnapPoint =
        startPanel.ref.offsetLeft + startPanel.ref.offsetWidth / 2;
      const canSnapStart =
        startPanel.minSizeSnap && startPanelSize === startPanel.minSize;
      const hitStartSnap = x < startSnapPoint;

      if (canSnapStart && hitStartSnap) {
        nextPanelSizes[splitterIndex] = -1;
        nextPanelSizes[splitterIndex + 1] += startPanelSize;
        return nextPanelSizes;
      }

      if (startPanelSize === -1) {
        return nextPanelSizes;
      }

      const endSnapPoint =
        endPanel.ref.offsetLeft -
        ((options.groupRef.offsetWidth / 100) * endPanel.minSize) / 2;
      const shouldSnapEnd = endPanel.minSizeSnap && endPanelSize === -1;
      const hitEndSnap = x < endSnapPoint;

      if (shouldSnapEnd) {
        if (hitEndSnap) {
          nextPanelSizes[splitterIndex + 1] = endPanel.minSize;
          nextPanelSizes[splitterIndex] -= endPanel.minSize;
        }

        return nextPanelSizes;
      }
    }

    if (deltaX > 0) {
      const endSnapPoint =
        endPanel.ref.offsetLeft + endPanel.ref.offsetWidth / 2;
      const canSnapEnd =
        endPanel.minSizeSnap && endPanelSize === endPanel.minSize;
      const hitEndSnap = x > endSnapPoint;

      if (canSnapEnd && hitEndSnap) {
        nextPanelSizes[splitterIndex] += endPanelSize;
        nextPanelSizes[splitterIndex + 1] = -1;
        return nextPanelSizes;
      }

      if (endPanelSize === -1) {
        return nextPanelSizes;
      }

      const startSnapPoint =
        startPanel.ref.offsetLeft +
        ((options.groupRef.offsetWidth / 100) * startPanel.minSize) / 2;
      const shouldSnapStart = startPanel.minSizeSnap && startPanelSize === -1;
      const hitStartSnap = x > startSnapPoint;

      if (shouldSnapStart) {
        if (hitStartSnap) {
          nextPanelSizes[splitterIndex] = startPanel.minSize;
          nextPanelSizes[splitterIndex + 1] -= startPanel.minSize;
        }

        return nextPanelSizes;
      }
    }
  }

  if (options.direction === "vertical") {
    if (deltaY < 0) {
      const startSnapPoint =
        startPanel.ref.offsetTop + startPanel.ref.offsetHeight / 2;
      const canSnapStart =
        startPanel.minSizeSnap && startPanelSize === startPanel.minSize;
      const hitStartSnap = y < startSnapPoint;

      if (canSnapStart && hitStartSnap) {
        nextPanelSizes[splitterIndex] = -1;
        nextPanelSizes[splitterIndex + 1] += startPanelSize;
        return nextPanelSizes;
      }

      if (startPanelSize === -1) {
        return nextPanelSizes;
      }

      const endSnapPoint =
        endPanel.ref.offsetTop -
        ((options.groupRef.offsetHeight / 100) * endPanel.minSize) / 2;
      const shouldSnapEnd = endPanel.minSizeSnap && endPanelSize === -1;
      const hitEndSnap = y < endSnapPoint;

      if (shouldSnapEnd) {
        if (hitEndSnap) {
          nextPanelSizes[splitterIndex + 1] = endPanel.minSize;
          nextPanelSizes[splitterIndex] -= endPanel.minSize;
        }

        return nextPanelSizes;
      }
    }

    if (deltaY > 0) {
      const endSnapPoint =
        endPanel.ref.offsetTop + endPanel.ref.offsetHeight / 2;
      const canSnapEnd =
        endPanel.minSizeSnap && endPanelSize === endPanel.minSize;
      const hitEndSnap = y > endSnapPoint;

      if (canSnapEnd && hitEndSnap) {
        nextPanelSizes[splitterIndex] += endPanelSize;
        nextPanelSizes[splitterIndex + 1] = -1;
        return nextPanelSizes;
      }

      if (endPanelSize === -1) {
        return nextPanelSizes;
      }

      const startSnapPoint =
        startPanel.ref.offsetTop +
        ((options.groupRef.offsetHeight / 100) * startPanel.minSize) / 2;
      const shouldSnapStart = startPanel.minSizeSnap && startPanelSize === -1;

      const hitStartSnap = y > startSnapPoint;

      if (shouldSnapStart) {
        if (hitStartSnap) {
          nextPanelSizes[splitterIndex] = startPanel.minSize;
          nextPanelSizes[splitterIndex + 1] -= startPanel.minSize;
        }

        return nextPanelSizes;
      }
    }
  }

  if (deltaX === 0 && deltaY === 0) {
    return nextPanelSizes;
  }

  return null;
}

function calculatePercentageDelta(
  [deltaX, deltaY]: XY,
  [x, y]: XY,
  splitterRef: HTMLDivElement,
  groupRef: HTMLDivElement,
  direction: "horizontal" | "vertical"
) {
  if (direction === "horizontal") {
    const delta = x === 0 ? deltaX : Math.round(x - splitterRef.offsetLeft);
    return (delta / groupRef.offsetWidth) * 100;
  }

  const delta = y === 0 ? deltaY : Math.round(y - splitterRef.offsetTop);
  return (delta / groupRef.offsetHeight) * 100;
}

function calculateSizesFromDeltaPercentage(
  panels: InternalPanelData[],
  panelSizes: number[],
  splitterIndex: number,
  delta: number
): number[] {
  const nextPanelSizes = [...panelSizes];

  let startPanelIndex = splitterIndex;
  let endPanelIndex = splitterIndex + 1;
  let remainingDelta = Math.abs(delta);

  if (delta < 0) {
    while (remainingDelta > 0) {
      const startPanel = panels[startPanelIndex];
      const endPanel = panels[endPanelIndex];

      const startPanelSize = nextPanelSizes[startPanelIndex];
      const endPanelSize = nextPanelSizes[endPanelIndex];

      if (!startPanel || !endPanel) {
        break;
      }

      if (startPanelSize === -1) {
        startPanelIndex--;
        continue;
      }

      const startPanelMinSize = startPanel.minSize;
      const endPanelMinSize = endPanel.minSize;
      const endPanelMaxSize = endPanel.maxSize;

      const startPanelDelta = Math.min(
        remainingDelta,
        startPanelSize - startPanelMinSize
      );

      const endPanelDelta = Math.min(
        remainingDelta,
        endPanelMaxSize - endPanelSize
      );

      let actualDelta = Math.min(startPanelDelta, endPanelDelta);

      if (startPanelSize - startPanelDelta <= startPanelMinSize) {
        actualDelta = startPanelSize - startPanelMinSize;
      }

      if (endPanelSize + endPanelDelta <= endPanelMinSize) {
        actualDelta = endPanelMinSize - endPanelSize;
      }

      nextPanelSizes[startPanelIndex] -= actualDelta;
      nextPanelSizes[endPanelIndex] += actualDelta;

      remainingDelta -= actualDelta;

      if (nextPanelSizes[startPanelIndex] === startPanelMinSize) {
        startPanelIndex--;
      }

      if (nextPanelSizes[endPanelIndex] === endPanelMaxSize) {
        endPanelIndex++;
      }
    }
  }

  if (delta > 0) {
    while (remainingDelta > 0) {
      const startPanel = panels[startPanelIndex];
      const endPanel = panels[endPanelIndex];

      const startPanelSize = nextPanelSizes[startPanelIndex];
      const endPanelSize = nextPanelSizes[endPanelIndex];

      if (!startPanel || !endPanel) {
        break;
      }

      if (endPanelSize === -1) {
        endPanelIndex++;
        continue;
      }

      const startPanelMinSize = startPanel.minSize;
      const startPanelMaxSize = startPanel.maxSize;
      const endPanelMinSize = endPanel.minSize;

      const startPanelDelta = Math.min(
        remainingDelta,
        startPanelMaxSize - startPanelSize
      );

      const endPanelDelta = Math.min(
        remainingDelta,
        endPanelSize - endPanelMinSize
      );

      let actualDelta = Math.min(startPanelDelta, endPanelDelta);

      if (endPanelSize - endPanelDelta <= endPanelMinSize) {
        actualDelta = endPanelSize - endPanelMinSize;
      }

      if (startPanelSize + startPanelDelta <= startPanelMinSize) {
        actualDelta = startPanelMinSize - startPanelSize;
      }

      nextPanelSizes[startPanelIndex] += actualDelta;
      nextPanelSizes[endPanelIndex] -= actualDelta;

      remainingDelta -= actualDelta;

      if (nextPanelSizes[startPanelIndex] === startPanelMaxSize) {
        startPanelIndex--;
      }

      if (nextPanelSizes[endPanelIndex] === endPanelMinSize) {
        endPanelIndex++;
      }
    }
  }

  return nextPanelSizes;
}

export function calculateInitialPanelSizes(
  panels: InternalPanelData[]
): number[] {
  const panelSizes: Record<string, number> = {};

  let remainingSize = 100;
  let remainingPanels = panels.length;

  panels.forEach((panel) => {
    if (panel.initialSize !== undefined) {
      panelSizes[panel.id] = panel.initialSize;
      remainingSize -= panel.initialSize;
      remainingPanels--;
    }
  });

  if (remainingPanels === 0) {
    return panels.map((panel) => {
      return panelSizes[panel.id] || 0;
    });
  }

  const remainingPanelSplit = remainingSize / remainingPanels;

  panels.forEach((panel) => {
    if (panel.initialSize === undefined) {
      if (Object.keys(panelSizes).length === panels.length - 1) {
        panelSizes[panel.id] = remainingSize;
        return;
      }

      const panelSize = Math.min(
        Math.min(Math.max(remainingPanelSplit, panel.minSize), remainingSize),
        panel.maxSize
      );

      remainingSize -= panelSize;

      panelSizes[panel.id] = panelSize;
    }
  });

  return panels.map((panel) => {
    return panelSizes[panel.id] || 0;
  });
}
