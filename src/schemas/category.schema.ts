import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type CategoryDocument = Category & Document;

export enum CategoryStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}

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

  @ApiProperty({
    enum: CategoryStatus,
    example: CategoryStatus.INACTIVE,
    description: 'active = visible mobile, inactive = pas de plats, suspended = masqué manuellement',
  })
  @Prop({ enum: CategoryStatus, default: CategoryStatus.INACTIVE })
  status: CategoryStatus;

  @ApiProperty({ example: 0, description: 'Nombre de plats associés (calculé automatiquement)' })
  @Prop({ default: 0 })
  foodCount: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ status: 1 });
