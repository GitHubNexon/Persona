import React, { useState } from "react";
import Clock from "../components/Clock";
import Toastify from "../components/Toast/Toastify";
import TestComponent from "./../components/resize/TestComponent";

const Dashboard = () => {
  const [toastVisible, setToastVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {};

  return (
    <>
      <div className="p-2 dark:bg-gray-500 rounded-b-2xl">
        <TestComponent />
        <div className="p-6">
          <h2 className="mb-4 text-2xl font-bold">Asset Overview</h2>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Show Toast
          </button>

          <Toastify
            isVisible={isOpen}
            title="Success!"
            description="Your asset has been updated successfully."
            type="error"
            position="top-center"
            // closeButton={true}
            onClickClose={true}
            delay={5000}
            // loaders={true}
            buttons={
              [
                // {
                //   label: "Undo",
                //   onClick: () => setToastVisible(false),
                // },
                // {
                //   label: "Details",
                //   onClick: () => alert("Details clicked!"),
                // },
              ]
            }
            onClose={() => setToastVisible(false)}
          />
        </div>
      </div>
    </>
  );
};

export default Dashboard;
