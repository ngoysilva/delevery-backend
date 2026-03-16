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

  @ApiProperty({ enum: ['client', 'delivery', 'admin'], example: 'client' })
  @Prop({ enum: ['client', 'delivery', 'admin'], default: 'client' })
  role: string;

  /** Champs spécifiques livreur */
  @ApiProperty({ example: 'Lubumbashi, avenue du Commerce', required: false })
  @Prop({ default: null })
  address?: string;

  @ApiProperty({
    enum: ['moto', 'velo', 'voiture'],
    example: 'moto',
    required: false,
  })
  @Prop({ enum: ['moto', 'velo', 'voiture'], default: null })
  vehicleType?: string;

  @ApiProperty({ example: 'L1234567', required: false })
  @Prop({ default: null })
  cin?: string;

  @ApiProperty({ example: 'Disponible le weekend', required: false })
  @Prop({ default: null })
  notes?: string;

  @ApiProperty({ example: true, required: false })
  @Prop({ default: true })
  isActive?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
