import { UserRoles } from "../../common/enums/userRole.enum";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { User } from "../../users/entities/user.entity";
dotenv.config();

export default class InitialAdminSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "Admin email and password must be defined in environment variables",
      );
    }

    const existingAdmin = await userRepository.findOneBy({ email: adminEmail });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(adminPassword, salt);

      const adminUser = userRepository.create({
        email: adminEmail,
        password: passwordHash,
        role: UserRoles.ORGANIZER,
        firstName: process.env.ADMIN_FIRSTNAME,
        lastName: process.env.ADMIN_LASTNAME,
        isActive: true,
        isAdmin: true,
      });
      await userRepository.save(adminUser);
      console.log(`Super Admin user ${adminEmail} created`);
    } else {
      console.log(`Super Admin user ${adminEmail} already exists`);
    }
  }
}
