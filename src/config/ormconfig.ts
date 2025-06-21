import { User } from "../users/entities/user.entity";
import InitialAdminSeeder from "../database/seeds/initial-admin.seed";
import { DataSource, DataSourceOptions } from "typeorm";
import { SeederOptions } from "typeorm-extension";
import * as dotenv from "dotenv";
import { BaseEntity } from "../common/entities/base.entity";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: ["error"],
  entities: [User, BaseEntity],
  migrations: ["src/database/migration/*.ts"],
  seeds: [InitialAdminSeeder],
} as DataSourceOptions & SeederOptions);
