export interface Account {
  account_id:string;
  name: string;
  phone_number?: string;
  type?: string;
  owner?: string;
  industry_id?:string;
  parent_account_id?:string;
}
