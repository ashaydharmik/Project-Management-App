import React from "react";
import { Route, Routes } from "react-router-dom";
import Auth from "./components/Authentication/Auth";
import Dashboard from "./components/Dashboard/Dashboard";
import PrivateComponent from "./components/PrivateComponent/PrivateComponent";
import "./App.css";
import LivePage from "./components/LiveInterface/LivePage";

function App() {
  return (
    <>
      <Routes>
        <Route element={<PrivateComponent />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live-page/:id" element={<LivePage />} />
        </Route>

        <Route path="/" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
