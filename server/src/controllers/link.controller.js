import Link from "../model/link.model.js";
import mongoose from "mongoose";
import User from "../model/user.model.js";

//new line below two
import { cancelReminder, scheduleReminder } from '../services/reminder.service.js';
// import { 
//      createCalendarEvent, 
//      deleteCalendarEvent 
// } from '../services/calendar.service.js';

export const fetchGrpFromDB = async (req, res) => {
     const userId = req.user._id;
     try {
          const groups = await Link.aggregate([
               { $match: { userId: new mongoose.Types.ObjectId(userId) } },
               { $project: { group: 1 } },
               { $match: { 
                    "group.name": { $ne: null },
                    "group.id": { $ne: null },
                    "group.color": { $ne: null }
               }},
               {
                    $group: {
                         _id: "$group.name",
                         id: { $first: "$group.id" },
                         name: { $first: "$group.name" },
                         color: { $first: "$group.color" },
                    },
               },
          ]);
          return res.status(200).json(groups);
     } catch (error) {
          console.error("Error fetching user groups:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
     }
}

export const addLinkToDB = async (req, res) => {
     const userId = req.user._id;
     const { title, url, description, group, reminderDate, reminderNote, isNewGrp } = req.body;

     // console.log("Server received reminderDate in addLinkToDB:", reminderDate);

     try {
          if (!userId) {
               return res.status(400).json({
                    success: false,
                    message: "Unauthorized access"
               });
          }

          if (!title || !url) {
               return res.status(400).json({
                    success: false,
                    message: "Title and URL are required fields"
               });
          }

          const oldLink = await Link.findOne({ userId, title });

          if (oldLink) {
               return res.status(400).json({
                    success: false,
                    title: "Warning",
                    message: "A link with this title already exists",
                    type: "warning"
               });
          }

          // Check for existing group with same name
          if (group?.name) {
               const existingGroup = await Link.findOne({
                    userId,
                    "group.name": group.name
               });

               if (existingGroup) {
                    // If group exists, use its properties
                    group.id = existingGroup.group.id;
                    group.color = existingGroup.group.color;
               } else if (isNewGrp) {
                    // Only generate new ID and color for new groups
                    group.id = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
                    group.color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`;
               }
          }

          const link = new Link({
               userId,
               title,
               url,
               description,
               group: group || null,
               reminderDate,
               reminderNote
          });

          await link.save();

          //! new part
          // Schedule reminder if reminderDate is set
          if (reminderDate) {
               // Schedule email and push notifications, which includes calendar event creation
               await scheduleReminder(link._id, userId);

               // Check if the reminder service indicated a token refresh is needed
               // The needsTokenRefresh logic is now primarily handled within scheduleReminder's flow
               // and propagated through the addLink response.
               const user = await User.findById(userId);
               if (user?.googleId && !user.googleAccessToken) { // Simplified check for needing a refresh
                    return res.status(200).json({
                         success: true,
                         _id: link._id,
                         userId: link.userId,
                         title: link.title,
                         url: link.url,
                         description: link.description,
                         group: link.group,
                         reminderDate: link.reminderDate,
                         reminderNote: link.reminderNote,
                         calendarEventId: link.calendarEventId, // This will be null initially if refresh needed
                         createdAt: link.createdAt,
                         needsTokenRefresh: true
                    });
               }
          }

          return res.status(201).json({
               success: true,
               _id: link._id,
               userId: link.userId,
               title: link.title,
               url: link.url,
               description: link.description,
               group: link.group,
               reminderDate: link.reminderDate,
               reminderNote: link.reminderNote,
               calendarEventId: link.calendarEventId,
               createdAt: link.createdAt
          });
     } catch (error) {
          console.error("Error adding link:", error.message);
          return res.status(500).json({
               success: false,
               message: "Failed to add link. Please try again."
          });
     }
}

export const fetchLinksFromDB = async (req, res) => {
     const userId = req.user._id;

     try {
          const links = await Link.find({ userId })
               .select('-userId') // 👈 This excludes the 'userId' field
               .exec();

          // console.log("FILTERED LINK", links);

          return res.status(200).json(links);
     } catch (error) {
          console.error("Error fetching links:", error.message);
          return res.status(500).json({ message: "Internal Server Error" });
     }
}

export const deleteLinkFromDB = async (req, res) => {
     const userId = req.user._id;
     const { linkId } = req.body;

     try {
          if (!linkId) {
               return res.status(400).json({
                    success: false,
                    message: "Link ID is required"
               });
          }

          const deletedLink = await Link.findOneAndDelete({
               _id: linkId,
               userId: userId
          });

          if (!deletedLink) {
               return res.status(404).json({
                    success: false,
                    message: "Link not found or you don't have permission to delete it"
               });
          }

          return res.status(200).json({
               success: true,
               message: "Link deleted successfully"
          });
     } catch (error) {
          console.error("Error deleting link:", error.message);
          return res.status(500).json({
               success: false,
               message: "Error while deleting the link"
          });
     }
}

export const deleteGroupFromDB = async (req, res) => {
     const userId = req.user._id;
     const { groupId } = req.body;

     try {
          if (!groupId) {
               return res.status(400).json({
                    success: false,
                    title: "warning",
                    message: "Group ID is required"
               });
          }

          const result = await Link.deleteMany({
               userId,
               "group.id": groupId
          });

          if (result.deletedCount === 0) {
               return res.status(404).json({
                    success: false,
                    title: "warning",
                    message: "No links found for this group"
               });
          }

          return res.status(200).json({
               success: true,
               message: `Successfully deleted ${result.deletedCount} links`,
               deletedCount: result.deletedCount
          });
     } catch (error) {
          console.error("Error deleting group:", error.message);
          return res.status(500).json({
               success: false,
               title: "Error",
               message: "Failed to delete group. Please try again."
          });
     }
}

// Add a new function to handle reminder updates
export const updateReminder = async (req, res) => {
     const userId = req.user._id;
     const { linkId } = req.params;
     const { reminderDate, reminderNote } = req.body;

     try {
          const link = await Link.findOne({ _id: linkId, userId });
          if (!link) {
               return res.status(404).json({
                    success: false,
                    message: "Link not found"
               });
          }

          // Cancel existing reminder
          cancelReminder(linkId);

          // Delete existing calendar event if any
          if (link.calendarEventId) {
               await deleteCalendarEvent(userId, link.calendarEventId);
               link.calendarEventId = null;
          }

          // Update reminder details
          link.reminderDate = reminderDate;
          link.reminderNote = reminderNote;

          // Schedule new reminder if date is set
          if (reminderDate) {
               await scheduleReminder(link._id, userId);

               // Create new calendar event
               const calendarEvent = await createCalendarEvent(userId, link);
               if (calendarEvent) {
                    link.calendarEventId = calendarEvent.id;
               } else {
                    // If calendar event creation fails, it might be due to expired token
                    const user = await User.findById(userId);
                    if (user?.googleId) {
                         return res.status(200).json({
                              success: true,
                              link,
                              needsTokenRefresh: true
                         });
                    }
               }
          }

          await link.save();

          return res.status(200).json({
               success: true,
               link
          });
     } catch (error) {
          console.error("Error updating reminder:", error);
          return res.status(500).json({
               success: false,
               message: "Failed to update reminder"
          });
     }
};

// export const syncCalendarEventInDB = async (req, res) => {
//      const userId = req.user._id;
//      const { linkId } = req.params;

//      try {
//           const link = await Link.findOne({ _id: linkId, userId });
//           if (!link) {
//                return res.status(404).json({
//                     success: false,
//                     message: "Link not found"
//                });
//           }

//           if (!link.reminderDate) {
//                return res.status(400).json({
//                     success: false,
//                     message: "Link does not have a reminder date"
//                });
//           }

//           if (link.calendarEventId) {
//                return res.status(200).json({
//                     success: true,
//                     message: "Calendar event already exists for this link",
//                     link
//                });
//           }

//           const calendarEvent = await createCalendarEvent(userId, link);

//           if (calendarEvent) {
//                link.calendarEventId = calendarEvent.id;
//                await link.save();
//                // console.log("Server response link after calendar sync:", link);
//                return res.status(200).json({
//                     success: true,
//                     message: "Calendar event synced successfully",
//                     link
//                });
//           } else {
//                const user = await User.findById(userId);
//                if (user?.googleId) {
//                     return res.status(200).json({
//                          success: false,
//                          message: "Failed to sync calendar event, Google token might need refresh",
//                          needsTokenRefresh: true,
//                          link
//                     });
//                } else {
//                     return res.status(500).json({
//                          success: false,
//                          message: "Failed to sync calendar event"
//                     });
//                }
//           }
//      } catch (error) {
//           console.error("Error syncing calendar event:", error);
//           return res.status(500).json({
//                success: false,
//                message: "Failed to sync calendar event"
//           });
//      }
// };