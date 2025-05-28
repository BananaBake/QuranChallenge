import { 
  users, 
  gameHistory,
} from "../shared/schema.js"; // Adjusted path and added .js

export class MemStorage {
  constructor() {
    this.users = new Map();
    this.gameHistories = new Map();
    this.userCurrentId = 1;
    this.gameHistoryCurrentId = 1;
    
    this.initializeDefaultUser();
  }

  async initializeDefaultUser() {
    // Simulating createUser logic without actual User/InsertUser types
    this.createUser({
      username: "default",
      password: "password"
    });
  }

  async getUser(id) {
    return this.users.get(id);
  }

  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser) {
    const id = this.userCurrentId++;
    // Simulate Drizzle's select type by spreading insertUser and adding id
    const user = { ...insertUser, id }; 
    this.users.set(id, user);
    return user;
  }
  
  async saveGameHistory(data) {
    const id = this.gameHistoryCurrentId++;
    
    const userId = typeof data.userId === 'number' ? data.userId : null;
    
    // Simulate Drizzle's select type
    const gameHistoryEntry = {
      id,
      userId,
      gameType: data.gameType,
      score: data.score,
      maxScore: data.maxScore,
      timeSpent: data.timeSpent,
      completedAt: new Date() // Drizzle's defaultNow() equivalent
    };
    
    this.gameHistories.set(id, gameHistoryEntry);
    return gameHistoryEntry;
  }
  
  async getGameHistoryByUserId(userId) {
    return Array.from(this.gameHistories.values())
      .filter(history => history.userId === userId);
  }
  
  async getRecentGameHistory(userId, limit) {
    return Array.from(this.gameHistories.values())
      .filter(history => history.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
