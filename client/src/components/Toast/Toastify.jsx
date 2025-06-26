import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
  AiOutlineCloseCircle,
  AiOutlineClose,
} from "react-icons/ai";
import "./Toast.css";

const TYPE_ICONS = {
  success: <AiOutlineCheckCircle className="text-green-500 w-6 h-6" />,
  error: <AiOutlineCloseCircle className="text-red-500 w-6 h-6" />,
  info: <AiOutlineInfoCircle className="text-blue-500 w-6 h-6" />,
  warning: <AiOutlineWarning className="text-yellow-400 w-6 h-6" />,
};

const TYPE_COLORS = {
  success: "bg-green-50 border-green-400 text-green-800",
  error: "bg-red-50 border-red-400 text-red-800",
  info: "bg-blue-50 border-blue-400 text-blue-800",
  warning: "bg-yellow-50 border-yellow-400 text-yellow-800",
};

const POSITION_STYLES = {
  "top-left": "top-6 left-6",
  "top-center": "top-6 left-1/2",
  "top-right": "top-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-center": "bottom-6 left-1/2",
  "bottom-right": "bottom-6 right-6",
};

const ENTRY_ANIMATIONS = {
  "top-left": { transform: "translate(-100%, -100%)", opacity: 0 },
  "top-center": { transform: "translateY(-100%)", opacity: 0 },
  "top-right": { transform: "translate(100%, -100%)", opacity: 0 },
  "bottom-left": { transform: "translate(-100%, 100%)", opacity: 0 },
  "bottom-center": { transform: "translateY(100%)", opacity: 0 },
  "bottom-right": { transform: "translate(100%, 100%)", opacity: 0 },
};

const EXIT_ANIMATIONS = {
  "top-left": { transform: "translate(-100%, -100%)", opacity: 0 },
  "top-center": { transform: "translateY(-100%)", opacity: 0 },
  "top-right": { transform: "translate(100%, -100%)", opacity: 0 },
  "bottom-left": { transform: "translate(-100%, 100%)", opacity: 0 },
  "bottom-center": { transform: "translateY(100%)", opacity: 0 },
  "bottom-right": { transform: "translate(100%, 100%)", opacity: 0 },
};

const Loader = () => (
  <div className="loader" />
);

const Toastify = ({
  isVisible = false,
  title = "",
  description = "",
  type = "info",
  closeButton = false,
  onClickClose = true,
  position = "top-right",
  delay = 5000,
  loaders = false,
  buttons = [],
  animation = true,
  onClose,
}) => {
  const [show, setShow] = useState(isVisible);
  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);
  const timerRef = useRef();

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setExiting(false);
      setEntered(false);
      setTimeout(() => setEntered(true), 10);

      if (delay > 0) {
        clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
          handleClose();
        }, delay);
      }
    } else {
      handleClose();
    }

    return () => clearTimeout(timerRef.current);
  }, [isVisible, delay]);

  const handleClose = () => {
    if (animation) {
      setExiting(true);
      setEntered(false);
      setTimeout(() => {
        setShow(false);
        onClose && onClose();
      }, 300);
    } else {
      setShow(false);
      onClose && onClose();
    }
  };

  const handleClick = () => {
    if (onClickClose) {
      handleClose();
    }
  };

  if (!show) return null;

  let transformStyle = "translate(0, 0)";
  if (!entered && !exiting) {
    transformStyle = ENTRY_ANIMATIONS[position]?.transform || "translate(0, 0)";
  } else if (exiting) {
    transformStyle = EXIT_ANIMATIONS[position]?.transform || "translate(0, 0)";
  }

  const isCenter = position === "top-center" || position === "bottom-center";

  return (
    <div
      className={`toast ${TYPE_COLORS[type]} ${POSITION_STYLES[position]} ${exiting ? "toast-exit" : "toast-enter"}`}
      style={{
        transform: `${transformStyle}${isCenter ? " translateX(-50%)" : ""}`,
      }}
      onClick={handleClick}
      role="alert"
      aria-live="assertive"
    >
      <div className="toast-content">
        <div className="toast-icon">{TYPE_ICONS[type]}</div>
        <div className="toast-body">
          {title && <h3 className="toast-title">{title}</h3>}
          {description && <p className="toast-description">{description}</p>}
          {buttons.length > 0 && (
            <div className="toast-buttons">
              {buttons.map(({ label, onClick }, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick && onClick();
                  }}
                  className="toast-button"
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="toast-actions">
          {loaders && <div className="toast-loader"><Loader /></div>}
          {closeButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClose();
              }}
              className="toast-close"
              aria-label="Close"
            >
              <AiOutlineClose className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div
        className={`toast-progress ${type}`}
        style={{
          animationDuration: `${delay}ms`,
        }}
      ></div>
    </div>
  );
};

export default Toastify;