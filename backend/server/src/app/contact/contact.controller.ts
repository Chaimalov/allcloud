import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Contact } from './contact.entity';
import { ContactService } from './contact.service';

@Controller('contacts')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Get()
  findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.contactService.findOne(id);
  }

  @Post()
  create(@Body() contact: Contact) {
    console.log(contact);
    return this.contactService.create(contact);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() contact: Contact) {
    return this.contactService.update(id, contact);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.contactService.remove(id);
  }
}
