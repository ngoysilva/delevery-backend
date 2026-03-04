import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ExceptionBody {
  errorCode?: string;
  message?: string | string[];
  details?: Array<{ message: string }>;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = 'INTERNAL_ERROR';
    let message = 'Erreur serveur interne';
    let details: Array<{ message: string }> | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exResponse = exception.getResponse() as ExceptionBody | string;

      if (typeof exResponse === 'object') {
        errorCode = exResponse.errorCode || this.mapStatusToCode(status);
        message =
          typeof exResponse.message === 'string'
            ? exResponse.message
            : exception.message;
        details = exResponse.details;

        if (Array.isArray(exResponse.message)) {
          details = exResponse.message.map((m: string) => ({
            message: m,
          }));
          message = 'Données invalides';
          errorCode = 'VALIDATION_ERROR';
        }
      } else {
        message = exResponse;
        errorCode = this.mapStatusToCode(status);
      }
    }

    response.status(status).json({
      success: false,
      error: {
        code: errorCode,
        message,
        ...(details && { details }),
      },
    });
  }

  private mapStatusToCode(status: number): string {
    const map: Record<number, string> = {
      400: 'VALIDATION_ERROR',
      404: 'NOT_FOUND',
      409: 'ALREADY_EXISTS',
    };
    return map[status] || 'INTERNAL_ERROR';
  }
}
