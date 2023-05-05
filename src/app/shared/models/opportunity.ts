export interface Opportunity {
  opportunity_id:string;
  name:string;
  stage:string;
  forecast_category?:string;
  close_date:string;
  account_id:string;
  account_name:string;
  amount?: number;
}
