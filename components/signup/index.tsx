export default function SignUpComponent(): JSX.Element {
  return (
    <div className="container mx-auto h-full flex justify-center items-center">
      <div className="md:w-2/4 lg:w-1/4">
        <div className="customGradient hidden absolute md:block float-left z-0 styledHeader text-xxl mb-1 text-center">
          LINKS
        </div>
        <div className="relative z-50 p-8 border-t-12 bg-white mb-6 rounded-lg shadow-2xl">
          <h1 className="text-center text-4xl mb-5 font-extrabold text-lightblue">
            SIGN UP
          </h1>
          <div className="mb-4">
            <input
              type="email"
              className="gradientInput block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
              placeholder="Your Email ID"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="gradientInput block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
              placeholder="Your Username"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="gradientInput block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
              placeholder="Your Password"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="gradientInput block appearance-none w-full bg-lightgray px-2 py-2 rounded shadow"
              placeholder="Confirm Password"
            />
          </div>
          <div className="flex items-center justify-center">
            <button className="bg-lightblue hover:bg-opacity-90 text-darkgray w-2/3 text-md shadow-lg font-extrabold py-2 px-4 my-2 rounded">
              Sign Me Up!
            </button>
          </div>
          <div className="text-center mt-4">
            <p className="text-darkgray hover:text-black text-sm">
              Already have an account?{" "}
              <a href="/login" className="no-underline text-blue font-bold">
                Login!
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
