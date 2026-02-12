import { Controller, Get, Post, Delete, Body, Param, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('health')
  getHealth(): object {
    return this.appService.getHealth();
  }

  @Get('users')
  getUsers(): object {
    return {
      count: this.appService.getUsers().length,
      items: this.appService.getUsers(),
    };
  }

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto): object {
    const newUser = this.appService.addUser(createUserDto);
    return {
      message: 'User created successfully',
      user: newUser,
    };
  }

  @Delete('users/:id')
  @HttpCode(HttpStatus.OK)
  deleteUser(@Param('id') id: string): object {
    const userId = parseInt(id, 10);
    const deleted = this.appService.removeUser(userId);

    if (!deleted) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return {
      message: `User ${userId} deleted successfully`,
    };
  }
}
