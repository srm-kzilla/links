import { useContext, useEffect, useRef, useState } from "react";
import { parseCookies } from "nookies";
import { FiLink } from "react-icons/fi"
import { MdContentCopy } from "react-icons/md"

import { successHandler, errorHandler, patchUserProfile, getUserProfile, patchProfilePicture, postProfilePicture } from "../../utils/api";
import { EllipseGreen } from "../../assets/icons";
import FileUploader from "./fileuploader";
import { baseUrl } from "../../utils/constants";
import { ImageContext } from "../../utils/profileImageContext";

import { HiOutlinePencil } from 'react-icons/hi';

export default function ProfileComponent({_resProfile}): JSX.Element {  
    const [profilePicture, setProfilePicture] = useState<any>(_resProfile.profilePicture);
    const [fileBlob, setFileBlob] = useState<string>();

    const { fileName, setFileName } = useContext(ImageContext);
    const hiddenFileInput = useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };
    const handleChange = event => {
        const { authToken } = parseCookies();
        const file = event.target.files[0];
        setFileBlob(URL.createObjectURL(event.target.files[0]));
        console.log(fileBlob);
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
                // await setProfilePicture(file); 
                // await console.log(fileName, "is the filename");
                await setFileName(file);
                // await console.log(fileName, "is the filename which is changed");
            }
        })();
    };



    
    // const {fileName, setFileName} = useContext(ImageContext);
    
    const [name, setName] = useState<string>(_resProfile.name);
    const [username, setUserName] = useState<string>(_resProfile.username);
    const [bio, setBio] = useState<string>(_resProfile.bio);
    
    // useEffect(() => {
    //     console.log("something");
    //     (async () => {
    //         const { authToken } = parseCookies();
    //         const _res = await getUserProfile(authToken);
    //         await setProfilePicture(_res.data.profilePicture);
    //         console.log(_res);
    //     })();

    // }, [fileName]);

    const updateUserProfile = () => {
        (async () => {
            const { authToken } = parseCookies();
            const userData = {
                name: name,
                username: username,
                bio: bio
            }
            const _res = await patchUserProfile(authToken, userData);
            if(_res) {
                successHandler("🎉 Successfully Updated profile!");
            }
        })();
    }

    const copyToClipBoard = async copyMe => {
        try {
            await navigator.clipboard.writeText(copyMe);
            successHandler("📋 Link copied to clipboard!");
        } catch (err) {
            errorHandler(err);
        }
    };
    return (
        <>
            <div className="absolute text-xl lg:text-6xl top-20 left-4 hidden lg:block gradientHeaderHollow">
                <h1>Edit Profile</h1>
            </div>
            <div className="relative flex items-center justify-center flex-col mt-4 md:float-left md:ml-60 md:mt-32 z-40">
                <div className="relative">
                    <img
                        className="w-36 h-36 rounded-full mt-20 border shadow-md"
                        // src={fileBlob}
                        src={fileBlob ? fileBlob : _resProfile.profilePicture}
                        // src={_resProfile.profilePicture}
                        // src={profilePicture}
                    />
                    {/* <FileUploader /> */}
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
                </div>
                <div className="flex flex-col">
                    <div className="mt-10">
                        <a className="text-left" href={`${baseUrl}${_resProfile.username}`} target="_blank" rel="noopener noreferrer"><i className="float-left mt-1 mr-2"><FiLink /></i><strong>{baseUrl}{_resProfile.username}</strong></a>
                        <button onClick={() => copyToClipBoard(`http://localhost:3000/mulligulli81`)} className="float-right focus:outline-none" title="Copy to Clipboard">
                            <i className="float-right mt-1 ml-2 grid-cols-1 cursor-pointer"><MdContentCopy /></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center flex-col lg:absolute lg:top-40 lg:right-2 lg:pl-48 lg:w-4/5 mt-4">
                <input
                    value={name}
                    type="textarea"
                    name="name"
                    autoComplete="off"
                    className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-2/3 sm:w-2/6 mt-4 mb-8"
                    placeholder="Name"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <input
                    value={username}
                    type="text"
                    name="username"
                    autoComplete="off"
                    className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-2/3 sm:w-2/6 mb-8"
                    placeholder="Username"
                    onChange={(e) => {
                        setUserName(e.target.value);
                    }}
                />
                <textarea
                    value={bio}
                    className="gradientTextareaBottom w-2/3 sm:w-2/6 focus:outline-none bg-backgroundwhite border"
                    rows={5}
                    placeholder="Bio"
                    onChange={(e) => {
                        setBio(e.target.value);
                    }}
                />
                <button
                    type="submit"
                    onClick={() => updateUserProfile()}
                    className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-1/4 text-md shadow-lg font-extrabold py-3 px-4 my-10 rounded">
                    Save!
                </button>
            </div>
            <div className="hidden md:block absolute bottom-0 -left-24 z-0">
                <EllipseGreen />
            </div>
        </>
    );
}
