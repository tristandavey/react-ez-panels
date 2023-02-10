import "./Core.css";
import "./Examples.css";

import { Panel, PanelGroup, Splitter } from "../src";

export default {
  title: "Examples",
};

export const NonCollapsibleHeadings = () => (
  <div className="panel-group-wrapper">
    <PanelGroup direction="horizontal" className="panel-group">
      <Panel className="panel" />
      <Splitter className="splitter" />
      <Panel>
        <PanelGroup direction="vertical">
          <Panel className="panel non-collapsible-heading-panel">
            <div className="panel__content">
              <h2 className="panel__title">Panel Title</h2>
              <div className="panel__inner">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  ultricies nisl vitae erat lacinia, et blandit augue imperdiet.
                  Praesent risus turpis, pulvinar ultricies lacus vitae,
                  facilisis semper eros. Pellentesque eleifend, urna eget luctus
                  accumsan, mi est pulvinar ex, ac tincidunt augue nisi ac
                  sapien. Ut luctus mauris a dolor porttitor consequat. Aliquam
                  in felis cursus, porta diam a, congue lorem. Vestibulum
                  bibendum aliquet augue at tincidunt. Morbi varius congue dolor
                  non ultricies. Nullam quis mi et magna pulvinar posuere a id
                  dolor. Curabitur neque magna, ullamcorper non turpis in,
                  fringilla mollis elit. Curabitur imperdiet nisl eu odio luctus
                  vulputate. In semper turpis magna. Etiam gravida accumsan
                  magna, sit amet condimentum diam egestas ut. Morbi nec lacus
                  quis ipsum dictum laoreet. Integer ut arcu ut mauris ornare
                  egestas. In sit amet massa dapibus, dictum ex id, porttitor
                  sapien.
                </p>
              </div>
            </div>
          </Panel>
          <Splitter className="splitter" />
          <Panel className="panel non-collapsible-heading-panel">
            <div className="panel__content">
              <h2 className="panel__title">Panel Title</h2>
              <div className="panel__inner">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                  ultricies nisl vitae erat lacinia, et blandit augue imperdiet.
                  Praesent risus turpis, pulvinar ultricies lacus vitae,
                  facilisis semper eros. Pellentesque eleifend, urna eget luctus
                  accumsan, mi est pulvinar ex, ac tincidunt augue nisi ac
                  sapien. Ut luctus mauris a dolor porttitor consequat. Aliquam
                  in felis cursus, porta diam a, congue lorem. Vestibulum
                  bibendum aliquet augue at tincidunt. Morbi varius congue dolor
                  non ultricies. Nullam quis mi et magna pulvinar posuere a id
                  dolor. Curabitur neque magna, ullamcorper non turpis in,
                  fringilla mollis elit. Curabitur imperdiet nisl eu odio luctus
                  vulputate. In semper turpis magna. Etiam gravida accumsan
                  magna, sit amet condimentum diam egestas ut. Morbi nec lacus
                  quis ipsum dictum laoreet. Integer ut arcu ut mauris ornare
                  egestas. In sit amet massa dapibus, dictum ex id, porttitor
                  sapien.
                </p>
              </div>
            </div>
          </Panel>
        </PanelGroup>
      </Panel>
    </PanelGroup>
  </div>
);

export const StyledBySize = () => (
  <div className="panel-group-wrapper style-by-size">
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
