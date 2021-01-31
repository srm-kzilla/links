import Footer from "../shared/components/footer";
import Navbar from "../shared/components/navbar";
export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="mt-8">
          You have logged in! This is the Dashboard!
      </div>
      <Footer />
    </div>
  );
}
