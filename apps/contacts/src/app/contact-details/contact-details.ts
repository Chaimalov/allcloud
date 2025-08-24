import { Contact, NewContact } from '@allcloud/contacts';
import { NgOptimizedImage } from '@angular/common';
import {
  Component,
  computed,
  inject,
  input,
  linkedSignal,
  resource,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  ArrowLeft,
  Check,
  CornerUpLeft,
  LucideAngularModule,
  Trash,
  UserRound,
  UserRoundPen,
} from 'lucide-angular';
import {
  createFormField,
  createFormGroup,
  SIGNAL_INPUT_ERROR_COMPONENT,
  SignalInputDirective,
  SignalInputErrorDirective,
  Validators,
} from 'ng-signal-forms';
import { firstValueFrom } from 'rxjs';
import { ContactsApi } from '../api/api';
import { FieldErrorComponent } from './field-error/field-error';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.html',
  styleUrls: ['./contact-details.css'],
  providers: [
    {
      provide: SIGNAL_INPUT_ERROR_COMPONENT,
      useValue: FieldErrorComponent,
    },
  ],
  imports: [
    FormsModule,
    NgOptimizedImage,
    LucideAngularModule,
    RouterLink,
    SignalInputDirective,
    SignalInputErrorDirective,
  ],
})
export class ContactDetailsComponent {
  public api = inject(ContactsApi);
  public router = inject(Router);

  public id = input<string>();

  protected icons = {
    UserRound,
    UserRoundPen,
    Check,
    CornerUpLeft,
    Trash,
    ArrowLeft,
  };

  protected isEditing = linkedSignal(() => this.id() === undefined);

  protected contact = resource({
    params: this.id,
    loader: ({ params }) => this.api.getContact(params),
  });

  protected form = createFormGroup(() => {
    const readOnly = computed(() => !this.isEditing());
    const contact = this.contact.value;

    return {
      name: createFormGroup({
        title: createFormField(
          linkedSignal(() => contact()?.name?.title),
          { readOnly },
        ),
        first: createFormField(
          linkedSignal(() => contact()?.name?.first),
          {
            readOnly,
            validators: [
              {
                validator: Validators.minLength(2),
                message: 'Requires t least 2 characters',
              },
            ],
          },
        ),
        last: createFormField(
          linkedSignal(() => contact()?.name?.last),
          { readOnly },
        ),
      }),
      age: createFormField(
        linkedSignal(() => contact()?.age),
        {
          readOnly,
        },
      ),
      email: createFormField(
        linkedSignal(() => contact()?.email),
        {
          readOnly,
          validators: [
            {
              validator: Validators.pattern(
                /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              ),
              message: 'Invalid email',
            },
          ],
        },
      ),
      phone: createFormField(
        linkedSignal(() => contact()?.phone),
        {
          validators: [
            {
              validator: Validators.pattern(
                /^\(?(\d{2})\)?[-\s.]?(\d{3})[-\s.]?(\d{4})$/,
              ),
              message: 'Invalid phone number. Format: 12-345-6789',
            },
          ],
          readOnly,
        },
      ),
      cell: createFormField(
        linkedSignal(() => contact()?.cell),
        {
          validators: [
            {
              validator: Validators.pattern(
                /^\(?(\d{3})\)?[-\s.]?(\d{3})[-\s.]?(\d{4})$/,
              ),
              message: 'Invalid phone number. Format: 012-345-6789',
            },
          ],
          readOnly,
        },
      ),
      location: createFormGroup({
        city: createFormField(
          linkedSignal(() => contact()?.location?.city),
          { readOnly },
        ),
        country: createFormField(
          linkedSignal(() => contact()?.location?.country),
          { readOnly },
        ),
        postcode: createFormField(
          linkedSignal(() => contact()?.location?.postcode),
          { readOnly },
        ),
        state: createFormField(
          linkedSignal(() => contact()?.location?.state),
          { readOnly },
        ),
        street: createFormGroup({
          name: createFormField(
            linkedSignal(() => contact()?.location?.street?.name),
            { readOnly },
          ),
          number: createFormField(
            linkedSignal(() => contact()?.location?.street?.number),
            { readOnly },
          ),
        }),
      }),
    };
  });

  protected save(): void {
    if (this.form.dirty() && this.form.valid()) {
      const contact = {
        ...this.contact.value(),
        ...this.form.value(),
      } satisfies Contact | NewContact;

      firstValueFrom(this.api.saveContact(contact));

      this.isEditing.set(false);
      this.router.navigate(['/contacts']);
    } else {
      this.form.markAllAsTouched();
    }
  }
}
