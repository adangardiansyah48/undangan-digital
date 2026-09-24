export type UserRole = "customer" | "designer" | "admin" | "superadmin";
export type InvitationStatus = "draft" | "published" | "archived";
export type Track = "self" | "assisted";
export type Tier = "bronze" | "silver" | "gold" | "platinum";
export type TemplateCategory = "wedding" | "adat" | "animasi" | "non-wedding";
export type RsvpStatus = "pending" | "hadir" | "tidak" | "ragu";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export type AssistanceStatus =
  | "pending"
  | "in_progress"
  | "review"
  | "done"
  | "rejected";

export type Profile = {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type Template = {
  id: string;
  slug: string;
  category: TemplateCategory;
  subcategory: string | null;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  preview_url: string | null;
  is_premium: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type CouplePerson = {
  name: string;
  fullName: string;
  parents: string;
  photo?: string;
  instagram?: string;
};

export type EventItem = {
  title: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  mapsUrl?: string;
};

export type BankAccount = {
  bank: string;
  number: string;
  name: string;
};

export type InvitationData = {
  coverTitle?: string;
  quote?: string;
  quoteSource?: string;
  musicUrl?: string;
  couple?: {
    bride: CouplePerson;
    groom: CouplePerson;
  };
  events?: EventItem[];
  story?: string;
  giftNote?: string;
  banks?: BankAccount[];
  giftAddress?: {
    name: string;
    phone: string;
    address: string;
  };
  liveStreamUrl?: string;
};

export type Invitation = {
  id: string;
  user_id: string;
  template_id: string | null;
  slug: string;
  custom_domain: string | null;
  title: string | null;
  status: InvitationStatus;
  track: Track;
  tier: Tier;
  expired_at: string | null;
  data: InvitationData;
  view_count: number;
  created_at: string;
  updated_at: string;
  templates?: Template | null;
};

export type Guest = {
  id: string;
  invitation_id: string;
  name: string;
  slug: string;
  phone: string | null;
  email: string | null;
  rsvp_status: RsvpStatus;
  rsvp_count: number;
  rsvp_message: string | null;
  created_at: string;
};

export type Wish = {
  id: string;
  invitation_id: string;
  guest_name: string;
  message: string;
  rsvp_status: RsvpStatus | null;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  invitation_id: string | null;
  tier: Tier;
  amount: number;
  payment_method: string | null;
  payment_status: PaymentStatus;
  track: Track;
  created_at: string;
  paid_at: string | null;
};

export type AssistanceRequest = {
  id: string;
  user_id: string;
  order_id: string | null;
  invitation_id: string | null;
  template_id: string | null;
  category: string | null;
  brief: string | null;
  status: AssistanceStatus;
  designer_id: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
};

export type GalleryItem = {
  id: string;
  invitation_id: string;
  type: "photo" | "video";
  url: string;
  r2_key: string | null;
  drive_file_id: string | null;
  caption: string | null;
  sort_order: number;
  created_at: string;
};
