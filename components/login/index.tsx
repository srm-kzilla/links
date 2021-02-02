export default function LoginComponent(): JSX.Element {
  return (
    <div className="mx-auto h-screen flex justify-center items-center">
      <div className="m-auto md:w-2/4 lg:w-1/4">
        <div className="customGradient hidden absolute md:block float-left z-0 styledHeader text-xxl mb-1 text-center">
          LINKS
        </div>
        <div className="relative p-8 border-t-12 bg-white mb-6 rounded-lg shadow-2xl">
          <h1 className="text-center text-4xl mb-5 font-extrabold text-lightblue">
            LOGIN
          </h1>
          <input
            type="email"
            className="gradientInput mb-4 focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
            placeholder="Your Email ID"
          />
          <input
            type="password"
            className="gradientInput mb-4 focus:outline-none block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
            placeholder="Your Password"
          />
          <div className="flex items-center justify-center">
            <button className="bg-lightblue focus:outline-none hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-2 px-4 my-2 rounded">
              Let's Go!
            </button>
          </div>
          <div className="text-center text-darkgray hover:text-black font-normal mt-3 pb-6 ">
            <a href="#">Forgot Password?</a>
          </div>
          <div className="w-full mx-auto py-4 text-black h-auto bg-blue flex justify-center items-center">
            <hr className="w-1/5 sm:w-1/4 lg:w-96" />
            <p className="mx-3 md:mx-6 text-sm text-darkgray">OR</p>
            <hr className="w-1/5 sm:w-1/4 lg:w-96" />
          </div>

          <div className="text-center">
            <p className="text-darkgray hover:text-black text-sm">
              Don't have an account?{" "}
              <a href="/signup" className="no-underline text-blue font-bold">
                Sign Up!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
