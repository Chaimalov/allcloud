import { Contact } from '@allcloud/contacts';
import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, UserRound } from 'lucide-angular';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.html',
  styleUrls: ['./contact-item.css'],
  imports: [NgOptimizedImage, RouterLink, LucideAngularModule],
})
export class ContactItemComponent {
  public contact = input.required<Contact>();
  protected UserRound = UserRound;
}
