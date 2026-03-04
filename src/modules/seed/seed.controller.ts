import { Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { successResponse } from '../../common/api-response.helper';

@ApiTags('Seed')
@Controller('api/seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({
    summary: 'Initialiser la base de données avec des données de test',
  })
  @ApiResponse({ status: 201, description: 'Données de test insérées' })
  async seed() {
    const result = await this.seedService.seed();
    return successResponse(result, 'Base de données initialisée avec succès');
  }
}
