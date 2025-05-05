import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
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
  findAll(@Req() req) {
    return this.noteService.findAll(req.userId);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  findOne(@Req() req, @Param('id') id: string) {
    return this.noteService.findOne(req.userId, id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.noteService.update(+id, updateNoteDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Req() req, @Param('id') id: string) {
    console.log(id, "id to delete")
    return this.noteService.remove(req.userId, id);
  }
}
