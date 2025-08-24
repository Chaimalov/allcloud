import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  CloudAlert,
  LucideAngularModule,
  User,
  UserRound,
} from 'lucide-angular';
import { Contact } from '../abort-subject';

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.html',
  styleUrls: ['./contact-item.css'],
  imports: [NgOptimizedImage, RouterLink, LucideAngularModule],
})
export class ContactItemComponent {
  public contact = input.required<Contact>();

  protected icons = {
    UserRound,
    CloudAlert,
  };
}
