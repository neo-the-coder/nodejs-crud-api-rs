// src/models/User.ts
import { v4 as uuidv4 } from 'uuid';

class UserModel {
  users = [];

  getAllUsers() {
    return this.users;
  }

  getUserById(userId) {
    return this.users.find((user) => user.id === userId);
  }

  createUser(username, age, hobbies) {
    const newUser = {
      id: uuidv4(),
      username,
      age,
      hobbies,
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(userId, updatedData) {
    const userIndex = this.users.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updatedData };
      return this.users[userIndex];
    }
    return undefined;
  }

  deleteUser(userId) {
    const initialLength = this.users.length;
    this.users = this.users.filter((user) => user.id !== userId);
    return initialLength !== this.users.length;
  }
}

export const userModel = new UserModel();
