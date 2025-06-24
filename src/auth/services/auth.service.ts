import { BadRequestException, Injectable } from "@nestjs/common";
import { User } from "src/users/entities/user.entity";
import { UsersService } from "src/users/users.service";
import * as bcrypt from "bcrypt";
import { RegisterUserDto } from "../dto/RegisterUser.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException("Incorrect Password");
    }
    return user;
  }

  // login(user: User): Promise<{ user: User; access_token: string }> {
  //   const payload = {
  //     email: user.email,
  //     id: user.id,
  //     role: user.role,
  //   };
  //   const access_token = this.jwtService.sign(payload);
  //   return {
  //     user: user,
  //     access_token: access_token,
  //   };
  // }

  login(user: User): { user: User; access_token: string } {
    const payload = {
      email: user.email,
      id: user.id,
      role: user.role,
    };
    const access_token = this.jwtService.sign(payload);
    return {
      user: user,
      access_token: access_token,
    };
  }

  async register(
    registerUserDto: RegisterUserDto,
  ): Promise<{ user: User; access_token: string }> {
    const existingUser = await this.usersService.findOneByEmail(
      registerUserDto.email,
    );
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(registerUserDto.password, salt);
    const newUser: User = {
      ...registerUserDto,
      password: hashedPassword,
    } as User;
    await this.usersService.create(newUser);
    return this.login(newUser);
  }
}
