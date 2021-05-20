import React, { useState } from "react";

export interface activeLinkProps {
  _id: string;
  title: string;
  url: string;
  image: string;
  status: boolean;
  views: number;
  clicks: number;
  analyticsCode: string;
  shortCode: string;
  createdAt: number;
}

export const SidebarContext = React.createContext({
  activeLink: {
    _id: "",
    title: "",
    url: "",
    image: "",
    status: false,
    views: 0,
    clicks: 0,
    analyticsCode: "",
    shortCode: "",
    createdAt: 0,
  },
  setActiveLink: ({}: activeLinkProps) => {},
});

const SidebarContextProvider: React.FC = (props): JSX.Element => {
  const [activeLink, setActiveLink] = useState<activeLinkProps>({
    _id: "",
    title: "",
    url: "",
    image: "",
    status: false,
    views: 0,
    clicks: 0,
    analyticsCode: "",
    shortCode: "",
    createdAt: 0,
  });

  return (
    <SidebarContext.Provider
      value={{
        activeLink,
        setActiveLink,
      }}
    >
      {props.children}
    </SidebarContext.Provider>
  );
};

export default SidebarContextProvider;
