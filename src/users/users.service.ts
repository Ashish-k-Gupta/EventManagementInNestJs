import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email.toLowerCase() },
    });
    if (existingUser) {
      throw new ConflictException("Email already taken");
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email.toLowerCase(),
      password: hashPassword,
      role: createUserDto.role,
    });
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  async findOneByEmail(email: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email: email.toLowerCase() },
    });
    if (!existingUser) {
      throw new NotFoundException("Email does not exist");
    }
    return existingUser;
  }

  async findOneById(id: string): Promise<User | null> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new UnauthorizedException("User not found on invalid token");
    }
    return existingUser;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | undefined> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: [
        "id",
        "firstName",
        "lastName",
        "email",
        "role",
        "isActive",
        "isAdmin",
      ],
    });
    if (!user) {
      throw new UnauthorizedException("User does not exists or invalid token");
    }
    const update = Object.fromEntries(
      Object.entries(updateUserDto).filter(([, value]) => value !== undefined),
    );
    Object.assign(user, update);
    console.log("Userrrrrrrrrrrrrrrrrrr", user);
    console.log("mustrrrrrrrrrrrrrr", updateUserDto);
    await this.userRepository.save(user);
    return user;
  }

  async remove(id: string) {
    const userToRemove = await this.userRepository.findOne({
      where: { id },
    });
    if (!userToRemove) {
      throw new UnauthorizedException("User does not exists");
    }
    userToRemove.isActive = false;
    return await this.userRepository.softRemove(userToRemove);
  }
}
