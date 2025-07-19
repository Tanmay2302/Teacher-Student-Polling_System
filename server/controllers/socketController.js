import { submitAnswer, setIo } from "./pollController.js";
import Student from "../models/Student.js";
import Poll from "../models/Poll.js";

export const setIoInstance = (io) => {
  setIo(io);
};

export const registerSocketEvents = (io) => {
  io.on("connection", (socket) => {
    console.log("Student connected:", socket.id);

    socket.on("register_student", async (name) => {
      socket.data.name = name;
      await Student.create({ socketId: socket.id, name });
    });

    socket.on("submit_answer", async (answer) => {
      await submitAnswer(socket, answer);
    });

    socket.on("getPollHistory", async () => {
      const polls = await Poll.find({ active: false })
        .sort({ createdAt: -1 })
        .limit(10);
      const history = polls.map((poll) => ({
        question: poll.question,
        results: poll.options.map((opt) => ({
          text: opt.option,
          percentage: poll.responses
            ? Math.round((opt.votes / Object.keys(poll.responses).length) * 100)
            : 0,
        })),
      }));
      socket.emit("pollHistory", history);
    });

    socket.on("disconnect", async () => {
      console.log("Student disconnected:", socket.id);
      await Student.deleteOne({ socketId: socket.id });
    });
  });
};
