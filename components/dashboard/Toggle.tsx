import React from "react";
import Switch from "react-input-switch";

interface ToggleProps {
  status: boolean;
}

const Toggle = ({ status }: ToggleProps): JSX.Element => {
  return (
    <Switch
      on={true}
      off={false}
      value={status}
      styles={{
        track: {
          backgroundColor: "#F2F2F2",
          width: "80px",
          height: "25px",
          borderRadius: "20px",
          border: "1px solid black",
        },
        trackChecked: {
          backgroundColor: "#56CCF2",
          width: "80px",
          height: "25px",
          border: "1px solid black",
        },
        button: {
          backgroundColor: "#C4C4C4",
          width: "24px",
          height: "24px",
          borderRadius: "20px",
          marginLeft: "-2px",
          marginTop: "-1px",
          border: "1px solid black",
        },
        buttonChecked: {
          backgroundColor: "#6FCF97",
          width: "24px",
          height: "24px",
          borderRadius: "20px",
          marginLeft: "45px",
          marginTop: "-1px",
          border: "1px solid black",
        },
      }}
    />
  );
};

export default Toggle;
