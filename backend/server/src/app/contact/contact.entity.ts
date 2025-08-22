import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Contact as ContactSchema } from '@allcloud/contacts';

@Entity()
export class Contact implements ContactSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-json', { nullable: true })
  name: {
    title: string;
    first: string;
    last: string;
  };

  @Column('simple-json', { nullable: true })
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number;
  };

  @Column({ nullable: true })
  email: string;

  @Column()
  registrationDate: Date;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  cell: string;

  @Column('simple-json', { nullable: true })
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}
