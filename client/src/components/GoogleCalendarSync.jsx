import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useToast } from "@/hooks/use-toast";
import { axiosInstance } from "../lib/axios.js";

const GoogleCalendarSync = forwardRef(({ onTokenRefreshed }, ref) => {
  const { toast } = useToast();

  const handleTokenRefresh = async () => {
    try {
      const response = await axiosInstance.get('/auth/refresh-google-token');
      if (response.data.authUrl) {
        // Open the Google OAuth consent screen in a new window
        const width = 600;
        const height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        window.open(
          response.data.authUrl,
          'Google Calendar Authorization',
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // Listen for the token refresh completion
        window.addEventListener('message', async (event) => {
          if (event.data.type === 'GOOGLE_TOKEN_REFRESHED') {
            toast({
              title: "Success",
              description: "Google Calendar access has been restored.",
              variant: "default",
            });
            if (onTokenRefreshed) {
              onTokenRefreshed();
            }
          }
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to refresh Google Calendar access. Please try again.",
        variant: "destructive",
      });
    }
  };

  useImperativeHandle(ref, () => ({
    triggerSync: handleTokenRefresh
  }));

  return null; // This is a utility component that doesn't render anything
});

export default GoogleCalendarSync; 