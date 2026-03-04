import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FoodsService } from './foods.service';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { QueryFoodsDto } from './dto/query-foods.dto';
import {
  successResponse,
  paginatedResponse,
} from '../../common/api-response.helper';

@ApiTags('Foods')
@Controller('api/foods')
export class FoodsController {
  constructor(private readonly foodsService: FoodsService) {}

  @Get()
  @ApiOperation({
    summary: 'Liste de tous les plats (filtrable par catégorie et type)',
  })
  @ApiResponse({ status: 200, description: 'Liste des plats' })
  async findAll(@Query() query: QueryFoodsDto) {
    const result = await this.foodsService.findAll(
      query.page,
      query.limit,
      query.categoryId,
      query.type,
    );
    return paginatedResponse(result.data, result.pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'un plat" })
  @ApiResponse({ status: 200, description: 'Plat trouvé' })
  @ApiResponse({ status: 404, description: 'Plat introuvable' })
  async findOne(@Param('id') id: string) {
    const food = await this.foodsService.findOne(id);
    if (!food) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `Le plat avec l'id ${id} n'existe pas`,
      });
    }
    return successResponse(food);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer un plat' })
  @ApiResponse({ status: 201, description: 'Plat créé' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() dto: CreateFoodDto) {
    const food = await this.foodsService.create(dto);
    return successResponse(food, 'Plat créé avec succès');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier un plat' })
  @ApiResponse({ status: 200, description: 'Plat mis à jour' })
  @ApiResponse({ status: 404, description: 'Plat introuvable' })
  async update(@Param('id') id: string, @Body() dto: UpdateFoodDto) {
    const food = await this.foodsService.update(id, dto);
    return successResponse(food, 'Plat mis à jour');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un plat' })
  @ApiResponse({ status: 200, description: 'Plat supprimé' })
  @ApiResponse({ status: 404, description: 'Plat introuvable' })
  async remove(@Param('id') id: string) {
    await this.foodsService.remove(id);
    return successResponse(null, 'Plat supprimé');
  }
}
