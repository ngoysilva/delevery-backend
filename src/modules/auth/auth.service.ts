import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private otpService: OtpService,
  ) {}

  async register(name: string, phone: string) {
    const existing = await this.userModel.findOne({ phone }).exec();
    if (existing) {
      throw new BadRequestException({
        errorCode: 'PHONE_EXISTS',
        message: 'Ce numéro est déjà enregistré. Connectez-vous.',
      });
    }

    const user = await this.userModel.create({ name, phone, email: phone });
    const otpResult = await this.otpService.send(phone);

    return {
      userId: user._id,
      message: 'Compte créé. Vérifiez votre numéro avec le code OTP.',
      ...(otpResult.code ? { code: otpResult.code } : {}),
    };
  }

  async login(phone: string) {
    const user = await this.userModel.findOne({ phone }).exec();
    if (!user) {
      throw new NotFoundException({
        errorCode: 'USER_NOT_FOUND',
        message: 'Aucun compte trouvé avec ce numéro.',
      });
    }

    const otpResult = await this.otpService.send(phone);

    return {
      userId: user._id,
      message: 'Code OTP envoyé.',
      ...(otpResult.code ? { code: otpResult.code } : {}),
    };
  }

  async verifyAndAuthenticate(phone: string, code: string) {
    await this.otpService.verify(phone, code);

    const user = await this.userModel.findOne({ phone }).exec();
    if (!user) {
      throw new NotFoundException({
        errorCode: 'USER_NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    }

    const token = this.jwtService.sign({
      sub: user._id.toString(),
      phone: user.phone,
    });

    return {
      token,
      user: {
        _id: user._id,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException({
        errorCode: 'USER_NOT_FOUND',
        message: 'Utilisateur introuvable.',
      });
    }
    return {
      _id: user._id,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
    };
  }
}
