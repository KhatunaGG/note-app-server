import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Note } from './schema/note.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private noteModel: Model<Note>,
    private userService: UserService,
  ) {}


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
      const noteOwner = await this.userService.getById(userId);
      if (!noteOwner) throw new NotFoundException('User not found');
      noteOwner.notes.push(newNote._id);
      await noteOwner.save();
      return newNote;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async findAll(userId: Types.ObjectId | string, isArchived?: boolean) {
    if (!userId) {
      throw new ForbiddenException('Permission denied');
    }
    try {
      const userObjectId = new Types.ObjectId(userId);
      const filter: any = { userId: userObjectId };
      if (typeof isArchived === 'boolean') {
        filter.isArchived = isArchived;
      }
      const usersNotes = await this.noteModel.find(filter).exec();
      return usersNotes;
    } catch (e) {
      console.error('Error in findAll:', e);
      throw e;
    }
  }

  async findAllArchived(userId: Types.ObjectId | string) {
    if (!userId) {
      throw new ForbiddenException('Permission denied');
    }
    try {
      const userObjectId = new Types.ObjectId(userId);
      const archivedNotes = await this.noteModel
        .find({ userId: userObjectId, isArchived: true })
        .exec();
      return archivedNotes;
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
      const noteOwner = await this.userService.getById(userId);
      if (!noteOwner) throw new NotFoundException('User not found');
      const index = noteOwner.notes.findIndex(
        (noteId) => noteId.toString() === id.toString(),
      );
      if (index !== -1) {
        noteOwner.notes.splice(index, 1);
        await noteOwner.save();
      }
      await this.noteModel.findByIdAndDelete(id);

      return 'Note deleted successfully';
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async update(
    userId: Types.ObjectId | string,
    id: string,
    updateNoteDto: UpdateNoteDto,
  ) {
    if (!userId) {
      throw new ForbiddenException('Permission denied');
    }
    try {
      if (!id || !updateNoteDto) {
        throw new BadRequestException('Missing id or update data');
      }
      const updatedNote = await this.noteModel.findByIdAndUpdate(
        id,
        updateNoteDto,
        { new: true },
      );
      if (!updatedNote) {
        throw new NotFoundException(`Note with ID ${id} not found`);
      }
      const message =
        updatedNote.isArchived === true
          ? 'Note successfully archived'
          : 'Note successfully updated and restored';
      return message;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }

  async notesFilteredByTag(userId: Types.ObjectId | string, tag: string) {
    if (!userId) {
      throw new ForbiddenException('Permission denied');
    }
    try {
      if (!tag) throw new BadRequestException('Tag is required');
      const filteredByTag = await this.noteModel.find({
        userId,
        tags: { $in: [tag] },
      });
      return {
        filteredByTag,
        tag,
      };
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
}
