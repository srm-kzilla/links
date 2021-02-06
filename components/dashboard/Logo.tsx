export default function Logo(props) {
  const { status, image } = props;
  let statusColor: string;
  if (status) {
    statusColor = "bg-statusGreen";
  } else {
    statusColor = "bg-statusRed";
  }
  return (
    <>
      <div
        className={
          "hover:w-16 hover-trigger cursor-pointer ease-in-out duration-100 w-5 pt-16 pb-12 mr-5 shadow-2xl rounded-l-xl " +
          statusColor
        }
      >
        <img
          className="absolute hover-target w-10 ml-2 justify-between float-left"
          src={image}
        />
      </div>
    </>
  );
}
