import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  cell: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postcode: string;

  @Column()
  country: string;

  @Column()
  pictureLarge: string;

  @Column()
  pictureMedium: string;

  @Column()
  pictureThumbnail: string;

  @Column()
  registrationDate: Date;
}
