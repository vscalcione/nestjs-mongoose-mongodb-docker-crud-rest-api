import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../model/user.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<User>) {}

  /**
   * Create one user
   * @param name
   * @param surname
   * @param email
   */
  async createOneUser(name: string, surname: string, email: string) {
    const newUser = new this.userModel({ name, surname, email });
    const result = await newUser.save();
    return result.id as string;
  }

  /**
   * Get all users
   */
  async getAllUsers() {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    }));
  }

  /**
   * Get one user
   */
  async getOneUser(userId: string) {
    const user = await this.findUser(userId);
    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
    };
  }

  /**
   * Update user
   * @param userId
   * @param name
   * @param surname
   * @param emaill
   */
  async updateUser(
    userId: string,
    name: string,
    surname: string,
    email: string,
  ) {
    const modifiedUser = await this.findUser(userId);
    if (name) modifiedUser.name = name;
    if (surname) modifiedUser.surname = surname;
    if (email) modifiedUser.email = email;
    modifiedUser.save();
  }

  /**
   * Delete user
   * @param userId
   */
  async deleteUser(userId: string) {
    const result = await this.userModel.deleteOne({ _id: userId }).exec();
    if (result.n === 0) throw new NotFoundException('Could not find user');
  }

  private async findUser(id: string): Promise<User> {
    let user: any;
    try {
      user = await (await this.userModel.findById(id)).execPopulate();
    } catch (error) {
      throw new NotFoundException('Could not find user');
    }
    if (!user) throw new NotFoundException('Could not find user');
    return user;
  }
}
