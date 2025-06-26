import React from "react";
import Login from "../admin/Login";

const Home = () => {
  return (
    <div
      className={`relative min-h-screen flex items-center justify-center bg-[#03346E]`}
    >
      <div className="p-4 z-10">
        <Login />
      </div>
    </div>
  );
};

export default Home;
