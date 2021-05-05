import { useContext, useState } from "react";
import { parseCookies } from "nookies";
import { FiLink } from "react-icons/fi"
import { MdContentCopy } from "react-icons/md"

import { successHandler, errorHandler, patchUserProfile } from "../../utils/api";
import { EllipseGreen } from "../../assets/icons";
import { baseUrl } from "../../utils/constants";
import { ImageContext } from "../../utils/profileImageContext";
import FileUploader from "./fileuploader";
import Modal from "./modal"

export default function ProfileComponent({ _resProfile }): JSX.Element {
    const { fileBlob } = useContext(ImageContext);

    const [name, setName] = useState<string>(_resProfile.name);
    const [username, setUserName] = useState<string>(_resProfile.username);
    const [bio, setBio] = useState<string>(_resProfile.bio);
    const [background, setBackground] = useState<string>(_resProfile.background);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);

    const updateUserProfile = () => {
        (async () => {
            const { authToken } = parseCookies();
            const userData = {
                name: name,
                username: username,
                bio: bio,
                background: background
            }
            const _res = await patchUserProfile(authToken, userData);
            if (_res) {
                successHandler("🎉 Successfully Updated profile!");
            }
        })();
    };

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
                        src={fileBlob ? fileBlob : _resProfile.profilePicture}
                    />
                    <FileUploader />
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
                    rows={4}
                    placeholder="Bio"
                    onChange={(e) => {
                        setBio(e.target.value);
                    }}
                />
                <div className="mt-6 text-left w-2/3 sm:w-2/6">
                    <p className="text-darkgray font-extrabold text-left">THEME</p>
                    <div className="flex flex-row items-center mt-2">
                        <input onChange={() => setBackground("light")} className="w-4" type="radio" name="theme" value="light" checked={background == "light" ? true : false} />
                        <label className="mr-8 ml-1" htmlFor="light">Light</label>
                        
                        <input onChange={() => setBackground("dark")} className="w-4" type="radio" name="theme" value="dark" checked={background == "dark" ? true : false} />
                        <label className="mr-8 ml-1" htmlFor="dark">Dark</label>
                    </div>
                </div>
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 md:w-1/4 text-md shadow-lg font-extrabold py-3 px-4 mt-8 rounded">
                    Change Password
                </button>
                <button
                    type="submit"
                    onClick={() => updateUserProfile()}
                    className="bg-statusGreen focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 md:w-1/4 text-md shadow-lg font-extrabold py-3 px-4 my-3 rounded">
                    Save!
                </button>
            </div>
            <Modal 
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
            />
            <div className="hidden md:block absolute bottom-0 -left-24 z-0">
                <EllipseGreen />
            </div>
        </>
    );
}
