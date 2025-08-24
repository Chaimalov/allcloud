import { Entity, Column, PrimaryColumn } from 'typeorm';
import { Contact as ContactSchema } from '@allcloud/contacts';

@Entity()
export class Contact implements ContactSchema {
  @PrimaryColumn('uuid')
  public id: string;

  @Column('simple-json', { nullable: true })
  public name: {
    title: string;
    first: string;
    last: string;
  };

  @Column('simple-json', { nullable: true })
  public location: {
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
  public email: string;

  @Column()
  public registrationDate: Date;

  @Column({ nullable: true })
  public phone: string;

  @Column({ nullable: true })
  public cell: string;

  @Column({ nullable: true })
  public age: number;

  @Column('simple-json', { nullable: true })
  public picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}
