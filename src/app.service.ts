import { Injectable } from '@nestjs/common';
import { users, UserRecord } from './data/users';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AppService {
  private users: UserRecord[] = [...users];

  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  getUsers(): UserRecord[] {
    return this.users;
  }

  addUser(createUserDto: CreateUserDto): UserRecord {
    const newUser: UserRecord = {
      id: this.users.length > 0 ? Math.max(...this.users.map(u => u.id)) + 1 : 1,
      name: createUserDto.name,
      role: createUserDto.role,
      location: createUserDto.location,
      joinedAt: new Date().toISOString(),
    };
    this.users.push(newUser);
    return newUser;
  }

  removeUser(id: number): boolean {
    const index = this.users.findIndex(u => u.id === id);
    if (index === -1) {
      return false;
    }
    this.users.splice(index, 1);
    return true;
  }
}
