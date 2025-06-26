import React from "react";
import { FaX } from "react-icons/fa6";

const Modal = ({ children, title = "", open, close }) => {
  return (
    <div
      className={`
              transition duration-500
              fixed inset-0 z-50 modal
              flex items-center justify-center
              ${open ? "opacity-100 visible" : "opacity-0 invisible"}
          `}
    >
      <div className="bg-white rounded  min-w-[200px] flex flex-col m-5 max-h-[650px] overflow-auto ">
        <div className="flex p-2">
          <span>{title}</span>
          <button type="button" onClick={() => close()} className="ml-auto">
            <FaX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
