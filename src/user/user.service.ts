import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findOne(query) {
    return this.userModel.findOne(query);
  }

  create(createAuthDto: CreateAuthDto) {
    return this.userModel.create(createAuthDto);
  }
}
