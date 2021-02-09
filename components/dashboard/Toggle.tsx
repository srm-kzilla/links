import React, { useState } from "react";
import Switch from "react-input-switch";

export default function Toggle(): JSX.Element {
  const [value, setValue] = useState(true);
  const toggleValue = () => {
    setValue(!value);
    console.log(value);
  };
  return (
    <>
      <Switch
        on={true}
        off={false}
        value={value}
        onChange={toggleValue}
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
    </>
  );
}
