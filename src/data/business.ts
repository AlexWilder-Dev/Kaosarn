export const business = {
  name: 'Kaosarn Tooting',
  tagline: ['Thai Food', 'Home Cooked', 'Good Vibes'],
  address: {
    line1: '181 Tooting High Street',
    city: 'London',
    postcode: 'SW17 0SZ',
  },
  nearby: 'Tooting Broadway (Northern line)',
  phone: {
    display: '020 8672 8811',
    href: 'tel:+442086728811',
  },
  email: 'kaosarn@kaosarntooting.co.uk',
  reserveUrl: 'https://widget.thefork.com/985aa7f3-5724-4896-961a-58d6fe681d52',
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=' +
    encodeURIComponent('Kaosarn, 181 Tooting High Street, London SW17 0SZ'),
  ratings: [
    { source: 'Uber Eats', score: '4.7', count: '3,000+ ratings' },
    { source: 'Deliveroo', score: '4.7', count: '500+ ratings' },
  ],
} as const;

export const mailto = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set('subject', subject);
  if (body) params.set('body', body);
  const query = params.toString().replace(/\+/g, '%20');
  return `mailto:${business.email}${query ? `?${query}` : ''}`;
};
