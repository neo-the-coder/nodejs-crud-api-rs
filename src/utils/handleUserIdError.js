import { userModel } from "../models/User.js";

const userNotValid = (userId) => {
  const regexp =
    /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
  return !regexp.test(userId);
};

export const hasUserIdError = (userId, res) => {
  let hasError = false;

  if (userNotValid(userId)) {
    hasError = true;
    res.writeHead(400, { "Content-Type": "text/plain" });
    res.end("Invalid userId format");
  } else if (userModel.getUserById(userId) === undefined) {
    hasError = true;
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("User not found");
  }
  return hasError;
};
