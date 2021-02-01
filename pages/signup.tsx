import SignUpComponent from "../components/signup/index";
import Footer from "../shared/components/footer";
import Navbar from "../shared/components/navbar";
export default function Login() {
  return (
    <div>
      <Navbar />
      <div className="mt-24">
        <SignUpComponent />
      </div>
      <Footer />
    </div>
  );
}
