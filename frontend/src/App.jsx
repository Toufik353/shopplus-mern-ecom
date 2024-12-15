import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import "./App.css";
import Footer from "./components/Footer/Footer.jsx";

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (e) => {
      setSearchTerm(e.target.value.toLowerCase());
  };

  return (
    <div className="app">
      <Header searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <div className="main-content">
              <Outlet context={{ searchTerm }} />
          </div>
          <Footer/>
    </div>
  );
}

export default App;
