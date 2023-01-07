# react-ez-panels
A package to handle multi panel resizing. This implements the [ARIA Window Splitter](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) pattern so should be accessible. It's built with [useGesture](https://use-gesture.netlify.app/) but this may change in future.

## Features
1. Multiple split panels (horizontal + vertical)
2. Resizing via drag
3. Resizing via the keyboard
4. Nested panels
5. Min / max sizes
5. Min size snapping

## Roadmap
1. Delay for min snap (like vscode)
2. Bounds so you drag the splitter at the cursor
3. Tests
4. Not require manual ids

### Ideas
1. Drag to order panels
2. Drag to nest panels

## Example

```
import { PanelGroup, Panel, Splitter } from 'react-ez-panels';

function MyComponent() {
  return (
    <PanelGroup direction="horizontal">
      <Panel id="panel-1">
        ...
      </Panel>
      <Splitter id="splitter-1" />
      <Panel id="panel-2" >
        ...
      </Panel>
    </PanelGroup>
  );
}
```
