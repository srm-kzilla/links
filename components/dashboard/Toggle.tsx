import { parseCookies } from "nookies";
import React, { useState } from "react";
import Switch from "react-input-switch";
import { updateLink } from "../../utils/api";

interface ToggleProps {
  status: boolean;
  linkId: string;
}

const Toggle = ({ status, linkId }: ToggleProps): JSX.Element => {
  const [value, setValue] = useState<boolean>(status);

  const toggleStatus = () => {
    console.log("Toggling");
    if (value == true) {
      setValue(false);
      Switch.value = value;
    }
    else {
      setValue(true);
      Switch.value = value;
    }
    const { authToken } = parseCookies();
    const values = {
      status: value,
    };
    const res = updateLink(authToken, linkId, values);
    if (res) {
      console.log("Done!")
    }
  };
  return (
    <Switch
      on={true}
      off={false}
      value={value}
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
