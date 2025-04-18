import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop()
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'note',
    default: [],
  })
  notes: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
