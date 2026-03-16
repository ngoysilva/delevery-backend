import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas/user.schema';
import { CreateLivreurDto, UpdateLivreurDto } from './dto/create-livreur.dto';
import { buildPagination } from '../../common/pagination.dto';

@Injectable()
export class LivreursService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateLivreurDto) {
    const existing = await this.userModel.findOne({ phone: dto.phone }).exec();
    if (existing) {
      if (existing.role === 'delivery') {
        throw new ConflictException({
          errorCode: 'PHONE_EXISTS',
          message: 'Un livreur avec ce numéro existe déjà.',
        });
      }
      existing.role = 'delivery';
      if (dto.name) existing.name = dto.name;
      if (dto.avatar !== undefined) existing.avatar = dto.avatar;
      if (dto.address !== undefined) existing.address = dto.address;
      if (dto.vehicleType !== undefined) existing.vehicleType = dto.vehicleType;
      if (dto.cin !== undefined) existing.cin = dto.cin;
      if (dto.notes !== undefined) existing.notes = dto.notes;
      if (dto.isActive !== undefined) existing.isActive = dto.isActive;
      return existing.save();
    }

    return this.userModel.create({
      name: dto.name,
      phone: dto.phone,
      email: dto.phone,
      avatar: dto.avatar || undefined,
      role: 'delivery',
      address: dto.address,
      vehicleType: dto.vehicleType,
      cin: dto.cin,
      notes: dto.notes,
      isActive: dto.isActive !== false,
    });
  }

  async findAll(page = 1, limit = 50) {
    const filter = { role: 'delivery' };
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.userModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.userModel.countDocuments(filter).exec(),
    ]);

    return { data, pagination: buildPagination(page, limit, total) };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user || user.role !== 'delivery') {
      throw new NotFoundException({
        errorCode: 'NOT_FOUND',
        message: 'Livreur introuvable',
      });
    }
    return user;
  }

  async update(id: string, dto: UpdateLivreurDto) {
    const livreur = await this.findOne(id);

    if (dto.phone && dto.phone !== livreur.phone) {
      const existing = await this.userModel
        .findOne({ phone: dto.phone, _id: { $ne: id } })
        .exec();
      if (existing) {
        throw new ConflictException({
          errorCode: 'PHONE_EXISTS',
          message: 'Ce numéro est déjà utilisé.',
        });
      }
    }

    if (dto.name !== undefined) livreur.name = dto.name;
    if (dto.phone) {
      livreur.phone = dto.phone;
      livreur.email = dto.phone;
    }
    if (dto.avatar !== undefined) livreur.avatar = dto.avatar;
    if (dto.address !== undefined) livreur.address = dto.address;
    if (dto.vehicleType !== undefined) livreur.vehicleType = dto.vehicleType;
    if (dto.cin !== undefined) livreur.cin = dto.cin;
    if (dto.notes !== undefined) livreur.notes = dto.notes;
    if (dto.isActive !== undefined) livreur.isActive = dto.isActive;

    return livreur.save();
  }

  async remove(id: string) {
    const livreur = await this.findOne(id);
    await livreur.deleteOne();
    return { deleted: true };
  }
}
