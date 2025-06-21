import { User } from "src/users/entities/user.entity";
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { BaseEntity } from "./base.entity";
import { EventStatus } from "../enums/eventStatus.enum";
import { Category } from "src/categories/entities/category.entity";

@Entity()
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  category: string;

  @Column()
  maximum_Attendees: number;

  @Column({
    type: "enum",
    enum: EventStatus,
    default: EventStatus.UPCOMING,
  })
  status: EventStatus;

  @Column({ unique: true, nullable: false })
  slug: string;

  @ManyToMany(() => Category, (category) => category.events)
  @JoinTable({
    name: "event_categories",
    joinColumn: {
      name: "eventId",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "categoryId",
      referencedColumnName: "id",
    },
  })
  categories: Category[];

  @ManyToOne(() => User, (user) => user.createdEntities, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "createdById" })
  createdBy: User;

  @ManyToOne(() => User, (user) => user.updatedEntities, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "updatedById" })
  updatedBy: User;

  @ManyToOne(() => User, (user) => user.deletedEntities, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "deletedById" })
  deletedBy: User;
}
