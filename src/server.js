import { createServer } from "http";
import { parse } from "url";
import { userModel } from "./models/User.js";
import { hasUserIdError } from "./utils/handleUserIdError.js";

const server = createServer((req, res) => {
  const { pathname, query } = parse(req.url);

  // GET api/users
  if (pathname === "/api/users" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(userModel.getAllUsers()));
  }

  // GET api/users/{userId}
  else if (pathname.startsWith("/api/users/") && req.method === "GET") {
    const userId = pathname.split("/").pop();

    if (!hasUserIdError(userId, res)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(user));
    }
  }

  // POST api/users
  else if (pathname === "/api/users" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const { username, age, hobbies } = JSON.parse(body);
      console.log(body);

      if (!username || !age || !hobbies) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("username, age and hobbies are required fields");
      } else {
        const newUser = userModel.createUser(username, age, hobbies);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
      }
    });
  }

  // PUT api/users/{userId}
  else if (pathname.startsWith("/api/users/") && req.method === "PUT") {
    const userId = pathname.split("/").pop();

    if (myValidate(userId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid userId format");
      return;
    } else if (userModel.getUserById(user) === -1) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("User not found");
    }

    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      body = JSON.parse(body);

      if (!body) {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("No change have been provided");
      } else {
        const updatedUser = userModel.updateUser(userId, body);

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedUser));
      }
    });
  }

  // DELETE api/users/{userId}
  else if (pathname.startsWith("/api/users/") && req.method === "DELETE") {
    const userId = pathname.split("/").pop();

    if (myValidate(userId)) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Invalid userId format");
      return;
    } else if (userModel.getUserById(user) === -1) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("User not found");
    }

    const deleted = userModel.deleteUser(userId);

    if (deleted) {
      res.writeHead(204, { "Content-Type": "text/plain" });
      res.end("User has been deleted");
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Unexpected error");
    }
  }

  // Handle other routes...
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
  console.log("Response ended with status code:", res.statusCode);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
