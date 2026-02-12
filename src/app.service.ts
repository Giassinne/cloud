import { Injectable } from '@nestjs/common';
import { users, UserRecord } from './data/users';

@Injectable()
export class AppService {
  getHealth(): object {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }

  getUsers(): UserRecord[] {
    return users;
  }
}
