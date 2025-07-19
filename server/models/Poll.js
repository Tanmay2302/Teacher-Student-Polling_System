import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [
    {
      option: { type: String, required: true },
      votes: { type: Number, default: 0 },
    },
  ],
  active: { type: Boolean, default: true },
  // asked: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  duration: { type: Number, default: 60 },
  responses: { type: Object, default: {} }, // use plain object for socketId => answer
});

const Poll = mongoose.model("Poll", pollSchema);
export default Poll;
