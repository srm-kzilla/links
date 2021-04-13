import React, { useContext } from "react";
import { parseCookies } from "nookies";
import Switch from "react-input-switch";

import { updateLink } from "../../utils/api";
import { SidebarContext } from "../../utils/sidebarContext";

interface ToggleProps {
  status: boolean;
  linkId: string;
}

const Toggle = ({ status, linkId }: ToggleProps) => {
  const { activeLink, setActiveLink } = useContext(SidebarContext);

  const toggleStatus = () => {
    const { authToken } = parseCookies();
    const res = updateLink(authToken, linkId, { status: !status });
    if (res) {
      setActiveLink({ ...activeLink, status: !status });
    }
  };

  return (
    <Switch
      on={true}
      off={false}
      value={status}
      onChange={toggleStatus}
      styles={{
        track: {
          backgroundColor: "#F2F2F2",
          width: "80px",
          height: "26px",
          borderRadius: "20px",
          border: "1px solid black",
        },
        trackChecked: {
          backgroundColor: "#56CCF2",
          width: "80px",
          height: "26px",
          border: "1px solid black",
        },
        button: {
          backgroundColor: "#C4C4C4",
          width: "20px",
          height: "20px",
          borderRadius: "20px",
          marginLeft: "2px",
          marginTop: "1px",
          border: "1px solid black",
        },
        buttonChecked: {
          backgroundColor: "#6FCF97",
          width: "28px",
          height: "28px",
          borderRadius: "20px",
          marginLeft: "45px",
          marginTop: "-3px",
          border: "1px solid black",
        },
      }}
    />
  );
};

export default Toggle;
