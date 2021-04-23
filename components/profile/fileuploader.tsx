import React from 'react';
import { HiOutlinePencil } from 'react-icons/hi';

const FileUploader = props => {
    const hiddenFileInput = React.useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        props.handleFile(fileUploaded);
    };
    return (
        <>
            <i
                className="absolute bg-white rounded-full p-2 bottom-1 right-2 cursor-pointer"
                onClick={handleClick}
            >
                <HiOutlinePencil />
            </i>
            <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                className="hidden"
                accept="image/*"
            />
        </>
    );
}
export default FileUploader;