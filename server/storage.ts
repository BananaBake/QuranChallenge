import { 
  users, 
  type User, 
  type InsertUser,
  gameHistory,
  type GameHistory,
  type InsertGameHistory
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveGameHistory(data: InsertGameHistory): Promise<GameHistory>;
  getGameHistoryByUserId(userId: number): Promise<GameHistory[]>;
  getRecentGameHistory(userId: number, limit: number): Promise<GameHistory[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameHistories: Map<number, GameHistory>;
  private userCurrentId: number;
  private gameHistoryCurrentId: number;

  constructor() {
    this.users = new Map();
    this.gameHistories = new Map();
    this.userCurrentId = 1;
    this.gameHistoryCurrentId = 1;
    
    // Create a default user
    this.createUser({
      username: "default",
      password: "password"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveGameHistory(data: InsertGameHistory): Promise<GameHistory> {
    const id = this.gameHistoryCurrentId++;
    const now = new Date();
    
    const gameHistoryEntry: GameHistory = {
      ...data,
      id,
      completedAt: now
    };
    
    this.gameHistories.set(id, gameHistoryEntry);
    return gameHistoryEntry;
  }
  
  async getGameHistoryByUserId(userId: number): Promise<GameHistory[]> {
    return Array.from(this.gameHistories.values())
      .filter(history => history.userId === userId);
  }
  
  async getRecentGameHistory(userId: number, limit: number): Promise<GameHistory[]> {
    return Array.from(this.gameHistories.values())
      .filter(history => history.userId === userId)
      .sort((a, b) => {
        const dateA = new Date(a.completedAt).getTime();
        const dateB = new Date(b.completedAt).getTime();
        return dateB - dateA; // Sort in descending order (newest first)
      })
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
