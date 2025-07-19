import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  socketId: { type: String, required: true },
  name: { type: String, required: true },
  joinedAt: { type: Date, default: Date.now },
});

const Student = mongoose.model("Student", studentSchema);
export default Student;
