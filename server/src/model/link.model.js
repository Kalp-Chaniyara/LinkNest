import mongoose from "mongoose";
import { Schema } from "mongoose";

const linkSchema = new mongoose.Schema({
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
     },
     title: {
          type: String,
          required: true,
     },
     url: {
          type: String,
          required: true,
     },
     description: {
          type: String,
     },
     group: {
          id: {
               type: String
          },
          name: {
               type: String
          },
          color: {
               type: String
          }
     },
     reminderDate: {
          type: Date,
     },
     reminderNote: {
          type: String,
     },
     isFavorite: {
          type: Boolean,
          default: false
     },
     tags: [{
          type: String
     }]
}, {
     timestamps: true,
});

const Link = mongoose.model("Link", linkSchema);

export default Link;