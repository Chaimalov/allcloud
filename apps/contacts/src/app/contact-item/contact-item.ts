import { Contact } from '@allcloud/contacts';
import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.html',
  styleUrls: ['./contact-item.css'],
  imports: [NgOptimizedImage, RouterLink],
})
export class ContactItemComponent {
  public contact = input.required<Contact>();
}
