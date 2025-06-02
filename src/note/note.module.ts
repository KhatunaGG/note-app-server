import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteController } from './note.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Note, NoteSchema } from './schema/note.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
    UserModule,
  ],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
