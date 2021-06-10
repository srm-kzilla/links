import { useContext, useState } from "react";
import { parseCookies } from "nookies";
import { FiLink } from "react-icons/fi"
import { MdContentCopy } from "react-icons/md"

import { successHandler, errorHandler, patchUserProfile } from "../../utils/api";
import { EllipseGreen } from "../../assets/icons";
import { baseUrl } from "../../utils/constants";
import { ImageContext } from "../../store/profileImageContext";
import { FileUploader } from "../profile";
import { ChangePasswordModal } from "../profile";

export default function ProfileComponent({ _resProfile }): JSX.Element {
    const { fileBlob } = useContext(ImageContext);

    const [name, setName] = useState<string>(_resProfile.name);
    const [username, setUserName] = useState<string>(_resProfile.username);
    const [bio, setBio] = useState<string>(_resProfile.bio);
    // const [backgroundColor, setBackgroundColor] = useState<string>(_resProfile.background);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isSubmittingProfile, setIsSubmittingProfile] = useState<boolean>(false);

    const updateUserProfile = () => {
        (async () => {
            setIsSubmittingProfile(true);
            const { authToken } = parseCookies();
            const userData = {
                name: name,
                username: username,
                bio: bio,
                // background: backgroundColor
            }
            const _res = await patchUserProfile(authToken, userData);
            if (_res) {
                setIsSubmittingProfile(false);
                successHandler("🎉 Successfully Updated profile!");
            }
            setIsSubmittingProfile(false);
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
            <div className="absolute text-xl lg:text-6xl top-20 left-8 hidden lg:block gradientHeaderHollow">
                <h1>Edit Profile</h1>
            </div>
            <div className="relative flex items-center justify-center flex-col mt-4 md:float-left md:ml-60 md:mt-32 z-40">
                <div className="relative">
                    <img
                        className="w-36 rounded-full mt-20 border shadow-md"
                        src={fileBlob ? fileBlob : _resProfile.profilePicture}
                    />
                    <FileUploader />
                </div>
                <div className="flex flex-col">
                    <div className="mt-10">
                        <a className="text-left" href={`${baseUrl}${_resProfile.username}`} target="_blank" rel="noopener noreferrer"><i className="float-left mt-1 mr-2"><FiLink /></i><strong>{baseUrl}{_resProfile.username}</strong></a>
                        <button onClick={() => copyToClipBoard(`${baseUrl}${_resProfile.username}`)} className="float-right focus:outline-none" title="Copy to Clipboard">
                            <i className="float-right mt-1 ml-2 grid-cols-1 cursor-pointer"><MdContentCopy /></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center flex-col lg:absolute lg:top-40 lg:right-2 lg:pl-48 lg:w-4/5 mt-4">
                <p className="text-gray-600 font-extrabold">
                    NAME
                </p>
                <input
                    value={name}
                    type="textarea"
                    name="name"
                    autoComplete="off"
                    className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-2/3 sm:w-2/6 mb-8"
                    placeholder="John Doe"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                />
                <p className="text-gray-600 font-extrabold">
                    USERNAME
                </p>
                <input
                    value={username}
                    type="text"
                    name="username"
                    autoComplete="off"
                    className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-2/3 sm:w-2/6 mb-8"
                    placeholder="johndoe123"
                    onChange={(e) => {
                        setUserName(e.target.value);
                    }}
                />
                <p className="text-gray-600 font-extrabold">
                    BIO
                </p>
                <textarea
                    value={bio}
                    className="gradientTextareaBottom w-2/3 sm:w-2/6 focus:outline-none bg-backgroundwhite border"
                    rows={3}
                    placeholder="Here goes my cool bio..."
                    onChange={(e) => {
                        setBio(e.target.value);
                    }}
                />
                {/* <div className="mt-6 text-left w-2/3 sm:w-2/6">
                    <p className="text-darkgray font-extrabold text-left">THEME</p>
                    <div className="flex flex-row items-center mt-2">
                        <input onChange={() => setBackgroundColor("light")} className="w-4" type="radio" name="theme" value="light" checked={backgroundColor == "light" ? true : false} />
                        <label className="mr-8 ml-1" htmlFor="light">Light</label>
                        
                        <input onChange={() => setBackgroundColor("dark")} className="w-4" type="radio" name="theme" value="dark" checked={backgroundColor == "dark" ? true : false} />
                        <label className="mr-8 ml-1" htmlFor="dark">Dark</label>
                    </div>
                </div> */}
                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 md:w-1/4 text-md shadow-lg font-extrabold py-3 px-4 mt-8 rounded">
                    Change Password
                </button>
                <button
                    type="submit"
                    disabled={isSubmittingProfile}
                    onClick={() => updateUserProfile()}
                    className={`${isSubmittingProfile ? "bg-backgroundwhiteinset" : "bg-statusGreen"} focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 md:w-1/4 text-md shadow-lg font-extrabold py-3 px-4 my-3 rounded`}>
                    {isSubmittingProfile ? "Please wait..." : "Save!"}
                </button>
            </div>
            <ChangePasswordModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
            />
            <div className="hidden md:block absolute -bottom-20 -left-24 z-0">
                <EllipseGreen />
            </div>
        </>
    );
}
