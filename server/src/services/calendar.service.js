// env file jovi

import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import User from '../model/user.model.js';
import { GOOGLE_CONFIG } from '../config/auth.config.js';

// const router = Router();

const oauth2Client = new google.auth.OAuth2(
     GOOGLE_CONFIG.clientID,
     GOOGLE_CONFIG.clientSecret,
     GOOGLE_CONFIG.callbackURL
);

// const scopes = [
//      'https://www.googleapis.com/auth/calendar'
// ]

// router.get('/google',(req,res)=>{
//      const url = oauth2Client.generateAuthUrl({
//           access_type:"offline",
//           scope:scopes
//      });

//      res.redirect(url);
// })

// router.get('/google/callb')

// Helper function to format date to IST ISO 8601 string with offset
function formatToISTISO(date) {
     const year = date.getFullYear();
     const month = (date.getMonth() + 1).toString().padStart(2, '0');
     const day = date.getDate().toString().padStart(2, '0');
     const hours = date.getHours().toString().padStart(2, '0');
     const minutes = date.getMinutes().toString().padStart(2, '0');
     const seconds = date.getSeconds().toString().padStart(2, '0');
     
     // Manually construct the ISO string with IST offset (+05:30)
     return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+05:30`;
}

// Create calendar event
export const createCalendarEvent = async (userId, link) => {
     try {
          const user = await User.findById(userId);
          if (!user?.googleAccessToken) {
               // console.log('No Google access token found for user:', userId);
               return null;
          }

          // Check if token is expired
          if (user.tokenExpiryDate && new Date() > user.tokenExpiryDate) {
               // console.log('Token expired, attempting refresh for user:', userId);
               // Token is expired, try to refresh it
               const newToken = await refreshAccessToken(userId);
               // console.log("This is newToken",newToken)
               if (!newToken) {
                    // console.log('Failed to refresh token for user:', userId);
                    return null;
               }
               // console.log('Token refreshed successfully for user:', userId);
          }

          oauth2Client.setCredentials({
               access_token: user.googleAccessToken,
               refresh_token: user.googleRefreshToken,
               expiry_date: user.tokenExpiryDate
          });

          // Verify token scopes
          try {
               const tokenInfo = await oauth2Client.getTokenInfo(user.googleAccessToken);
               // console.log('Token scopes:', tokenInfo.scopes);
               if (!tokenInfo.scopes.includes('https://www.googleapis.com/auth/calendar')) {
                    // console.log('Token missing required calendar scope');
                    return null;
               }
          } catch (error) {
               console.error('Error verifying token:', error);
               return null;
          }

          const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

          const event = {
               
               summary: 'summary it is',
               // description: `${link.reminderNote || 'Reminder'}\n\nLink: ${link.url}`,
               description: "This is des",
               start: {
                    dateTime: formatToISTISO(link.reminderDate),
                    timeZone: 'Asia/Kolkata',
               },
               end: {
                    dateTime: formatToISTISO(new Date(link.reminderDate.getTime() + 30 * 60000)), // 30 minutes duration
                    timeZone: 'Asia/Kolkata',
               },
               // start: {
               //      date: link.reminderDate.toISOString().split('T')[0], // just 'YYYY-MM-DD'
               //  },
               //  end: {
               //      date: link.reminderDate.toISOString().split('T')[0], // same day
               //  },
               reminders: {
                    useDefault: false,
                    overrides: [
                         { method: 'email', minutes: 0 }, // 0 minutes before (at the time of the event)
                         { method: 'popup', minutes: 0 }, // 0 minutes before (at the time of the event)
                    ],
               },
          };

          // console.log('Attempting to create calendar event:', event);

          const response = await calendar.events.insert({
               auth: oauth2Client,
               calendarId: 'primary',
               requestBody: event,
          });

          // console.log('Calendar event created successfully:', response.data);
          return response.data;
     } catch (error) {
          console.error('Error creating calendar event:', error);
          if (error.response) {
               console.error('Error response:', error.response.data);
          }
          return null;
     }
};

// Delete calendar event
export const deleteCalendarEvent = async (userId, eventId) => {
     try {
          const user = await User.findById(userId);
          if (!user?.googleAccessToken) {
               return false;
          }

          oauth2Client.setCredentials({
               access_token: user.googleAccessToken
          });

          const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

          await calendar.events.delete({
               calendarId: 'primary',
               eventId: eventId,
          });

          return true;
     } catch (error) {
          console.error('Error deleting calendar event:', error);
          return false;
     }
};

export const refreshAccessToken = async (userId) => {
     try {
          const user = await User.findById(userId);
          if (!user?.googleRefreshToken) {
               return null;
          }

          // console.log("THIS IS USER",user)

          oauth2Client.setCredentials({
               refresh_token: user.googleRefreshToken
          });

          const refreshed = await oauth2Client.refreshToken(user.googleRefreshToken);
          // console.log("This is refreshed", refreshed);
          // console.log("This is refreshed Credential", refreshed.credentials);
          // const tokens = refreshed.credentials;
          const tokens = refreshed.tokens;

          // console.log("TOKENS in refresh",tokens);
          
          // Update user's tokens
          user.googleAccessToken = tokens.access_token;
          user.tokenExpiryDate = new Date(Date.now() + 3*60 * 1000); // 1 hour expiry
          if (tokens.refresh_token) {
               user.googleRefreshToken = tokens.refresh_token;
          }
          // console.log("User in refreshaccesstoken 7 ", user);
          await user.save();

          return tokens.access_token;
     } catch (error) {
          console.error('Error refreshing access token:', error);
          return null;
     }
}; 