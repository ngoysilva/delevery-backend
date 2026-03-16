import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/create-address.dto';

function getUserId(req: any): string {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    throw new BadRequestException({
      errorCode: 'AUTH_REQUIRED',
      message: 'Connectez-vous pour gérer vos adresses',
    });
  }
  return userId;
}

@ApiTags('Addresses')
@Controller('api/addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  @ApiOperation({ summary: 'Ajouter une adresse' })
  async create(@Req() req: any, @Body() dto: CreateAddressDto) {
    const userId = getUserId(req);
    const address = await this.addressesService.create(userId, dto);
    return { success: true, data: address, message: 'Adresse ajoutée' };
  }

  @Get()
  @ApiOperation({ summary: 'Lister mes adresses' })
  async findAll(@Req() req: any) {
    const userId = getUserId(req);
    const addresses = await this.addressesService.findAllByUser(userId);
    return { success: true, data: addresses };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détail d\'une adresse' })
  async findOne(@Req() req: any, @Param('id') id: string) {
    const userId = getUserId(req);
    const address = await this.addressesService.findOne(id, userId);
    return { success: true, data: address };
  }

  @Put(':id')
  @ApiOperation({ summary: 'Modifier une adresse' })
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    const userId = getUserId(req);
    const address = await this.addressesService.update(id, userId, dto);
    return { success: true, data: address, message: 'Adresse modifiée' };
  }

  @Put(':id/default')
  @ApiOperation({ summary: 'Définir comme adresse par défaut' })
  async setDefault(@Req() req: any, @Param('id') id: string) {
    const userId = getUserId(req);
    const address = await this.addressesService.setDefault(id, userId);
    return { success: true, data: address, message: 'Adresse par défaut mise à jour' };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une adresse' })
  async remove(@Req() req: any, @Param('id') id: string) {
    const userId = getUserId(req);
    await this.addressesService.remove(id, userId);
    return { success: true, message: 'Adresse supprimée' };
  }
}
