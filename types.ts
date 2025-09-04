
export enum BillingCycle {
  MONTHLY = 'Monthly',
  ANNUALLY = 'Annually',
}

export enum CostCategory {
  CLOUD = 'Cloud Services',
  MARKETING = 'Email & Marketing',
  DOMAINS = 'Domains & Hosting',
  ADS = 'Advertising',
  OFFICE = 'Office & Equipment',
  OTHER = 'Other',
}

export interface Cost {
  id: string;
  name: string;
  category: CostCategory;
  cost: number;
  billingCycle: BillingCycle;
  renewalDate: string; // ISO string date e.g. "2024-12-31"
}

export interface Suggestion {
    alternativeName: string;
    estimatedCost: string;
    reason: string;
}
