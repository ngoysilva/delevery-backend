import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination.dto';

export class QueryFoodsDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Rechercher par nom de plat' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filtrer par ID de catégorie' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({
    enum: ['recommended', 'popular'],
    description: 'Filtrer par type',
  })
  @IsOptional()
  @IsIn(['recommended', 'popular'])
  type?: string;
}
