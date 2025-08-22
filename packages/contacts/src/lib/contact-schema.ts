export interface Contact {
  id: number;
  name?: Partial<{
    title: string;
    first: string;
    last: string;
  }>;
  location?: Partial<{
    street: Partial<{
      number: number;
      name: string;
    }>;
    city: string;
    state: string;
    country: string;
    postcode: number;
  }>;
  email?: string;
  registrationDate?: Date;
  phone?: string;
  cell?: string;
  picture?: Partial<{
    large: string;
    medium: string;
    thumbnail: string;
  }>;
}

export type NewContact = Omit<Contact, 'id'>;

export const CONTACT_FIELDS = [
  'name',
  'location',
  'email',
  'phone',
  'cell',
  'picture',
] as const satisfies Array<keyof Contact>;
