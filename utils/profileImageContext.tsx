import React, { useState } from "react";

export const ImageContext = React.createContext({
    fileName: "",
    setFileName: ({}) => {}
});

const ImageContextProvider: React.FC = (props): JSX.Element => {
    const [fileName, setFileName] = useState<string>();
    return (
        <ImageContext.Provider
            value={{fileName, setFileName }}
        >
            {props.children}
        </ImageContext.Provider>
    );
};

export default ImageContextProvider;