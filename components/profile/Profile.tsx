import { useContext, useState } from "react";
import { parseCookies } from "nookies";

import { successHandler, errorHandler, patchUserProfile } from "../../utils/api";
import { baseUrl } from "../../utils/constants";
import { ImageContext } from "../../store/profileImageContext";
import { FileUploader } from "../profile";
import { ChangePasswordModal } from "../profile";
import { LinksLogoBg, CopyClipboard, EditPencil, EllipseGray } from "../../assets/icons";
import { truncateProfileBio, truncateProfileName } from "../../utils/functions";

export default function ProfileComponent({ _resProfile }): JSX.Element {
    const { fileBlob } = useContext(ImageContext);

    const [name, setName] = useState<string>(_resProfile.name);
    const [username, setUserName] = useState<string>(_resProfile.username);
    const [bio, setBio] = useState<string>(_resProfile.bio);
    // const [backgroundColor, setBackgroundColor] = useState<string>(_resProfile.background);
    const [isModalOpen, setModalOpen] = useState<boolean>(false);
    const [isSubmittingProfile, setIsSubmittingProfile] = useState<boolean>(false);
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [showUserNameInput, setShowUserNameInput] = useState<boolean>(false);
    const [showBioInput, setShowBioInput] = useState<boolean>(false);

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
            <div className="absolute text-xl lg:text-6xl top-28 left-32 hidden lg:block font-black tracking-wide text-lightgray opacity-30">
                <h1>EDIT PROFILE</h1>
            </div>
            <div className="absolute block md:hidden left-1/2">
                <h1 className="relative -left-1/2 text-xl top-16 font-black tracking-wide text-lightgray opacity-30">EDIT PROFILE</h1>
            </div>
            <div className="relative flex items-center justify-center flex-col mt-4 md:float-left md:ml-60 md:mt-24 z-40">
                <div className="relative">
                    <img
                        className="w-36 rounded-full mt-36 border"
                        src={fileBlob ? fileBlob : _resProfile.profilePicture}
                    />
                    <FileUploader />
                </div>
                <div className="flex flex-col">
                    <div className="flex flex-row items-center justify-center m-2">
                        {!showNameInput && (
                            <p className="text-center font-bold text-lg text-lightgray">{truncateProfileName(name)}</p>
                        )}
                        {showNameInput && (
                            <input
                                value={name}
                                type="text"
                                maxLength={50}
                                name="name"
                                autoComplete="off"
                                onBlur={() => setShowNameInput(false)}
                                onKeyPress={(e) => { e.key == "Enter" && setShowNameInput(false) }}
                                className="border-b-2 border-lightgraycustom text-lightgray p-1 focus:outline-none w-full mb-8"
                                placeholder="John Doe"
                                onChange={(e) => {
                                    setName(e.target.value);
                                }}
                            />
                        )}
                        {!showNameInput && (
                            <button onClick={() => setShowNameInput(true)} className="pl-3 focus:outline-none">
                                <i><EditPencil /></i>
                            </button>
                        )}
                    </div>
                    <div>
                        <a className="text-left text-lightgraycustom font-normal" href={`${baseUrl}${_resProfile.username}`} target="_blank" rel="noopener noreferrer"><strong>{baseUrl}{_resProfile.username}</strong></a>
                        <button onClick={() => copyToClipBoard(`${baseUrl}${_resProfile.username}`)} className="float-right focus:outline-none" title="Copy to Clipboard">
                            <i className="float-right mt-1 ml-2 grid-cols-1 cursor-pointer"><CopyClipboard /></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center flex-col md:absolute md:top-56 md:right-2 md:pl-48 md:w-4/5 mt-4">
                {/* <div className="flex flex-col md:absolute md:w-4/5 md:right-2 md:top-40 md:pl-80"> */}
                <div className="w-2/3 sm:w-2/6">
                    <p className="flex text-lightgray text-lg font-bold">
                        Username
                    </p>
                </div>
                {!showUserNameInput && (
                    <div className="flex flex-row w-2/3 sm:w-2/6">
                        <p className="flex text-lightgraycustom text-lg font-semibold">
                            {username}
                        </p>
                        <button onClick={() => setShowUserNameInput(true)} className="pl-3 focus:outline-none">
                            <i><EditPencil /></i>
                        </button>
                    </div>
                )}
                {showUserNameInput && (
                    <input
                        value={username}
                        type="text"
                        name="username"
                        autoComplete="off"
                        maxLength={30}
                        onBlur={() => setShowUserNameInput(false)}
                        onKeyPress={(e) => { e.key == "Enter" && setShowUserNameInput(false) }}
                        className="border-b-2 border-lightgraycustom p-1 focus:outline-none w-2/3 sm:w-2/6 text-lightgraycustom mb-8"
                        placeholder="johndoe123"
                        onChange={(e) => {
                            setUserName(e.target.value);
                        }}
                    />
                )}
                <div className="mt-10 w-2/3 sm:w-2/6">
                    <p className="text-lightgray text-lg font-bold">
                        About Me
                    </p>
                </div>
                {!showBioInput && (
                    <div className="flex flex-row w-2/3 sm:w-2/6">
                        <p className="flex text-lightgraycustom text-lg font-semibold">
                            {truncateProfileBio(bio)}
                        </p>
                        <button onClick={() => setShowBioInput(true)} className="pl-3 focus:outline-none">
                            <i><EditPencil /></i>
                        </button>
                    </div>
                )}
                {showBioInput && (
                    <textarea
                        value={bio}
                        className="grayBottomBorder w-2/3 sm:w-2/6 focus:outline-none text-lightgraycustom border"
                        rows={2}
                        maxLength={120}
                        onBlur={() => setShowBioInput(false)}
                        onKeyPress={(e) => { e.key == "Enter" && setShowBioInput(false) }}
                        placeholder="Here goes my cool bio..."
                        onChange={(e) => {
                            setBio(e.target.value);
                        }}
                    />
                )}
                {/* <div className="mt-6 text-left w-2/3 sm:w-2/6">
                    <p className="text-darkgray font-extrabold text-left">THEME</p>
                    <div className="flex flex-row items-center mt-2">
                        <input onChange={() => setBackgroundColor("light")} className="w-4" type="radio" name="theme" value="light" checked={backgroundColor == "light" ? true : false} />
                        <label className="mr-8 ml-1" htmlFor="light">Light</label>
                        
                        <input onChange={() => setBackgroundColor("dark")} className="w-4" type="radio" name="theme" value="dark" checked={backgroundColor == "dark" ? true : false} />
                        <label className="mr-8 ml-1" htmlFor="dark">Dark</label>
                    </div>
                </div> */}
                <div className="flex flex-row items-center justify-center w-2/3 sm:w-2/6 mt-16">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-white border-2 border-statusRed focus:outline-none hover:bg-opacity-80 text-statusRed text-xs font-bold w-full py-2 px-3 rounded">
                        CHANGE PASSWORD
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmittingProfile}
                        onClick={() => updateUserProfile()}
                        className={`bg-white border-2 ${isSubmittingProfile ? "border-lightgray text-lightgray" : "border-customGreen text-customGreen"} focus:outline-none hover:bg-opacity-80 text-xs font-bold w-full ml-4 py-2 px-3 rounded`}>
                        {isSubmittingProfile ? "Please wait..." : "UPDATE PROFILE"}
                    </button>
                </div>
            </div>

            <ChangePasswordModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
            />
            <div className="hidden lg:block absolute top-0 right-0 z-0">
                <EllipseGray />
            </div>
            <div className="hidden lg:block absolute -bottom-16 z-0">
                <LinksLogoBg />
            </div>
        </>
    );
}
