import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {
  public constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>,
  ) {}

  public async findAll(): Promise<Contact[]> {
    return this.contactRepository.find();
  }

  public async findOne(id: string): Promise<Contact | null> {
    return this.contactRepository.findOne({ where: { id } });
  }

  public async create(contact: Contact): Promise<Contact> {
    return this.contactRepository.save(
      this.contactRepository.create({
        ...contact,
        registrationDate: new Date(),
      }),
    );
  }

  public async update(id: string, contact: Contact): Promise<Contact> {
    const existingContact = await this.contactRepository.findOne({
      where: { id },
    });
    if (!existingContact) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    return this.contactRepository.save({ ...existingContact, ...contact });
  }

  public async remove(id: string): Promise<void> {
    await this.contactRepository.delete(id);
  }
}
