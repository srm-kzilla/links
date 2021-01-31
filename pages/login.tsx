import LoginComponent from "../components/login/index";
import Footer from "../shared/components/footer";
import Navbar from "../shared/components/navbar";
export default function Login() {
  return (
    <div>
      <Navbar />
      <div className="mt-24">
        <LoginComponent />
      </div>
      <Footer />
    </div>
  );
}
