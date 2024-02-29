import React from "react";
import Navbar from "../Navbar/Navbar";
import "./dashboard.scss";
import BoardPage from "../Pages/Board/BoardPage";
import AnalyticsPage from "../Pages/Analytics/AnalyticsPage";
import SettingsPage from "../Pages/Settings/SettingsPage";
import { useGlobal } from "../Context/Context";
const Dashboard = () => {
  const { activeNavPage } = useGlobal();

  const renderSelectedNavPage = () => {
    switch (activeNavPage) {
      case "BoardPage":
        return <BoardPage />;
      case "AnalyticsPage":
        return <AnalyticsPage />;
      case "SettingsPage":
        return <SettingsPage />;
      default:
        return null;
    }
  };

  return (
    <>
      <section className="dashboard-container">
        <div className="navbar-container">
          <Navbar />
        </div>
        <div className="management-container">{renderSelectedNavPage()}</div>
      </section>
    </>
  );
};

export default Dashboard;
