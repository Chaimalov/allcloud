import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(Contact)
    private readonly contactRepository: Repository<Contact>
  ) {}

  async findAll(): Promise<Contact[]> {
    return this.contactRepository.find();
  }

  async findOne(id: number): Promise<Contact | null> {
    return this.contactRepository.findOne({ where: { id } });
  }

  async create(contact: Contact): Promise<Contact> {
    return this.contactRepository.save(this.contactRepository.create(contact));
  }

  async update(id: number, contact: Contact): Promise<Contact> {
    const existingContact = await this.contactRepository.findOne({
      where: { id },
    });
    if (!existingContact) {
      throw new Error(`Contact with ID ${id} not found`);
    }
    return this.contactRepository.save({ ...existingContact, ...contact });
  }

  async remove(id: number): Promise<void> {
    await this.contactRepository.delete(id);
  }
}
