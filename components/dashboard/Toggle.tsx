import React, { useContext } from "react";
import { parseCookies } from "nookies";
import Switch from "react-input-switch";

import { updateLink } from "../../utils/api";
import { SidebarContext } from "../../store/sidebarContext";

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
          backgroundColor: "#E1E1E1",
          width: "60px",
          height: "25px",
          borderRadius: "3px",
        },
        trackChecked: {
          backgroundColor: "#E1E1E1",
          width: "60px",
          height: "25px",
          borderRadius: "3px",
        },
        button: {
          backgroundColor: "#A7A6A6",
          width: "22px",
          height: "25px",
          borderRadius: "3px",
          marginLeft: "-2px",
          marginTop: "-2px",
        },
        buttonChecked: {
          backgroundColor: "#40BEAF",
          width: "30px",
          height: "30px",
          borderRadius: "3px",
          marginLeft: "25px",
          marginTop: "-4px",
        },
      }}
    />
  );
};

export default Toggle;
