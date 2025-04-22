import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model, Types } from 'mongoose';
// import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findOne(query) {
    return this.userModel.findOne(query);
  }

  create(createUserDto: CreateUserDto) {
    return this.userModel.create(createUserDto);
  }

  getById(id: Types.ObjectId | string) {
    return this.userModel.findById(id);
  }

  findAll() {
    return this.userModel.find();
  }

  findUserForPasswordsCompare(query) {
    return this.userModel.findOne(query).select('+password');
  }
}
