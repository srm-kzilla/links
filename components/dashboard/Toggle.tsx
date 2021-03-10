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
