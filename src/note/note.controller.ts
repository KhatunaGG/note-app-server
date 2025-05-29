import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { Types } from 'mongoose';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req, @Body() createNoteDto: CreateNoteDto) {
    return this.noteService.create(req.userId, createNoteDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getNotes(@Req() req, @Query('isArchived') isArchived: string) {
    let isArchivedValue: boolean | undefined = undefined;
    if (isArchived === 'true') isArchivedValue = true;
    if (isArchived === 'false') isArchivedValue = false;
    return this.noteService.findAll(req.userId, isArchivedValue);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Req() req, @Param('id') id: string) {
    return this.noteService.findOne(req.userId, id);
  }

  @Get('filtered-by-tag/:tag')
  @UseGuards(AuthGuard)
  notesFilteredByTag(@Req() req, @Param('tag') tag: string) {
    return this.noteService.notesFilteredByTag(req.userId, tag);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ) {
    return this.noteService.update(req.userId, id, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Req() req, @Param('id') id: string) {
    console.log(id, 'id to delete');
    return this.noteService.remove(req.userId, id);
  }
}
