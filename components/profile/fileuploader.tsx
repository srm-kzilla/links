import React, { useContext } from 'react';
import { HiOutlinePencil } from 'react-icons/hi';
import { parseCookies } from 'nookies';

import { patchProfilePicture, postProfilePicture } from '../../utils/api';
import { ImageContext } from '../../utils/profileImageContext';

export default function FileUploader() :JSX.Element {
    const { setFileBlob } = useContext(ImageContext);
    const hiddenFileInput = React.useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const { authToken } = parseCookies();
        const file = event.target.files[0];
        setFileBlob(URL.createObjectURL(event.target.files[0]));

        (async () => {
            const _res = await patchProfilePicture(authToken);
            if (_res) {
                const { fields, url } = await _res.data;
                const formData = new FormData();
                const formArray: [string, string | File][] = Object.entries({...fields, file});
                formArray.forEach(([key, value]) => {
                    formData.append(key, value);
                });
                await postProfilePicture(url, formData); 
            }
        })();
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