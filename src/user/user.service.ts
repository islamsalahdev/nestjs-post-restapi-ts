import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: Omit<User, '_id'>): Promise<User> {
    return this.userRepository.create(createUserDto);
  }
  async updateRefreshToken(user: User, refreshToken: string): Promise<void> {
    return this.userRepository.updateOne({ _id: user._id }, { refreshToken });
  }

  async getUserById(id: string): Promise<UserDocument | null> {
    return this.userRepository.findOne({ _id: id });
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    return this.userRepository.findOne({ email: email.toLowerCase() });
  }
}
