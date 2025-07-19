export const validatePollPayload = (req, res, next) => {
  const { question, options } = req.body;
  if (!question || typeof question !== "string") {
    return res
      .status(400)
      .json({ message: "Question is required and must be a string" });
  }
  if (!Array.isArray(options) || options.length < 2) {
    return res
      .status(400)
      .json({ message: "At least two options are required" });
  }
  next();
};
