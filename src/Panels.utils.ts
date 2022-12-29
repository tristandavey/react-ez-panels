import { InternalPanelData } from "./Panels";

export function calculatePanelSizes(
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

      const startPanelMinSize = startPanel.minSize;
      const startPanelSnapSize = startPanel.minSizeSnap;
      const endPanelMinSize = endPanel.minSizeSnap;
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

      const startSnapThreshold = startPanelMinSize + startPanelSnapSize;

      if (startPanelSize - startPanelDelta <= startSnapThreshold) {
        actualDelta = startPanelSize - startPanelMinSize;
      }

      const endSnapThreshold = endPanelMinSize + endPanel.minSizeSnap;

      if (endPanelSize - endPanelDelta <= endSnapThreshold) {
        actualDelta = endPanelMinSize + endSnapThreshold - endPanelSize;
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

      const startPanelMinSize = startPanel.minSize;
      const startPanelMaxSize = startPanel.maxSize;
      const endPanelMinSize = endPanel.minSize;

      const startPanelDelta = Math.min(
        remainingDelta,
        startPanelMaxSize - startPanelSize
      );

      let endPanelDelta = Math.min(
        remainingDelta,
        endPanelSize - endPanelMinSize
      );

      let actualDelta = Math.min(startPanelDelta, endPanelDelta);

      const endSnapThreshold = endPanelMinSize + endPanel.minSizeSnap;

      if (endPanelSize - endPanelDelta <= endSnapThreshold) {
        actualDelta = endPanelSize - endPanelMinSize;
      }

      const startSnapThreshold = startPanelMinSize + startPanel.minSizeSnap;

      if (startPanelSize + startPanelDelta <= startSnapThreshold) {
        actualDelta = startPanelMinSize + startSnapThreshold - startPanelSize;
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
