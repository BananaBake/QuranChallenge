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
    
    this.initializeDefaultUser();
  }

  private async initializeDefaultUser(): Promise<void> {
    this.createUser({
      username: "default",
      password: "password"
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveGameHistory(data: InsertGameHistory): Promise<GameHistory> {
    const id = this.gameHistoryCurrentId++;
    
    // Ensure userId is not undefined
    const userId = typeof data.userId === 'number' ? data.userId : null;
    
    const gameHistoryEntry: GameHistory = {
      id,
      userId,
      gameType: data.gameType,
      score: data.score,
      maxScore: data.maxScore,
      timeSpent: data.timeSpent,
      completedAt: new Date()
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
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
