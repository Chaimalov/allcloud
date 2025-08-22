export interface Contact {
  id: number;
  name: {
    title: string;
    first: string;
    last: string;
  };
  location: {
    street: {
      number: number;
      name: string;
    };
    city: string;
    state: string;
    country: string;
    postcode: number;
  };
  email: string;
  registrationDate: Date;
  phone: string;
  cell: string;
  picture: {
    large: string;
    medium: string;
    thumbnail: string;
  };
}

export const CONTACT_FIELDS = [
  'name',
  'location',
  'email',
  'phone',
  'cell',
  'picture',
] as const satisfies Array<keyof Contact>;
