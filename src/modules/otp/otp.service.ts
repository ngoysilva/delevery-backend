import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from '../../schemas/otp.schema';

const OTP_EXPIRY_MINUTES = 5;
const OTP_COOLDOWN_SECONDS = 60;

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
  ) {}

  async send(phoneNumber: string): Promise<{ message: string; expiresIn: number; code?: string }> {
    const recent = await this.otpModel
      .findOne({ phoneNumber, verified: false, createdAt: { $gte: new Date(Date.now() - OTP_COOLDOWN_SECONDS * 1000) } })
      .exec();

    if (recent) {
      throw new BadRequestException({
        errorCode: 'OTP_COOLDOWN',
        message: `Veuillez patienter avant de demander un nouveau code`,
      });
    }

    await this.otpModel.deleteMany({ phoneNumber }).exec();

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.otpModel.create({ phoneNumber, code, expiresAt });

    // TODO: Intégrer un service SMS réel (Twilio, Vonage, etc.)
    // await smsProvider.send(phoneNumber, `Votre code FoodDash : ${code}`);

    const result: { message: string; expiresIn: number; code?: string } = {
      message: 'Code OTP envoyé avec succès',
      expiresIn: OTP_EXPIRY_MINUTES * 60,
    };

    if (process.env.NODE_ENV !== 'production') {
      result.code = code;
    }

    return result;
  }

  async verify(phoneNumber: string, code: string): Promise<{ verified: boolean }> {
    const otp = await this.otpModel
      .findOne({ phoneNumber, code, verified: false, expiresAt: { $gt: new Date() } })
      .exec();

    if (!otp) {
      throw new BadRequestException({
        errorCode: 'INVALID_OTP',
        message: 'Code OTP invalide ou expiré',
      });
    }

    otp.verified = true;
    await otp.save();

    return { verified: true };
  }

  async isVerified(phoneNumber: string): Promise<boolean> {
    const otp = await this.otpModel
      .findOne({ phoneNumber, verified: true, expiresAt: { $gt: new Date() } })
      .exec();
    return !!otp;
  }
}
