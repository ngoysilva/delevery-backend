import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ example: 'Jean Mukendi' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 'jean.mukendi@email.com' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ example: '+243991234567' })
  @Prop({ required: true })
  phone: string;

  @Prop({ default: null })
  avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
