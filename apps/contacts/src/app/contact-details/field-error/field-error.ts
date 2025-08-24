import { Component, computed } from '@angular/core';
import { injectErrorField } from 'ng-signal-forms';

@Component({
  selector: 'app-field-error',
  template: `
    @if (touched() && errors()) { @for (message of errorMessages(); track
    message) {
    <p>{{ message }}</p>
    } }
  `,
  styleUrls: ['./field-error.css'],
})
export class FieldErrorComponent {
  private formField = injectErrorField();
  public touched = this.formField.touched;
  public errors = this.formField.errors;

  public errorMessages = computed(() =>
    Object.values(this.errors() ?? {}).map(
      (error) => error.message ?? 'Field invalid',
    ),
  );
}
