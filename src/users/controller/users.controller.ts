import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { UsersService } from '../service/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createOneUser(
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('email') email: string,
  ) {
    const generatedId = await this.usersService.createOneUser(
      name,
      surname,
      email,
    );
    return { id: generatedId };
  }

  @Get()
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  getOneUser(@Param('id') userId: string) {
    return this.usersService.getOneUser(userId);
  }

  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('surname') surname: string,
    @Body('email') email: string,
  ) {
    this.usersService.updateUser(id, name, surname, email);
    return null;
  }

  @Delete(':id')
  deleteUser(@Param('id') userId: string) {
    this.usersService.deleteUser(userId);
    return null;
  }
}
