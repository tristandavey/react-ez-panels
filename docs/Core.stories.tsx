import "./Core.css";

import { Panel, PanelGroup, Splitter } from "../src";

export default {
  title: "Core",
};

export const Horizontal = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel id="panel-1" className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter id="splitter-1" className="splitter" />
      <Panel id="panel-2" className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const Vertical = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="vertical" className="panel-group">
      <Panel id="panel-1" className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter id="splitter-1" className="splitter" />
      <Panel id="panel-2" className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const Nested = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel id="panel-1" className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter id="splitter-1" className="splitter" />
      <Panel id="panel-2">
        <PanelGroup direction="vertical">
          <Panel id="panel-2-1" className="panel">
            <div className="panel__content">Panel</div>
          </Panel>
          <Splitter id="splitter-2-1" className="splitter" />
          <Panel id="panel-2-2" className="panel">
            <div className="panel__content">Panel</div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  </div>
);

export const Disabled = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel id="panel-1" className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter id="splitter-1" className="splitter" disabled />
      <Panel id="panel-2" className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const InitialSize = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel id="panel-1" className="panel">
        <div className="panel__content">Initial Remaining%</div>
      </Panel>
      <Splitter id="splitter-1" className="splitter" />
      <Panel id="panel-2" className="panel" initialSize={65}>
        <div className="panel__content">Initial 65%</div>
      </Panel>
      <Splitter id="splitter-2" className="splitter" />
      <Panel id="panel-3" className="panel" initialSize={25}>
        <div className="panel__content">Initial 25%</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const MinSize = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel id="panel-1" className="panel" minSize={50}>
        <div className="panel__content">Min 50%</div>
      </Panel>
      <Splitter id="splitter-1" className="splitter" />
      <Panel id="panel-2" className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const MaxSize = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel id="panel-1" className="panel" maxSize={25}>
        <div className="panel__content">Max 25%</div>
      </Panel>
      <Splitter id="splitter-1" className="splitter" />
      <Panel id="panel-2" className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const MinSizeSnap = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel id="panel-1" className="panel" minSize={0} minSizeSnap={20}>
        <div className="panel__content">Min Size 0%, Snap 20%</div>
      </Panel>
      <Splitter id="splitter-1" className="splitter" />
      <Panel id="panel-2" className="panel" minSize={20} minSizeSnap={10}>
        <div className="panel__content">Min Size 20%, Snap 10%</div>
      </Panel>
    </PanelGroup>
  </div>
);
