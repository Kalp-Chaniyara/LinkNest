//the whole new file

import nodemailer from 'nodemailer';
import Link from '../model/link.model.js';
import User from '../model/user.model.js';
import { createCalendarEvent } from './calendar.service.js';
// import { sendPushNotification } from './push.service.js';

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
          user: `${process.env.EMAIL_USER}`,
          pass: `${process.env.EMAIL_PASS}`
     }
});

// Store active reminders
const activeReminders = new Map();

export const scheduleReminder = async (linkId, userId) => {
     try {
          const link = await Link.findById(linkId);
          if (!link || !link.reminderDate) {
               // console.log('No link or reminder date found for linkId:', linkId);
               return;
          }

          const user = await User.findById(userId);
          // console.log("USer in schedule 10", user);
          if (!user) {
               // console.log('No user found for userId:', userId);
               return;
          }

          // Cancel any existing reminder for this link
          cancelReminder(linkId);

          const reminderTime = new Date(link.reminderDate);
          const now = new Date();

          // If reminder time is in the past, don't schedule
          if (reminderTime <= now) {
               // console.log('Reminder time is in the past for linkId:', linkId);
               return;
          }

          // Calculate time until reminder
          const timeUntilReminder = reminderTime.getTime() - now.getTime();

          // Schedule the reminder
          const reminderTimeout = setTimeout(async () => {
               await sendReminder(link, user);
          }, timeUntilReminder);

          // Store the timeout ID
          activeReminders.set(linkId, reminderTimeout);

          // Create calendar event if user has Google Calendar access
          if (user.googleAccessToken) {
               // console.log('Attempting to create calendar event for link:', linkId);
               const calendarEvent = await createCalendarEvent(userId, link);
               if (calendarEvent) {
                    // console.log('Calendar event created successfully:', calendarEvent.id);
                    link.calendarEventId = calendarEvent.id;
                    await link.save();
               } else {
                    // console.log('Failed to create calendar event for link:', linkId);
               }
          } else {
               // console.log('No Google access token found for user:', userId);
          }
     } catch (error) {
          console.error('Error scheduling reminder:', error);
     }
};

export const cancelReminder = (linkId) => {
     const timeoutId = activeReminders.get(linkId);
     if (timeoutId) {
          clearTimeout(timeoutId);
          activeReminders.delete(linkId);
     }
};

const sendReminder = async (link, user) => {
     try {
          // Send email notification
          const mailOptions = {
               from: process.env.EMAIL_USER,
               to: user.email,
               subject: `Reminder: ${link.title}`,
               html: `
                    <h2>Reminder: ${link.title}</h2>
                    <p>${link.reminderNote || 'Time to check this link!'}</p>
                    <p><a href="${link.url}">Click here to view the link</a></p>
               `
          };

          await transporter.sendMail(mailOptions);

          // Send push notification if user has subscriptions
          if (user.pushSubscriptions && user.pushSubscriptions.length > 0) {
               for (const subscription of user.pushSubscriptions) {
                    await sendPushNotification(subscription, { title: `Reminder: ${link.title}`, body: link.reminderNote || 'Time to check this link!' });
               }
          }

     } catch (error) {
          console.error('Error sending reminder:', error);
     }
};

// Function to initialize reminders for all active links


export const initializeReminders = async () => {
    try {
        const now = new Date();
        const links = await Link.find({
            reminderDate: { $gt: now }
        });

        for (const link of links) {
            await scheduleReminder(link._id, link.userId);
        }
    } catch (error) {
        console.error('Error initializing reminders:', error);
    }
}; 