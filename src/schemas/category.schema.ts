import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @ApiProperty({ example: 'Continental' })
  @Prop({ required: true })
  nom: string;

  @ApiProperty({
    example: 'https://cdn.fooddash.com/categories/continental.jpg',
  })
  @Prop({ required: true })
  image: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
