import { UnsubscribeImage } from "../../assets/icons";
export default function UnsubscribeComponent(): JSX.Element {
  return (
    <>
      <div>
        <div className="absolute text-3xl lg:text-6xl top-20 left-4 gradientHeaderHollow">
          <h1>Sorry to see you go :(</h1>
        </div>
        <div className="relative flex items-center min-h-screen justify-center my-auto">
          <UnsubscribeImage />
        </div>
      </div>
    </>
  );
}
