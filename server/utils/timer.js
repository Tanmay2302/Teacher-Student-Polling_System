export const createTimeout = (durationInSec, callback) => {
  const timeout = setTimeout(callback, durationInSec * 1000);
  return timeout;
};
