import { FiLink } from "react-icons/fi"
import { MdContentCopy } from "react-icons/md"

import { successHandler, errorHandler } from "../../utils/api";
import { EllipseGreen } from "../../assets/icons";
import FileUploader from "./fileuploader";



export default function ProfileComponent(): JSX.Element {

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
                        src="data:image/jpeg;base64,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"
                    />
                    <FileUploader />
                </div>
                <div className="flex flex-col">
                    <div className="mt-10">
                        <a className="text-left" href="/"><i className="float-left mt-1 mr-2"><FiLink /></i><strong>links.me/aye_that_guitar_guy</strong></a>
                        <button onClick={() => copyToClipBoard(`http://localhost:3000/mulligulli81`)} className="float-right focus:outline-none" title="Copy to Clipboard">
                            <i className="float-right mt-1 ml-2 grid-cols-1 cursor-pointer"><MdContentCopy /></i>
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center flex-col lg:absolute lg:top-40 lg:right-2 lg:pl-48 lg:w-4/5 mt-4">
                <input
                    type="textarea"
                    name="name"
                    autoComplete="off"
                    className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-2/3 sm:w-2/6 mt-4 mb-8"
                    placeholder="Name"
                />
                <input
                    type="text"
                    name="username"
                    autoComplete="off"
                    className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-2/3 sm:w-2/6 mb-8"
                    placeholder="Username"
                />
                <textarea
                    className="gradientTextareaBottom w-2/3 sm:w-2/6 focus:outline-none bg-backgroundwhite border"
                    rows={5}
                    placeholder="Bio"
                />
                <input
                    type="password"
                    name="password"
                    autoComplete="off"
                    className="gradientInputBottom p-1 focus:outline-none bg-backgroundwhite w-2/3 sm:w-2/6 mt-4 mb-8"
                    placeholder="Password"
                />
                <button
                    type="submit"
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

// https://bestbody.com.au/wp-content/uploads/2019/11/placeholder-person.png