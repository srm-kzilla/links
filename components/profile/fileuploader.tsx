import React, { useContext } from "react";
import { parseCookies } from "nookies";

import {
  patchProfilePicture,
  postProfilePicture,
  successHandler,
} from "../../utils/api";
import { ImageContext } from "../../store/profileImageContext";
import { EditPencil } from "../../assets/icons";

export default function FileUploader(): JSX.Element {
  const { setFileBlob } = useContext(ImageContext);
  const hiddenFileInput = React.useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const { authToken } = parseCookies();
    const file = event.target.files[0];
    if (file) {
      setFileBlob("loading.gif");
    }

    (async () => {
      const _res = await patchProfilePicture(authToken);
      if (_res) {
          const { fields, url } = await _res.data.postInfo;
          const formData = new FormData();
          const formArray: [string, string | File][] = Object.entries({
              ...fields,
              file,
        });
        formArray.forEach(([key, value]) => {
          formData.append(key, value);
        });
        setFileBlob(URL.createObjectURL(event.target.files[0]));
        await postProfilePicture(url, formData);
        successHandler("🎉 Profile picture updated successfully!");
      }
    })();
  };
  return (
    <>
      <i
        className="absolute bg-white rounded-full p-3 bottom-1 right-0 cursor-pointer shadow-lg"
        onClick={handleClick}
      >
        <EditPencil />
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
