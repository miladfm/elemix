import './doc-page-tab.css';
import React, { useEffect, useRef, useState } from 'react';
import { APIReferenceIcon, ExampleIcon, OverviewIcon } from './svg';


interface TabToolbarArgs {
  onTabChange?: (activeTabIndex: number) => void;
}

export const DocPageTab = ({ onTabChange }: TabToolbarArgs) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef([]);
  const wrapperRef = useRef(null);

  const tabs = [
    { title: 'Overview', iconComponent: OverviewIcon },
    { title: 'API Reference', iconComponent: APIReferenceIcon },
    { title: 'Example', iconComponent: ExampleIcon },
  ];

  const calculateIndicatorStyle = (index: number) => {
    const selectedTab = tabsRef.current[index];
    const tabRect = selectedTab.getBoundingClientRect();
    const wrapperRect = wrapperRef.current.getBoundingClientRect();

    let width = tabRect.width;
    let left = tabRect.left - wrapperRect.left;
    let borderRadius = '8px';

    if (index === 0) {
      width += 6; // wrapper padding left (12) - indicator margin left (6)
      left -= 8;
      borderRadius = '32px 16px 16px 32px';
    } else if (index === tabs.length - 1) {
      width += 6; // wrapper padding left (12)
      borderRadius = '16px 32px 32px 16px';
    }

    return { width, left, borderRadius, opacity: 1 };
  };

  const switchTabToIndex = (index: number) => {
    setActiveTabIndex(index);
    setIndicatorStyle(calculateIndicatorStyle(index));
    onTabChange?.(index);
  };

  useEffect(() => {
    setIndicatorStyle(calculateIndicatorStyle(activeTabIndex));
  }, [activeTabIndex]);

  return (
    <div className="tab-toolbar__wrapper" ref={wrapperRef}>
      {tabs.map((tab, index) => (
        <div
          key={index}
          className={`tab-toolbar__tab ${index === activeTabIndex ? 'tab-toolbar__tab--selected' : ''}`}
          onClick={() => switchTabToIndex(index)}
          ref={(el) => (tabsRef.current[index] = el)}>
          {React.createElement(tabs[index].iconComponent)}
          <span className="tap-toolbar__tab-text">{tab.title}</span>
        </div>
      ))}
      <div className="tap-toolbar__indicator" style={indicatorStyle}></div>
    </div>
  );
};
