import { Controller, Post, Get, Body, HttpCode, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto, VerifyAuthDto, LoginDto } from './dto/auth.dto';
import { successResponse } from '../../common/api-response.helper';

@ApiTags('Auth')
@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer un compte' })
  @ApiResponse({ status: 201, description: 'Compte créé, OTP envoyé' })
  @ApiResponse({ status: 400, description: 'Numéro déjà enregistré' })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto.name, dto.phone);
    return successResponse(result, result.message);
  }

  @Post('login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Se connecter (envoie OTP)' })
  @ApiResponse({ status: 200, description: 'OTP envoyé' })
  @ApiResponse({ status: 404, description: 'Compte introuvable' })
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto.phone);
    return successResponse(result, result.message);
  }

  @Post('verify')
  @HttpCode(200)
  @ApiOperation({ summary: 'Vérifier OTP et obtenir le token' })
  @ApiResponse({ status: 200, description: 'Authentification réussie' })
  @ApiResponse({ status: 400, description: 'Code invalide' })
  async verify(@Body() dto: VerifyAuthDto) {
    const result = await this.authService.verifyAndAuthenticate(
      dto.phone,
      dto.code,
    );
    return successResponse(result, 'Connexion réussie');
  }

  @Get('me')
  @ApiOperation({ summary: 'Profil utilisateur' })
  @ApiResponse({ status: 200, description: 'Profil' })
  async getProfile(@Req() req: any) {
    const userId = req.headers['x-user-id'];
    if (!userId) {
      return successResponse(null, 'Non connecté');
    }
    const profile = await this.authService.getProfile(userId);
    return successResponse(profile);
  }
}
