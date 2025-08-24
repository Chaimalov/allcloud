import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ContactsApi } from '../api/api';
import { ContactsListComponent } from '../contacts-list/contacts-list';
import { Dices, LucideAngularModule, UserRoundPlus } from 'lucide-angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contacts-page',
  templateUrl: './contacts-page.html',
  styleUrls: ['./contacts-page.css'],
  imports: [ContactsListComponent, LucideAngularModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsPageComponent {
  protected api = inject(ContactsApi);
  protected Dices = Dices;
  protected UserRoundPlus = UserRoundPlus;
}
