import React, { useState } from "react";

export const ImageContext = React.createContext({
    fileBlob: undefined,
    setFileBlob: ({}) => {}
});

const ImageContextProvider: React.FC = (props): JSX.Element => {
    const [fileBlob, setFileBlob] = useState<string>();
    return (
        <ImageContext.Provider
            value={{fileBlob, setFileBlob }}
        >
            {props.children}
        </ImageContext.Provider>
    );
};

export default ImageContextProvider;