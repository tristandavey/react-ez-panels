import "./Core.css";

import { Panel, PanelGroup, Splitter } from "../src";

export default {
  title: "Core",
};

export const Horizontal = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const HorizontalMultiple = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const Vertical = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="vertical" className="panel-group">
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const VerticalMultiple = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="vertical" className="panel-group">
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const Nested = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel>
        <PanelGroup direction="vertical">
          <Panel className="panel">
            <div className="panel__content">Panel</div>
          </Panel>
          <Splitter className="splitter" />
          <Panel className="panel">
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
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
      <Splitter className="splitter" disabled />
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const InitialSize = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel className="panel">
        <div className="panel__content">Initial Remaining%</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel" initialSize={65}>
        <div className="panel__content">Initial 65%</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel" initialSize={25}>
        <div className="panel__content">Initial 25%</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const MinSize = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel className="panel" minSize={50}>
        <div className="panel__content">Min 50%</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel" minSize={10}>
        <div className="panel__content">Min 10%</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel" minSize={10}>
        <div className="panel__content">Min 10%</div>
      </Panel>
    </PanelGroup>
  </div>
);

export const MaxSize = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel className="panel" maxSize={25}>
        <div className="panel__content">Max 25%</div>
      </Panel>
      <Splitter className="splitter" />
      <Panel className="panel">
        <div className="panel__content">Panel</div>
      </Panel>
    </PanelGroup>
  </div>
);
