import React, { useState, useEffect } from "react";

export const SidebarContext = React.createContext({
  isOpen: true,
  title: "",
  url: "",
  views: 0,
  clicks: 0,
  setIsOpen: (_isOpen: boolean) => {},
  setTitle: (_title: string) => {},
  setUrl: (_url: string) => {},
  setViews: (_views: number) => {},
  setClicks: (_clicks: number) => {},
});

const SidebarContextProvider: React.FC = (props): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [title, setTitle] = useState<string>();
  const [url, setUrl] = useState<string>();
  const [views, setViews] = useState<number>();
  const [clicks, setClicks] = useState<number>();

  useEffect(() => {
    if (window.innerWidth <= 768) setIsOpen(false);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        title,
        setTitle,
        url,
        setUrl,
        clicks,
        setClicks,
        views,
        setViews,
      }}
    >
      {props.children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextProvider;
