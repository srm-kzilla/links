import { useState, useEffect, useContext } from "react";
import { parseCookies } from "nookies";
import { FiLink } from "react-icons/fi"
import { MdContentCopy } from "react-icons/md"

import { successHandler, errorHandler, patchUserProfile, getUserProfile } from "../../utils/api";
import { EllipseGreen } from "../../assets/icons";
import FileUploader from "./fileuploader";
import { baseUrl } from "../../utils/constants";

// TODO interface for _resProfile


export default function ProfileComponent({_resProfile}): JSX.Element {
    const [name, setName] = useState<string>(_resProfile.name);
    const [username, setUserName] = useState<string>(_resProfile.username);
    const [bio, setBio] = useState<string>(_resProfile.bio);
    const [profilePicture, setProfilePicture] = useState<string>(_resProfile.profilePicture);
    
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
                successHandler("🎇 Successfully Updated profile!");
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
                        src={profilePicture}
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
