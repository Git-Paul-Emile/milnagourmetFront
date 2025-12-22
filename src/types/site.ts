// Types pour le contenu du site

export interface AboutData {
  title: string;
  description: string;
  values: Value[];
  missions: Mission[];
  stats: Stats;
}

export interface Value {
  title: string;
  description: string;
  icon: string;
}

export interface Mission {
  title: string;
  description: string;
  icon: string;
}

export interface Stats {
  satisfiedCustomers: number;
  uniqueFlavors: number;
  yearsExperience: number;
}

export interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
  active?: boolean;
}

export interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  hours: Record<string, DayHours>;
}

export interface DayHours {
  open: string;
  close: string;
  closed: boolean;
}

export interface SocialMedia {
  facebook: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  whatsapp: string;
}

export interface Branding {
  logo: string;
  slogan: string;
  tagline: string;
}

export interface HeroData {
  title: string;
  subtitle: string;
  badge: string;
  banner?: string;
  features: HeroFeature[];
}

export interface HeroFeature {
  title: string;
  description: string;
}

export interface ContactSectionData {
  title: string;
  description: string;
  methods: ContactMethod[];
  socialLinks: SocialLink[];
  address: string;
  storeHours: StoreHour[];
}

export interface ContactMethod {
  title: string;
  description: string;
  action: string;
  primary?: boolean;
}

export interface SocialLink {
  name: string;
  handle: string;
  url: string;
}

export interface StoreHour {
  day: string;
  hours: string;
}

export interface CatalogSectionData {
  title: string;
  description: string;
  creationTitle: string;
  creationDescription: string;
  creationButtonText: string;
  emptyMessage: string;
  emptySubMessage: string;
}

export interface NavigationItem {
  name: string;
  href: string;
}