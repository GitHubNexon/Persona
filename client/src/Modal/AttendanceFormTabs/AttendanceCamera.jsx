import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import Webcam from "react-webcam";
import { FiCamera, FiRotateCw, FiVideo, FiX } from "react-icons/fi";

const AttendanceCamera = forwardRef(({ photoURL, setPhotoURL }, ref) => {
  const webcamRef = useRef(null);
  const [captured, setCaptured] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);

  const videoConstraints = {
    facingMode: "user",
  };

  const startCamera = () => {
    setCameraOn(true);
    setCaptured(false);
    setPhotoURL("");
  };

  const stopCamera = () => {
    setCameraOn(false);
  };

  const capturePhoto = () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setPhotoURL(imageSrc);
      setCaptured(true);
      stopCamera();
    }
  };

  const retakePhoto = () => {
    setCaptured(false);
    setPhotoURL("");
    setCameraOn(true);
  };

  useImperativeHandle(ref, () => ({
    stopCamera,
  }));

  return (
    <div className="w-full max-w-sm mx-auto p-4 border rounded-md bg-white shadow-md">
      {!cameraOn && !captured && (
        <div className="flex justify-center">
          <button
            onClick={startCamera}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FiVideo size={20} />
            Start Camera
          </button>
        </div>
      )}

      {cameraOn && !captured && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/png"
            videoConstraints={videoConstraints}
            className="w-full rounded-md bg-black aspect-video object-cover"
          />
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={capturePhoto}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FiCamera size={20} />
              Capture
            </button>
            <button
              onClick={stopCamera}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FiX size={20} />
              Stop Camera
            </button>
          </div>
        </>
      )}

      {captured && (
        <>
          <img
            src={photoURL}
            alt="Captured"
            className="w-full rounded-md object-cover aspect-video"
          />
          <div className="flex justify-center mt-4 gap-4">
            <button
              onClick={retakePhoto}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FiRotateCw size={20} />
              Retake
            </button>
          </div>
        </>
      )}
    </div>
  );
});

export default AttendanceCamera;
