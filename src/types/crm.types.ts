export type LeadStatus = "NEW" | "CONTACTED" | "QUALIFIED" | "LOST" | "CONVERTED";

export interface Lead {
  id: string;
  tenantId: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  createdAt: number;
  createdBy: string;
}

export type AccountStatus = "ACTIVE" | "INACTIVE" | "ON_HOLD";

export interface Account {
  id: string;
  tenantId: string;
  name: string;
  industry: string;
  country: string;
  status: AccountStatus;
  createdAt: number;
}

export interface Contact {
  id: string;
  tenantId: string;
  accountId: string;
  name: string;
  email: string;
  phone: string;
  position: string;
}

export type OpportunityStage = "PROSPECTING" | "PROPOSAL" | "NEGOTIATION" | "WON" | "LOST";

export interface Opportunity {
  id: string;
  tenantId: string;
  accountId: string;
  title: string;
  value: number;
  stage: OpportunityStage;
  probability: number;
  expectedCloseDate: number;
}
