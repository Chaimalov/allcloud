import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  inject,
  input,
  linkedSignal,
  resource,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  ArrowLeft,
  Check,
  LucideAngularModule,
  UserRoundPen,
} from 'lucide-angular';
import { firstValueFrom } from 'rxjs';
import { ContactsApi } from '../api';

@Component({
  selector: 'app-contact-details-page',
  templateUrl: './contact-details-page.html',
  styleUrls: ['./contact-details-page.css'],
  imports: [FormsModule, NgOptimizedImage, LucideAngularModule, RouterLink],
})
export class ContactDetailsPageComponent {
  public api = inject(ContactsApi);
  public id = input.required<number>();

  protected UserRoundPen = UserRoundPen;
  protected Check = Check;
  protected ArrowLeft = ArrowLeft;

  protected isEditing = signal(false);

  protected contact = resource({
    params: this.id,
    loader: ({ params }) => firstValueFrom(this.api.getContact(params)),
  });

  protected title = linkedSignal(() => this.contact.value()?.name.title);
  protected firstName = linkedSignal(() => this.contact.value()?.name.first);
  protected lastName = linkedSignal(() => this.contact.value()?.name.last);
  protected email = linkedSignal(() => this.contact.value()?.email);
  protected cell = linkedSignal(() => this.contact.value()?.cell);
  protected phone = linkedSignal(() => this.contact.value()?.phone);

  protected city = linkedSignal(() => this.contact.value()?.location.city);
  protected country = linkedSignal(
    () => this.contact.value()?.location.country
  );
  protected postcode = linkedSignal(
    () => this.contact.value()?.location.postcode
  );
  protected state = linkedSignal(() => this.contact.value()?.location.state);
  protected streetName = linkedSignal(
    () => this.contact.value()?.location.street.name
  );
  protected house = linkedSignal(
    () => this.contact.value()?.location.street.number
  );
}
