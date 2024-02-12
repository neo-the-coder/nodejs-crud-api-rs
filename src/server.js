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
    console.info(JSON.stringify(userModel.getAllUsers()));
    console.info("Response ended with status code:", res.statusCode);
  }

  // GET api/users/{userId}
  else if (pathname.startsWith("/api/users/") && req.method === "GET") {
    const userId = pathname.split("/").pop();

    if (!hasUserIdError(userId, res)) {
      res.writeHead(200, { "Content-Type": "application/json" });
      const user = userModel.getUserById(userId);
      res.end(JSON.stringify(user));
      console.info(JSON.stringify(user));
    }
    console.info("Response ended with status code:", res.statusCode);
  }

  // POST api/users
  else if (pathname === "/api/users" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const { username, age, hobbies } = JSON.parse(body);

      if (!username || !age || !hobbies) {
        res.writeHead(400, { "Content-Type": "text/plain" });
        res.end("username, age and hobbies are required fields");
        console.info("username, age and hobbies are required fields");
      } else {
        const newUser = userModel.createUser(username, age, hobbies);

        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify(newUser));
        console.info(JSON.stringify(newUser));
      }
      console.info("Response ended with status code:", res.statusCode);
    });
  }

  // PUT api/users/{userId}
  else if (pathname.startsWith("/api/users/") && req.method === "PUT") {
    const userId = pathname.split("/").pop();
    if (!hasUserIdError(userId, res)) {
      let body = "";

      req.on("data", (chunk) => {
        body += chunk.toString();
      });

      req.on("end", () => {
        if (
          ['"username"', '"age"', '"hobbies"'].some((prop) =>
            body.includes(prop)
          )
        ) {
          body = JSON.parse(body);
          const updatedUser = userModel.updateUser(userId, body);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify(updatedUser));
          console.info(JSON.stringify(updatedUser));
        } else {
          res.writeHead(422, { "Content-Type": "text/plain" });
          res.end("Invalid property type");
          console.info("Invalid property type");
        }
        console.info("Response ended with status code:", res.statusCode);
      });
    }
  }

  // DELETE api/users/{userId}
  else if (pathname.startsWith("/api/users/") && req.method === "DELETE") {
    const userId = pathname.split("/").pop();

    if (!hasUserIdError(userId, res)) {
      const deleted = userModel.deleteUser(userId);

      if (deleted) {
        res.writeHead(204, { "Content-Type": "text/plain" });
        res.end("User has been deleted");
        console.info("User has been deleted");
      } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Unexpected error");
        console.info("Unexpected error");
      }
    }
    console.info("Response ended with status code:", res.statusCode);
  }

  // Handle other routes...
  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Requested resourse not Found");
    console.info("Requested resourse not Found");
  }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
