import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId }],
    ref: 'Note',
    default: [],
  })
  notes: mongoose.Types.ObjectId[];

  @Prop()
  validationToken: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop()
  validationLinkValidateDate: Date;

  @Prop({ default: 0 })
  resendCount: number;

  @Prop({ default: () => new Date() })
  resendCountResetAt: Date;

  @Prop()
  avatar?: string
}

export const UserSchema = SchemaFactory.createForClass(User);
