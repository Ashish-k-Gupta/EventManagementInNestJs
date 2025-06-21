import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { UserRoles } from "../../common/enums/userRole.enum";
import { BaseEntity } from "../../common/entities/base.entity";
import { Event } from "../../common/entities/event.entity";

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({
    nullable: false,
    length: 100,
    select: false,
  })
  password: string;

  @Column({
    type: "enum",
    enum: UserRoles,
    default: UserRoles.ATTENDEE,
    nullable: false,
  })
  role: UserRoles;

  @Column({
    type: "boolean",
    default: true,
  })
  isActive: boolean;

  @Column({ type: "boolean", default: false })
  isAdmin: boolean;

  private _tempPassword?: string;

  @OneToMany(() => Event, (event) => event.createdBy)
  createdEntities: Event[];

  @OneToMany(() => Event, (event) => event.updatedBy)
  updatedEntities: Event[];

  @OneToMany(() => Event, (event) => event.deletedBy)
  deletedEntities: Event[];

  public setPassword(newPassword: string): void {
    if (newPassword) {
      this._tempPassword = newPassword;
    }
  }

  @BeforeInsert()
  async hashPasswordOnInsert(): Promise<void> {
    if (this._tempPassword) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this._tempPassword, salt);
      this._tempPassword = undefined;
    }
  }

  @BeforeUpdate()
  async updatePassword(): Promise<void> {
    if (this._tempPassword) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this._tempPassword, salt);
      this._tempPassword = undefined;
    }
  }

  async comparePassword(inputPassword: string): Promise<boolean> {
    if (!this.password) {
      return false;
    }
    return bcrypt.compare(inputPassword, this.password);
  }
}
