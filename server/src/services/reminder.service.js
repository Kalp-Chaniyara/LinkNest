// //the whole new file

import nodemailer from 'nodemailer';
import Link from '../model/link.model.js';
import User from '../model/user.model.js';
// import { createCalendarEvent } from './calendar.service.js';
import { sendReminderEmail } from './email.service.js';

// // Create a transporter for sending emails
const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
          user: `${process.env.EMAIL_USER}`,
          pass: `${process.env.EMAIL_PASS}`
     }
});

// // Store active reminders
const activeReminders = new Map();

// // Function to check and send overdue reminders

export const scheduleReminder = async (linkId, userId) => {
    try {
        const link = await Link.findById(linkId);
        if (!link || !link.reminderDate) {
            return;
        }

        const user = await User.findById(userId);
        if (!user) {
            return;
        }

        // Cancel any existing reminder for this link
        cancelReminder(linkId);

        // Convert UTC time to local time for scheduling
        const reminderTime = new Date(link.reminderDate);
        const now = new Date();

        // If reminder time is in the past, don't schedule
        if (reminderTime <= now) {
            return;
        }

        // Calculate time until reminder
        const timeUntilReminder = reminderTime.getTime() - now.getTime();

        // Schedule the reminder
        const reminderTimeout = setTimeout(async () => {
            try {
                // Double check if reminder was already sent
                const currentLink = await Link.findById(linkId);
                if (currentLink && !currentLink.lastNotified) {
                    await sendReminder(currentLink, user);
                }
            } catch (error) {
                console.error('Error in reminder timeout:', error);
            }
        }, timeUntilReminder);

        // Store the timeout ID
        activeReminders.set(linkId, reminderTimeout);

        // Create calendar event if user has Google Calendar access
        // if (user.googleAccessToken) {
        //     const calendarEvent = await createCalendarEvent(userId, link);
        //     if (calendarEvent) {
        //         link.calendarEventId = calendarEvent.id;
        //         await link.save();
        //     }
        // }
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
        await sendReminderEmail(user.email, link);

        // Update lastNotified timestamp
        link.lastNotified = new Date();
        await link.save();
    } catch (error) {
        console.error('Error sending reminder:', error);
    }
};

export const initializeReminders = async () => {
    try {
        const now = new Date();
        const links = await Link.find({
            reminderDate: { $gt: now },
            lastNotified: { $exists: false }
        });

        for (const link of links) {
            await scheduleReminder(link._id, link.userId);
        }
    } catch (error) {
        console.error('Error initializing reminders:', error);
    }
}; 