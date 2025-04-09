export enum PaymentMethodType {
  BANK = "BANK",
  ESEWA = "ESEWA",
  KHALTI = "KHALTI",
  OTHER = "OTHER",
}

export interface BankInfo {
  accountName: string;
  branchName: string;
  bankName: string;
  accountNumber: string;
  qrCode?: string;
}

export interface DigitalWalletInfo {
  id: string;
  qrCode?: string;
}

export interface OtherPaymentInfo {
  name: string;
  details: string;
  qrCode?: string;
}

export interface PaymentInfo {
  type: PaymentMethodType;
  bank?: BankInfo;
  digitalWallet?: DigitalWalletInfo;
  other?: OtherPaymentInfo;
  isActive: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface OrganizationInfo {
  name: string;
  address: string;
  email: string;
  phone: string;
  socialLinks: SocialLink[];
}

export interface MetaInfo {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  favicon?: string;
  twitterHandle?: string;
}

export interface Setting {
  id: string;
  organizationInfo: OrganizationInfo;
  paymentInfo: PaymentInfo[];
  metaInfo: MetaInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateSettingInput {
  organizationInfo: OrganizationInfo;
  paymentInfo: PaymentInfo[];
  metaInfo: MetaInfo;
}

export interface UpdateSettingInput {
  organizationInfo?: Partial<OrganizationInfo>;
  paymentInfo?: PaymentInfo[];
  metaInfo?: Partial<MetaInfo>;
}
