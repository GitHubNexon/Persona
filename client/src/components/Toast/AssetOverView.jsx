import React, { useState } from "react";
import Toastify from "../Components/Toast/Toastify";

const AssetOverView = () => {
  const [toastVisible, setToastVisible] = useState(false);

  return (
    <div className="p-6">
      <h2 className="mb-4 text-2xl font-bold">Asset Overview</h2>
      <button
        onClick={() => setToastVisible(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Show Toast
      </button>

      <Toastify
        isVisible={toastVisible}
        title="Success!"
        description="Your asset has been updated successfully."
        type="warning"
        position="top-right"
        closeButton={true}
        onClickClose={true}
        delay={5000}
        // loaders={true}
        buttons={[
          {
            label: "Undo",
            onClick: () => setToastVisible(false),
          },
          // {
          //   label: "Details",
          //   onClick: () => alert("Details clicked!"),
          // },
        ]}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default AssetOverView;
