import Poll from "../models/Poll.js";
import { createTimeout } from "../utils/timer.js";
import Student from "../models/Student.js";

let currentPoll = null;
let pollTimeout = null;
let ioInstance = null;

export const setIo = (io) => {
  ioInstance = io;
};

export const createPoll = async (req, res) => {
  const { question, options, duration = 60 } = req.body;

  if (currentPoll && currentPoll.active) {
    return res
      .status(400)
      .json({ message: "Another poll is currently active" });
  }

  const poll = new Poll({
    question,
    options: options.map((option) => ({ option, votes: 0 })),
    duration,
    responses: {}, // change from Map to object for MongoDB compatibility
    active: true,
  });

  // poll.asked = true;
  await poll.save();
  currentPoll = poll;

  pollTimeout = createTimeout(duration, async () => {
    currentPoll.active = false;
    await currentPoll.save();
    ioInstance.emit("pollEnded");
    currentPoll = null;
  });

  ioInstance.emit("newPoll", currentPoll);
  res.status(201).json(currentPoll);
};

export const getActivePoll = async (req, res) => {
  if (!currentPoll || !currentPoll.active) {
    return res.status(404).json({ message: "No active poll" });
  }
  res.json(currentPoll);
};

export const getPollHistory = async (req, res) => {
  const polls = await Poll.find({ active: false })
    .sort({ createdAt: -1 })
    .limit(10);
  res.json(polls);
};

export const submitAnswer = async (socket, answer) => {
  if (!currentPoll || !currentPoll.active) return;

  if (currentPoll.responses[socket.id]) return; // prevent double submission

  currentPoll.responses[socket.id] = answer;

  const index = currentPoll.options.findIndex((opt) => opt.option === answer);
  if (index !== -1) {
    currentPoll.options[index].votes += 1;
  }

  await currentPoll.save();

  const getActiveStudentCount = async () => {
    const studentCount = await Student.countDocuments();
    return studentCount;
  };
  const totalStudents = await getActiveStudentCount();
  const answeredCount = Object.keys(currentPoll.responses).length;

  const results = currentPoll.options.map((opt) => ({
    text: opt.option,
    percentage:
      totalStudents > 0 ? Math.round((opt.votes / totalStudents) * 100) : 0,
  }));

  ioInstance.emit("pollResults", {
    question: currentPoll.question,
    results,
    answeredCount: Object.keys(currentPoll.responses).length,
    totalStudents,
  });

  if (answeredCount >= totalStudents) {
    clearTimeout(pollTimeout);
    currentPoll.active = false;
    await currentPoll.save();
    ioInstance.emit("pollEnded");
    currentPoll = null;
  }
};

export const getPollResults = async (req, res) => {
  if (!currentPoll || !currentPoll.active) {
    return res.status(404).json({ message: "No active poll" });
  }

  const totalStudents = await Student.countDocuments();

  const answeredCount = Object.keys(currentPoll.responses).length;

  const results = currentPoll.options.map((opt) => ({
    text: opt.option,
    percentage:
      totalStudents > 0 ? Math.round((opt.votes / totalStudents) * 100) : 0,
  }));

  res.json({
    question: currentPoll.question,
    results,
    answeredCount,
    totalStudents,
  });
};
