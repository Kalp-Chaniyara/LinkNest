import Link from "../model/link.model.js";
import mongoose from "mongoose";

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

          const oldLink = await Link.findOne({ title });

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

          console.log("FILTERED LINK", links);

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

// export const deleteLinksByGroupId = async (req, res) => {
//      const userId = req.user._id;
//      const { groupId } = req.body;

//      try {
//           if (!groupId) {
//                return res.status(400).json({
//                     success: false,
//                     message: "Group ID is required"
//                });
//           }

//           // Find and delete all links that belong to this group
//           const result = await Link.deleteMany({
//                userId,
//                "group.id": groupId
//           });

//           if (result.deletedCount === 0) {
//                return res.status(404).json({
//                     success: false,
//                     message: "No links found for this group"
//                });
//           }

//           return res.status(200).json({
//                success: true,
//                message: `Successfully deleted ${result.deletedCount} links`,
//                deletedCount: result.deletedCount
//           });
//      } catch (error) {
//           console.error("Error deleting links by group:", error.message);
//           return res.status(500).json({
//                success: false,
//                message: "Error while deleting links"
//           });
//      }
// };