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
  public constructor(private readonly contactService: ContactService) {}

  @Get()
  public findAll() {
    return this.contactService.findAll();
  }

  @Get(':id')
  public findOne(@Param('id') id: string) {
    return this.contactService.findOne(id);
  }

  @Post()
  public create(@Body() contact: Contact) {
    return this.contactService.create(contact);
  }

  @Put(':id')
  public update(@Param('id') id: string, @Body() contact: Contact) {
    return this.contactService.update(id, contact);
  }

  @Delete(':id')
  public remove(@Param('id') id: string) {
    return this.contactService.remove(id);
  }
}
