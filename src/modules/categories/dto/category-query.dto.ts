import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsIn } from 'class-validator';
import { PaginationQueryDto } from '../../../common/pagination.dto';

export class CategoryQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: ['active', 'inactive', 'suspended'],
    description: 'Filtrer par statut',
  })
  @IsOptional()
  @IsIn(['active', 'inactive', 'suspended'])
  status?: string;
}
