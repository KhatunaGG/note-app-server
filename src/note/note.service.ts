import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Type,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note } from './schema/note.schema';

@Injectable()
export class NoteService {
  constructor(@InjectModel(Note.name) private noteModel: Model<Note>) {}

  async create(userId: Types.ObjectId | string, createNoteDto: CreateNoteDto) {
    if (!userId) {
      throw new ForbiddenException('Permission denied');
    }
    try {
      if (!createNoteDto) throw new BadRequestException();
      const newNote = await this.noteModel.create({
        ...createNoteDto,
        userId: userId,
      });
      return newNote;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findAll(userId: Types.ObjectId | string) {
    if (!userId) {
      throw new ForbiddenException('Permission denied');
    }
    try {
      const userObjectId = new Types.ObjectId(userId);
      // console.log(userObjectId, "userObjectId")
      // console.log(userId, "userId")
      const usersAllNotes = await this.noteModel
        .find({ userId: userObjectId })
        .exec();
      return usersAllNotes;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findOne(userId: Types.ObjectId | string, id: string) {
    if (!userId) {
      throw new ForbiddenException('Permission denied');
    }
    try {
      const userObjectId = new Types.ObjectId(userId);
      const note = await this.noteModel.findOne({
        _id: id,
        userId: userObjectId,
      });
      if (!note) {
        throw new NotFoundException('Note not found or access denied');
      }
      return note;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async remove(userId: Types.ObjectId | string, id: string) {
    if (!userId) {
      throw new ForbiddenException('Permission denied');
    }
    try {
      if (!id) throw new BadRequestException('Note ID is required');
      await this.noteModel.findByIdAndDelete(id);

      return 'Note deleted successfully';
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} note`;
  // }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return `This action updates a #${id} note`;
  }
}
