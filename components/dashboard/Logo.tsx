interface LogoProps {
  status: boolean;
  image: string;
  alt: string;
}

export default function Logo({ status, image, alt }: LogoProps): JSX.Element {
  return (
    <>
      <div
        className={`${
          status ? "bg-statusGreen" : "bg-statusRed"
        } hover:w-16 z-0 hover-trigger relative cursor-pointer ease-in-out duration-100 w-5 pt-16 pb-12 mr-5 shadow-2xl rounded-l-xl`}
      >
        <img
          className="absolute z-0 hover-target w-10 ml-2 justify-between top-10 right-3"
          src={image}
          alt={alt}
        />
      </div>
    </>
  );
}
