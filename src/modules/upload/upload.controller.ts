import {
  Controller,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { successResponse } from '../../common/api-response.helper';

@ApiTags('Upload')
@Controller('api/upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiOperation({ summary: 'Upload une image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Image uploadée' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    if (!file) {
      throw new BadRequestException('Aucun fichier fourni. Utilisez le champ "file".');
    }
    const result = await this.uploadService.upload(file, folder || 'general');
    return successResponse(result, 'Image uploadée avec succès');
  }

  @Post('multiple')
  @ApiOperation({ summary: 'Upload plusieurs images (max 5)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Images uploadées' })
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadFiles(
    @UploadedFiles() files: Express.Multer.File[],
    @Query('folder') folder?: string,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Aucun fichier fourni. Utilisez le champ "files".');
    }
    const results = await this.uploadService.uploadMultiple(
      files,
      folder || 'general',
    );
    return successResponse(results, 'Images uploadées avec succès');
  }

  @Delete()
  @ApiOperation({ summary: 'Supprimer une image par sa clé' })
  @ApiResponse({ status: 200, description: 'Image supprimée' })
  async deleteFile(@Query('key') key: string) {
    await this.uploadService.delete(key);
    return successResponse(null, 'Image supprimée');
  }
}
