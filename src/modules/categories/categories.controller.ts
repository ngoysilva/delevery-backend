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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PaginationQueryDto } from '../../common/pagination.dto';
import {
  successResponse,
  paginatedResponse,
} from '../../common/api-response.helper';

@ApiTags('Categories')
@Controller('api/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: 'Liste de toutes les catégories' })
  @ApiResponse({ status: 200, description: 'Liste des catégories' })
  async findAll(@Query() query: PaginationQueryDto) {
    const result = await this.categoriesService.findAll(
      query.page,
      query.limit,
    );
    return paginatedResponse(result.data, result.pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: "Détail d'une catégorie" })
  @ApiResponse({ status: 200, description: 'Catégorie trouvée' })
  @ApiResponse({ status: 404, description: 'Catégorie introuvable' })
  async findOne(@Param('id') id: string) {
    const category = await this.categoriesService.findOne(id);
    if (!category) {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: `La catégorie avec l'id ${id} n'existe pas`,
      });
    }
    return successResponse(category);
  }

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer une catégorie' })
  @ApiResponse({ status: 201, description: 'Catégorie créée' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  async create(@Body() dto: CreateCategoryDto) {
    const category = await this.categoriesService.create(dto);
    return successResponse(category, 'Catégorie créée avec succès');
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une catégorie' })
  @ApiResponse({ status: 200, description: 'Catégorie mise à jour' })
  @ApiResponse({ status: 404, description: 'Catégorie introuvable' })
  async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const category = await this.categoriesService.update(id, dto);
    return successResponse(category, 'Catégorie mise à jour');
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  @ApiResponse({ status: 200, description: 'Catégorie supprimée' })
  @ApiResponse({ status: 404, description: 'Catégorie introuvable' })
  async remove(@Param('id') id: string) {
    await this.categoriesService.remove(id);
    return successResponse(null, 'Catégorie supprimée');
  }
}
