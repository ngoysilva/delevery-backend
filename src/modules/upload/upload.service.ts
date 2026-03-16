import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname } from 'path';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

@Injectable()
export class UploadService {
  private readonly s3: S3Client;
  private readonly bucket: string;
  private readonly publicBaseUrl: string;

  constructor(private config: ConfigService) {
    this.bucket = this.config.getOrThrow('B2_BUCKET_NAME');
    const region = this.config.getOrThrow('B2_REGION');
    const endpoint = this.config.getOrThrow('B2_ENDPOINT');

    this.s3 = new S3Client({
      region,
      endpoint,
      credentials: {
        accessKeyId: this.config.getOrThrow('B2_KEY_ID'),
        secretAccessKey: this.config.getOrThrow('B2_APP_KEY'),
      },
      forcePathStyle: true,
    });

    this.publicBaseUrl = `${endpoint}/${this.bucket}`;
  }

  async upload(
    file: Express.Multer.File,
    folder = 'general',
  ): Promise<{ url: string; key: string }> {
    this.validateFile(file);

    const ext = extname(file.originalname).toLowerCase();
    const key = `${folder}/${randomUUID()}${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    return {
      url: `${this.publicBaseUrl}/${key}`,
      key,
    };
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder = 'general',
  ): Promise<{ url: string; key: string }[]> {
    return Promise.all(files.map((file) => this.upload(file, folder)));
  }

  async delete(key: string): Promise<void> {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key,
      }),
    );
  }

  private validateFile(file: Express.Multer.File) {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException(
        `Type de fichier non supporté. Types acceptés : JPEG, PNG, WebP, GIF`,
      );
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException(
        `Fichier trop volumineux. Taille max : 5 MB`,
      );
    }
  }
}
