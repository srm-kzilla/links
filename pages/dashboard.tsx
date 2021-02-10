import DashboardComponent from "../components/dashboard/index";
import SidebarContextProvider from "../utils/sidebarContext";

export default function Dashboard() {
  return (
    <SidebarContextProvider>
      <DashboardComponent />
    </SidebarContextProvider>
  );
}
