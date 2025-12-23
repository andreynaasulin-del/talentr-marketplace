import { Vendor } from '@/types';

export const mockVendors: Vendor[] = [
  // PHOTOGRAPHERS
  {
    id: '1',
    name: 'David Cohen Photography',
    category: 'Photographer',
    city: 'Tel Aviv',
    rating: 4.9,
    reviewsCount: 127,
    priceFrom: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Bar Mitzvah', 'Corporate'],
    description: 'Professional wedding and event photographer with 10+ years experience',
    phone: '972501234567'
  },
  {
    id: '5',
    name: 'Sarah Photography Studio',
    category: 'Photographer',
    city: 'Haifa',
    rating: 4.9,
    reviewsCount: 211,
    priceFrom: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Engagement', 'Family'],
    description: 'Capturing authentic emotions and timeless moments',
    phone: '972521234567'
  },

  // VIDEOGRAPHERS
  {
    id: '11',
    name: 'CineMotion Studios',
    category: 'Videographer',
    city: 'Jerusalem',
    rating: 4.8,
    reviewsCount: 98,
    priceFrom: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Bar Mitzvah', 'Corporate'],
    description: 'Cinematic wedding films and event videography with drone footage',
    phone: '972531234567'
  },
  {
    id: '12',
    name: 'Frame by Frame Productions',
    category: 'Videographer',
    city: 'Tel Aviv',
    rating: 4.9,
    reviewsCount: 156,
    priceFrom: 4000,
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Engagement', 'Gala'],
    description: 'Award-winning videographers creating emotional event stories',
    phone: '972541234567'
  },

  // DJs
  {
    id: '2',
    name: 'DJ Noam - Electronic Vibes',
    category: 'DJ',
    city: 'Tel Aviv',
    rating: 4.8,
    reviewsCount: 94,
    priceFrom: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Birthday', 'Club Night'],
    description: 'High-energy DJ specializing in EDM and Top 40 hits',
    phone: '972551234567'
  },
  {
    id: '6',
    name: 'DJ Avi Mix',
    category: 'DJ',
    city: 'Haifa',
    rating: 4.6,
    reviewsCount: 67,
    priceFrom: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Corporate', 'Private Party'],
    description: 'Versatile DJ with extensive music library and professional equipment'
  },

  // MCs
  {
    id: '3',
    name: 'Yael Levi - Master of Ceremonies',
    category: 'MC',
    city: 'Haifa',
    rating: 5.0,
    reviewsCount: 156,
    priceFrom: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Bar Mitzvah', 'Corporate'],
    description: 'Charismatic host making your event unforgettable'
  },
  {
    id: '7',
    name: 'Ron Mizrahi - The Voice',
    category: 'MC',
    city: 'Tel Aviv',
    rating: 4.8,
    reviewsCount: 102,
    priceFrom: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Corporate', 'Gala'],
    description: 'Professional event host with bilingual capabilities (Hebrew/English)'
  },

  // MAGICIANS
  {
    id: '4',
    name: 'Magic Eli',
    category: 'Magician',
    city: 'Tel Aviv',
    rating: 4.7,
    reviewsCount: 83,
    priceFrom: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
    tags: ['Birthday', 'Bar Mitzvah', 'Kids Party'],
    description: 'Award-winning magician specializing in close-up and stage magic'
  },
  {
    id: '8',
    name: 'Wonderland Magic Show',
    category: 'Magician',
    city: 'Haifa',
    rating: 4.9,
    reviewsCount: 145,
    priceFrom: 1700,
    imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
    tags: ['Birthday', 'Bar Mitzvah', 'Corporate'],
    description: 'Interactive magic shows that engage audiences of all ages'
  },

  // SINGERS
  {
    id: '13',
    name: 'Noa Vocal Performance',
    category: 'Singer',
    city: 'Tel Aviv',
    rating: 4.9,
    reviewsCount: 134,
    priceFrom: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Corporate', 'Gala'],
    description: 'Professional vocalist with repertoire from jazz to pop classics'
  },
  {
    id: '14',
    name: 'David Sings - Live Events',
    category: 'Singer',
    city: 'Jerusalem',
    rating: 4.7,
    reviewsCount: 89,
    priceFrom: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Bar Mitzvah', 'Private Party'],
    description: 'Soulful voice bringing emotions to every celebration'
  },

  // MUSICIANS
  {
    id: '15',
    name: 'Strings of Elegance',
    category: 'Musician',
    city: 'Tel Aviv',
    rating: 5.0,
    reviewsCount: 167,
    priceFrom: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Engagement', 'Corporate'],
    description: 'Violin and saxophone duo creating sophisticated ambiance'
  },
  {
    id: '16',
    name: 'Jazz Ensemble Live',
    category: 'Musician',
    city: 'Haifa',
    rating: 4.8,
    reviewsCount: 122,
    priceFrom: 3500,
    imageUrl: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Gala', 'Corporate'],
    description: 'Live jazz band for upscale events and celebrations'
  },

  // COMEDIANS
  {
    id: '17',
    name: 'Laugh Factory - Yoni Cohen',
    category: 'Comedian',
    city: 'Tel Aviv',
    rating: 4.6,
    reviewsCount: 78,
    priceFrom: 2000,
    imageUrl: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=800&q=80',
    tags: ['Corporate', 'Private Party', 'Birthday'],
    description: 'Stand-up comedian bringing laughter and energy to events'
  },
  {
    id: '18',
    name: 'Comedy by Omri',
    category: 'Comedian',
    city: 'Netanya',
    rating: 4.7,
    reviewsCount: 93,
    priceFrom: 1800,
    imageUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=800&q=80',
    tags: ['Corporate', 'Gala', 'Private Party'],
    description: 'Clean comedy for professional and family events'
  },

  // DANCERS
  {
    id: '19',
    name: 'Urban Dance Crew',
    category: 'Dancer',
    city: 'Tel Aviv',
    rating: 4.8,
    reviewsCount: 156,
    priceFrom: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Bar Mitzvah', 'Corporate'],
    description: 'Professional dance troupe for spectacular event entertainment'
  },
  {
    id: '20',
    name: 'Salsa Nights Performance',
    category: 'Dancer',
    city: 'Eilat',
    rating: 4.9,
    reviewsCount: 124,
    priceFrom: 2200,
    imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Birthday', 'Beach Party'],
    description: 'Latin dance performances bringing rhythm and passion'
  },

  // BARTENDERS
  {
    id: '21',
    name: 'Mixology Masters',
    category: 'Bartender',
    city: 'Tel Aviv',
    rating: 4.9,
    reviewsCount: 201,
    priceFrom: 1500,
    imageUrl: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Corporate', 'Private Party'],
    description: 'Professional bartenders crafting signature cocktails for events'
  },
  {
    id: '22',
    name: 'The Cocktail Lab',
    category: 'Bartender',
    city: 'Jerusalem',
    rating: 4.7,
    reviewsCount: 143,
    priceFrom: 1600,
    imageUrl: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=800&q=80',
    tags: ['Corporate', 'Gala', 'Birthday'],
    description: 'Creative mixology with molecular gastronomy techniques'
  },

  // BAR SHOW
  {
    id: '23',
    name: 'Flair Bartending Show',
    category: 'Bar Show',
    city: 'Tel Aviv',
    rating: 4.8,
    reviewsCount: 167,
    priceFrom: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Birthday', 'Corporate'],
    description: 'Spectacular flair bartending performances with fire tricks'
  },
  {
    id: '24',
    name: 'Liquid Theatre',
    category: 'Bar Show',
    city: 'Ashdod',
    rating: 4.9,
    reviewsCount: 189,
    priceFrom: 2800,
    imageUrl: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&w=800&q=80',
    tags: ['Corporate', 'Gala', 'Private Party'],
    description: 'Theatrical bar performance combining art and mixology'
  },

  // EVENT DECOR
  {
    id: '25',
    name: 'Dream Decorations',
    category: 'Event Decor',
    city: 'Tel Aviv',
    rating: 5.0,
    reviewsCount: 234,
    priceFrom: 3000,
    imageUrl: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Bar Mitzvah', 'Corporate'],
    description: 'Transforming venues into magical spaces with premium decor'
  },
  {
    id: '26',
    name: 'Floral Fantasy',
    category: 'Event Decor',
    city: 'Haifa',
    rating: 4.9,
    reviewsCount: 198,
    priceFrom: 2500,
    imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Engagement', 'Gala'],
    description: 'Elegant floral arrangements and complete event styling'
  },

  // KIDS ANIMATORS
  {
    id: '27',
    name: 'Happy Kids Entertainment',
    category: 'Kids Animator',
    city: 'Rishon LeZion',
    rating: 4.9,
    reviewsCount: 276,
    priceFrom: 800,
    imageUrl: 'https://images.unsplash.com/photo-1514415008039-efa173293080?auto=format&fit=crop&w=800&q=80',
    tags: ['Birthday', 'Brit Milah', 'Kids Party'],
    description: 'Professional kids entertainers with games, music, and fun'
  },
  {
    id: '28',
    name: 'Party Pirates Crew',
    category: 'Kids Animator',
    city: 'Netanya',
    rating: 4.8,
    reviewsCount: 312,
    priceFrom: 900,
    imageUrl: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80',
    tags: ['Birthday', 'Kids Party', 'Family'],
    description: 'Themed party animation with costumes and interactive shows'
  },

  // FACE PAINTERS
  {
    id: '29',
    name: 'Rainbow Faces Art',
    category: 'Face Painter',
    city: 'Tel Aviv',
    rating: 4.9,
    reviewsCount: 187,
    priceFrom: 600,
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80',
    tags: ['Birthday', 'Kids Party', 'Family'],
    description: 'Creative face painting transforming kids into their favorite characters'
  },
  {
    id: '30',
    name: 'Fantasy Faces Studio',
    category: 'Face Painter',
    city: 'Jerusalem',
    rating: 4.7,
    reviewsCount: 145,
    priceFrom: 650,
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    tags: ['Birthday', 'Bar Mitzvah', 'Kids Party'],
    description: 'Professional body art and face painting for all ages'
  },

  // PIERCING/TATTOO
  {
    id: '31',
    name: 'Ink & Glow Temporary Art',
    category: 'Piercing/Tattoo',
    city: 'Tel Aviv',
    rating: 4.8,
    reviewsCount: 167,
    priceFrom: 1200,
    imageUrl: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?auto=format&fit=crop&w=800&q=80',
    tags: ['Birthday', 'Private Party', 'Beach Party'],
    description: 'Temporary tattoos and glitter art station for events'
  },
  {
    id: '32',
    name: 'Henna Dreams',
    category: 'Piercing/Tattoo',
    city: 'Haifa',
    rating: 4.9,
    reviewsCount: 203,
    priceFrom: 1000,
    imageUrl: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Birthday', 'Private Party'],
    description: 'Traditional and modern henna art for special celebrations'
  },

  // CHEFS/CATERING
  {
    id: '33',
    name: 'Gourmet Bites Catering',
    category: 'Chef',
    city: 'Tel Aviv',
    rating: 5.0,
    reviewsCount: 342,
    priceFrom: 5000,
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Corporate', 'Gala'],
    description: 'Premium catering with Michelin-star trained chefs'
  },
  {
    id: '34',
    name: 'Mediterranean Flavors',
    category: 'Chef',
    city: 'Eilat',
    rating: 4.9,
    reviewsCount: 298,
    priceFrom: 4500,
    imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80',
    tags: ['Wedding', 'Birthday', 'Corporate'],
    description: 'Fresh Mediterranean cuisine with live cooking stations'
  },
];

// Helper function to filter vendors by category
export const getVendorsByCategory = (category: Vendor['category']): Vendor[] => {
  return mockVendors.filter(vendor => vendor.category === category);
};

// Helper function to filter vendors by city
export const getVendorsByCity = (city: Vendor['city']): Vendor[] => {
  return mockVendors.filter(vendor => vendor.city === city);
};

// Helper function to get vendor by ID
export const getVendorById = (id: string): Vendor | undefined => {
  return mockVendors.find(vendor => vendor.id === id);
};
