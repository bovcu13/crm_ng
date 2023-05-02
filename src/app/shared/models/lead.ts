export interface Lead {
  lead_id:string;
  name?: string;
  status: string;
  account_id: string;
  description:string;
  title?:string;
  phone_number?:string;
  cell_phone?:string;
  email?:string;
  line?:string;
  source?:string;
  industry_id?:string;
  rating?:string;
  owner?:string;
  company_name?:string;
}
