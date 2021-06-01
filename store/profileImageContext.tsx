import React, { useState } from "react";

export const ImageContext = React.createContext({
    fileBlob: String,
    setFileBlob: (_fileBlob:String) => {}
});

const ImageContextProvider: React.FC = (props): JSX.Element => {
    const [fileBlob, setFileBlob] = useState<String>();
    return (
        <ImageContext.Provider
            value={{fileBlob, setFileBlob }}
        >
            {props.children}    
        </ImageContext.Provider>
    );
};

export default ImageContextProvider;    