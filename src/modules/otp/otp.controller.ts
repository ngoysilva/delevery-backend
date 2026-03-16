import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { OtpService } from './otp.service';
import { SendOtpDto, VerifyOtpDto } from './dto/otp.dto';
import { successResponse } from '../../common/api-response.helper';

@ApiTags('OTP')
@Controller('api/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('send')
  @HttpCode(200)
  @ApiOperation({ summary: 'Envoyer un code OTP par SMS' })
  @ApiResponse({ status: 200, description: 'Code envoyé' })
  @ApiResponse({ status: 400, description: 'Cooldown actif ou numéro invalide' })
  async send(@Body() dto: SendOtpDto) {
    const result = await this.otpService.send(dto.phoneNumber);
    return successResponse(result, result.message);
  }

  @Post('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Vérifier un code OTP' })
  @ApiResponse({ status: 200, description: 'Code vérifié' })
  @ApiResponse({ status: 400, description: 'Code invalide ou expiré' })
  async verify(@Body() dto: VerifyOtpDto) {
    const result = await this.otpService.verify(dto.phoneNumber, dto.code);
    return successResponse(result, 'Numéro vérifié avec succès');
  }
}
