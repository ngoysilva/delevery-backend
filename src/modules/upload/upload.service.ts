import {
  Injectable,
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { extname, join } from 'path';
import { mkdir, writeFile, unlink } from 'fs/promises';
import { existsSync } from 'fs';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

type StorageMode = 'b2' | 'local';

@Injectable()
export class UploadService {
  private readonly storage: StorageMode;
  private readonly s3?: S3Client;
  private readonly bucket?: string;
  private readonly publicBaseUrl: string;
  private readonly localRoot: string;

  constructor(private config: ConfigService) {
    const appKey = this.config.get<string>('B2_APP_KEY')?.trim();
    const port = this.config.get<string>('PORT') || '5000';
    this.publicBaseUrl =
      this.config.get<string>('PUBLIC_BASE_URL')?.replace(/\/$/, '') ||
      `http://localhost:${port}`;
    this.localRoot = join(process.cwd(), 'uploads');

    if (appKey) {
      this.storage = 'b2';
      this.bucket = this.config.getOrThrow('B2_BUCKET_NAME');
      const region = this.config.getOrThrow('B2_REGION');
      const endpoint = this.config.getOrThrow('B2_ENDPOINT');

      this.s3 = new S3Client({
        region,
        endpoint,
        credentials: {
          accessKeyId: this.config.getOrThrow('B2_KEY_ID'),
          secretAccessKey: appKey,
        },
        forcePathStyle: true,
      });
      console.log('[Upload] Stockage Backblaze B2 activé');
    } else {
      this.storage = 'local';
      if (!existsSync(this.localRoot)) {
        void mkdir(this.localRoot, { recursive: true });
      }
      console.warn(
        '[Upload] B2_APP_KEY manquant — fichiers enregistrés localement dans ./uploads',
      );
    }
  }

  async upload(
    file: Express.Multer.File,
    folder = 'general',
  ): Promise<{ url: string; key: string }> {
    this.validateFile(file);

    const ext = extname(file.originalname).toLowerCase();
    const key = `${folder}/${randomUUID()}${ext}`;

    if (this.storage === 'b2') {
      return this.uploadToB2(file, key);
    }
    return this.uploadLocally(file, key);
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    folder = 'general',
  ): Promise<{ url: string; key: string }[]> {
    return Promise.all(files.map((file) => this.upload(file, folder)));
  }

  async delete(key: string): Promise<void> {
    if (this.storage === 'b2') {
      await this.deleteFromB2(key);
      return;
    }
    await this.deleteLocally(key);
  }

  private async uploadToB2(
    file: Express.Multer.File,
    key: string,
  ): Promise<{ url: string; key: string }> {
    const endpoint = this.config.getOrThrow('B2_ENDPOINT').replace(/\/$/, '');

    try {
      await this.s3!.send(
        new PutObjectCommand({
          Bucket: this.bucket!,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );
    } catch (error) {
      this.handleB2Error(error);
    }

    return {
      url: `${endpoint}/${this.bucket}/${key}`,
      key,
    };
  }

  private async uploadLocally(
    file: Express.Multer.File,
    key: string,
  ): Promise<{ url: string; key: string }> {
    const filePath = join(this.localRoot, key);
    await mkdir(join(this.localRoot, key.split('/').slice(0, -1).join('/')), {
      recursive: true,
    });
    await writeFile(filePath, file.buffer);

    return {
      url: `${this.publicBaseUrl}/uploads/${key}`,
      key,
    };
  }

  private async deleteFromB2(key: string): Promise<void> {
    try {
      await this.s3!.send(
        new DeleteObjectCommand({
          Bucket: this.bucket!,
          Key: key,
        }),
      );
    } catch (error) {
      this.handleB2Error(error);
    }
  }

  private async deleteLocally(key: string): Promise<void> {
    const filePath = join(this.localRoot, key);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }
  }

  private handleB2Error(error: unknown): never {
    const message =
      error instanceof Error ? error.message : 'Erreur Backblaze B2';
    const code =
      error && typeof error === 'object' && 'Code' in error
        ? String((error as { Code: string }).Code)
        : '';

    if (code === 'InvalidAccessKeyId' || code === 'SignatureDoesNotMatch') {
      throw new ServiceUnavailableException(
        'Clés Backblaze B2 invalides. Vérifiez B2_KEY_ID et B2_APP_KEY dans .env',
      );
    }

    throw new ServiceUnavailableException(
      `Échec de l'upload Backblaze B2 : ${message}`,
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
