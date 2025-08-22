import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  inject,
  input,
  linkedSignal,
  resource,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  Check,
  CornerUpLeft,
  LucideAngularModule,
  Trash,
  UserRound,
  UserRoundPen,
} from 'lucide-angular';
import { ContactsApi } from '../api';
import { Contact, NewContact } from '@allcloud/contacts';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-contact-details-page',
  templateUrl: './contact-details-page.html',
  styleUrls: ['./contact-details-page.css'],
  imports: [FormsModule, NgOptimizedImage, LucideAngularModule, RouterLink],
})
export class ContactDetailsPageComponent {
  public api = inject(ContactsApi);
  public router = inject(Router);
  public id = input<number>();

  protected UserRound = UserRound;
  protected UserRoundPen = UserRoundPen;
  protected Check = Check;
  protected ArrowLeft = CornerUpLeft;
  protected Trash = Trash;

  protected isEditing = linkedSignal(() => this.id() === undefined);

  protected contact = resource({
    params: this.id,
    loader: ({ params }) => this.api.getContact(params),
  });

  protected title = linkedSignal(() => this.contact.value()?.name?.title);
  protected firstName = linkedSignal(() => this.contact.value()?.name?.first);
  protected lastName = linkedSignal(() => this.contact.value()?.name?.last);
  protected email = linkedSignal(() => this.contact.value()?.email);
  protected cell = linkedSignal(() => this.contact.value()?.cell);
  protected phone = linkedSignal(() => this.contact.value()?.phone);

  protected city = linkedSignal(() => this.contact.value()?.location?.city);
  protected country = linkedSignal(
    () => this.contact.value()?.location?.country
  );
  protected postcode = linkedSignal(
    () => this.contact.value()?.location?.postcode
  );
  protected state = linkedSignal(() => this.contact.value()?.location?.state);
  protected streetName = linkedSignal(
    () => this.contact.value()?.location?.street?.name
  );
  protected house = linkedSignal(
    () => this.contact.value()?.location?.street?.number
  );

  protected save(): void {
    const contact = {
      id: this.contact.value()?.id,
      name: {
        title: this.title(),
        first: this.firstName(),
        last: this.lastName(),
      },
      email: this.email(),
      cell: this.cell(),
      phone: this.phone(),
      location: {
        city: this.city(),
        country: this.country(),
        postcode: this.postcode(),
        state: this.state(),
        street: {
          name: this.streetName(),
          number: this.house(),
        },
      },
    } satisfies Contact | NewContact;

    firstValueFrom(this.api.saveContact(contact));
  }
}
