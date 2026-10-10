// Menu as listed on the restaurant's Deliveroo page (Oct 2026). Sample prices.

export type Tag = 'V' | 'GF' | 'H';

export const TAGS: Record<Tag, { label: string; short: string }> = {
  V: { label: 'Vegetarian option', short: 'V' },
  GF: { label: 'Gluten free', short: 'GF' },
  H: { label: 'Halal', short: 'H' },
};

export type Dish = {
  id: string;
  name: string;
  thai?: string;
  gloss?: string;
  desc?: string;
  price: number;
  tags: Tag[];
  /** Ordered "spice to taste": shows the spice-level picker. */
  spiceToTaste?: boolean;
  /** Served without rice; add some from Sides. */
  noRice?: boolean;
};

export type Category = {
  id: string;
  title: string;
  thai: string;
  dishes: Dish[];
  compact?: boolean;
};

export const MENU: Category[] = [
  {
    id: 'starters',
    title: 'Starters',
    thai: 'ของทานเล่น',
    dishes: [
      {
        id: 'pho-pia-tod',
        name: 'Pho Pia Tod',
        thai: 'ปอเปี๊ยะทอด',
        gloss: 'Spring rolls',
        desc: 'Glass noodles, fungus mushroom, veg, sweet chilli',
        price: 8.5,
        tags: ['V'],
      },
      {
        id: 'thai-dumplings',
        name: 'Thai Dumplings',
        desc: 'Steamed chicken & prawn, sweet dark soy',
        price: 9.5,
        tags: [],
      },
      {
        id: 'moo-ping',
        name: 'Moo Ping',
        thai: 'หมูปิ้ง',
        gloss: 'Grilled pork skewers',
        desc: 'Bangkok-style, palm sugar marinade, roasted chilli sauce',
        price: 9.5,
        tags: [],
      },
      {
        id: 'satay-gai',
        name: 'Satay Gai',
        thai: 'สะเต๊ะไก่',
        gloss: 'Chicken skewers',
        desc: 'Turmeric & cumin, peanut sauce',
        price: 9.5,
        tags: [],
      },
      {
        id: 'tod-mun-pla',
        name: 'Tod Mun Pla',
        thai: 'ทอดมันปลา',
        gloss: 'Fish cakes',
        desc: 'Red curry paste, beans, basil, cucumber & peanut sauce',
        price: 9.9,
        tags: ['GF'],
      },
      { id: 'pork-ribs', name: 'Roasted Tender Pork Ribs', desc: 'Spices & honey, slow-roasted', price: 9.5, tags: [] },
      {
        id: 'goong-tod',
        name: 'Goong Tod',
        thai: 'กุ้งทอด',
        gloss: 'Prawn tempura',
        desc: 'Sweet soya sauce',
        price: 9.5,
        tags: [],
      },
      {
        id: 'peek-gai-tod',
        name: 'Peek Gai Tod',
        thai: 'ปีกไก่ทอด',
        gloss: 'Chicken wings',
        desc: 'Spicy, roasted chilli sauce',
        price: 8.0,
        tags: ['H'],
      },
      {
        id: 'pla-muk-tod',
        name: 'Pla Muk Tod',
        thai: 'ปลาหมึกทอด',
        gloss: 'Fried squid',
        desc: 'Sweet chilli, lemon',
        price: 9.5,
        tags: [],
      },
    ],
  },
  {
    id: 'soups',
    title: 'Soups',
    thai: 'ต้ม',
    dishes: [
      {
        id: 'tom-yum-goong',
        name: 'Tom Yum Goong',
        thai: 'ต้มยำกุ้ง',
        desc: 'Spicy & sour lemongrass, prawns, mushroom',
        price: 10.0,
        tags: ['GF'],
      },
      {
        id: 'tom-kha-gai',
        name: 'Tom Kha Gai',
        thai: 'ต้มข่าไก่',
        desc: 'Coconut, chicken, galangal',
        price: 10.0,
        tags: ['GF', 'H'],
      },
    ],
  },
  {
    id: 'salads',
    title: 'Salads',
    thai: 'ยำ',
    dishes: [
      {
        id: 'som-tum-thai',
        name: 'Som Tum Thai',
        thai: 'ส้มตำไทย',
        gloss: 'Green papaya salad',
        desc: 'Chilli, tomato, green beans, dried shrimp, peanuts',
        price: 13.0,
        tags: ['GF', 'V'],
      },
      {
        id: 'larb',
        name: 'Larb',
        thai: 'ลาบ',
        gloss: 'North-Eastern spicy minced meat salad',
        desc: 'Roasted rice, mint, lime',
        price: 12.95,
        tags: ['GF'],
      },
      {
        id: 'yum-woon-sen',
        name: 'Yum Woon Sen',
        thai: 'ยำวุ้นเส้น',
        gloss: 'Glass noodle salad',
        desc: 'Minced pork, prawns, peanuts, chilli',
        price: 14.0,
        tags: ['GF'],
      },
      {
        id: 'yum-nam-tok',
        name: 'Yum Nam Tok',
        thai: 'ยำน้ำตก',
        gloss: 'Grilled meat salad',
        desc: 'Thai herbs, roasted rice',
        price: 13.0,
        tags: ['GF', 'H'],
      },
    ],
  },
  {
    id: 'mains',
    title: 'Mains',
    thai: 'จานหลัก',
    dishes: [
      {
        id: 'pad-thai',
        name: 'Pad Thai',
        thai: 'ผัดไทย',
        desc: 'Rice noodles, egg, tofu, beansprouts, peanuts',
        price: 15.5,
        tags: ['GF', 'V', 'H'],
      },
      {
        id: 'panang',
        name: 'Panang Curry',
        thai: 'พะแนง',
        desc: 'Rich and very mild, coconut, kaffir lime',
        price: 14.95,
        tags: ['GF', 'H'],
        noRice: true,
      },
      {
        id: 'gang-keaw-waan',
        name: 'Gang Keaw Waan',
        thai: 'แกงเขียวหวาน',
        gloss: 'Green curry',
        desc: 'Aubergine, bamboo shoots, sweet basil',
        price: 14.95,
        tags: ['GF', 'H'],
        noRice: true,
      },
      {
        id: 'pad-kra-praw',
        name: 'Pad Kra-Praw',
        thai: 'ผัดกะเพรา',
        desc: 'Stir-fried meat, fresh chilli, basil',
        price: 14.95,
        tags: ['GF', 'V'],
        spiceToTaste: true,
        noRice: true,
      },
      {
        id: 'massaman',
        name: 'Massaman',
        thai: 'มัสมั่น',
        gloss: 'Southern Thai cardamom curry',
        desc: 'Potato, peanuts',
        price: 15.5,
        tags: ['GF', 'H'],
        noRice: true,
      },
      {
        id: 'pad-kee-mao',
        name: 'Kuay Tiew Pad Kee Mao',
        thai: 'ก๋วยเตี๋ยวผัดขี้เมา',
        gloss: 'Drunken noodles',
        desc: 'Flat noodles, chilli, long beans, basil',
        price: 15.5,
        tags: ['GF', 'V'],
        spiceToTaste: true,
      },
      {
        id: 'gang-kua-sapparod',
        name: 'Gang Kua Sapparod',
        thai: 'แกงคั่วสับปะรด',
        gloss: 'Red curry with pineapple',
        desc: 'King prawn or roast duck',
        price: 14.95,
        tags: ['GF', 'V', 'H'],
        noRice: true,
      },
      {
        id: 'pad-se-ew',
        name: 'Pad-Se-Ew',
        thai: 'ผัดซีอิ๊ว',
        desc: 'Flat noodles, egg, veg, soy',
        price: 15.5,
        tags: ['GF', 'V', 'H'],
      },
      {
        id: 'kao-pad',
        name: 'Kao Pad',
        thai: 'ข้าวผัด',
        gloss: 'Fried rice',
        desc: 'Khaosan Road-style',
        price: 15.5,
        tags: ['H'],
      },
      {
        id: 'gai-tod',
        name: 'Gai Tod',
        thai: 'ไก่ทอด',
        gloss: 'Garlic & pepper fried chicken',
        desc: 'Crispy onions, sticky rice',
        price: 16.95,
        tags: [],
      },
      {
        id: 'gai-yang',
        name: 'Gai Yang, Khao Neaw & Som Tum',
        thai: 'ไก่ย่าง ข้าวเหนียว ส้มตำ',
        desc: 'Grilled half chicken, sticky rice, papaya salad',
        price: 19.0,
        tags: ['GF', 'H'],
      },
      {
        id: 'pad-med-mamuang',
        name: 'Pad Med Mamuang Himaphan',
        thai: 'ผัดเม็ดมะม่วงหิมพานต์',
        gloss: 'Cashew stir-fry',
        desc: 'Dried whole chillies',
        price: 14.95,
        tags: ['GF', 'V'],
      },
      {
        id: 'pla-prig-gang',
        name: 'Pla Prig Gang',
        thai: 'ปลาพริกแกง',
        desc: 'Battered tilapia, red curry sauce, jasmine rice',
        price: 19.5,
        tags: [],
      },
      {
        id: 'pla-lard-prig',
        name: 'Pla Lard Prig',
        thai: 'ปลาราดพริก',
        desc: 'Battered tilapia, chilli & basil sauce, jasmine rice',
        price: 19.5,
        tags: [],
      },
      {
        id: 'pla-tod-yum-mamuang',
        name: 'Pla Tod Yum Mamuang',
        thai: 'ปลาทอดยำมะม่วง',
        desc: 'Battered tilapia, mango salad, jasmine rice',
        price: 19.5,
        tags: [],
      },
    ],
  },
  {
    id: 'sides',
    title: 'Sides',
    thai: 'เครื่องเคียง',
    compact: true,
    dishes: [
      { id: 'jasmine-rice', name: 'Jasmine rice', price: 3.5, tags: [] },
      { id: 'egg-fried-rice', name: 'Egg fried rice', price: 4.5, tags: [] },
      { id: 'coconut-rice', name: 'Coconut rice', price: 4.5, tags: [] },
      { id: 'sticky-rice', name: 'Sticky rice', price: 4.5, tags: [] },
      { id: 'broccoli', name: 'Broccoli with ginger', price: 8.8, tags: [] },
      { id: 'pad-pak', name: 'Pad Pak', gloss: 'Mixed veg', price: 8.8, tags: ['V'] },
      { id: 'fried-egg', name: 'Fried egg', price: 2.0, tags: [] },
      { id: 'prawn-crackers', name: 'Spicy prawn crackers', price: 3.0, tags: ['GF'] },
    ],
  },
];

export const ALL_DISHES = MENU.flatMap((c) => c.dishes);

export const dishById = (id: string) => {
  const dish = ALL_DISHES.find((d) => d.id === id);
  if (!dish) throw new Error(`Unknown dish: ${id}`);
  return dish;
};

export const formatPrice = (price: number) => `£${price.toFixed(2)}`;

export const SPICE_LEVELS = [
  { id: 'mild', label: 'Mild', chillies: 0 },
  { id: 'medium', label: 'Medium', chillies: 1 },
  { id: 'hot', label: 'Hot', chillies: 2 },
  { id: 'thai-hot', label: 'Thai hot', chillies: 3 },
] as const;
