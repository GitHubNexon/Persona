import React from "react";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = ({ onGoogleLogin }) => {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = "http://localhost:3000/mern/api/auth/google";
  };

  return (
    <div className="w-full">
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors duration-200"
        type="button"
      >
        <FcGoogle size={20} />
        <span className="text-sm font-medium">Continue with Google</span>
      </button>

      <div className="flex items-center my-4">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="px-3 text-gray-500 text-sm">or</div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>
    </div>
  );
};

export default GoogleLogin;
