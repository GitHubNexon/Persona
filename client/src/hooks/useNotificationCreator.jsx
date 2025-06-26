import { useState } from "react";
import notificationApi from "../api/notificationApi";

// Dummy toast for demo purposes
const showToast = (msg, type) => console.log(`${type.toUpperCase()}: ${msg}`);

const useNotificationCreator = () => {
  const [isLoading, setIsLoading] = useState(false);

  // createNotification accepts partial data or full data object
  const createNotification = async (data) => {
    setIsLoading(true);
    try {
      // Fill default dummy data, merged with provided data
      const notificationData = {
        type: "info",
        title: "Default Notification Title",
        data: { message: "This is a sample notification message." },
        isRead: false,
        hasAccess: true,
        status: {
          isDeleted: false,
          isArchived: false,
        },
        ...data,
      };

      const response = await notificationApi.createNotification(
        notificationData
      );

      // For testing: just console.log
      console.log("Notification created:", notificationData);

      showToast("Notification created successfully", "success");

      setIsLoading(false);
      //   return notificationData; // or response from API
      return response;
    } catch (error) {
      showToast("Failed to create notification", "error");
      setIsLoading(false);
      throw error;
    }
  };

  return { createNotification, isLoading };
};

export default useNotificationCreator;
