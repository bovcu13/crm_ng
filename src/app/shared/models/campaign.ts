export interface Campaign {
  campaign_id?: string;
  name?: string;
  status?: string;
  is_enable: false,
  type?: string;
  parent_campaign_id?: string;
  parent_campaign_name?: string;
  start_date?: string;
  end_date?: string;
  description?: string;
  sent?: number;
  budget_cost?: number;
  expected_responses?: number;
  actual_cost?: number;
  expected_income?: number;
  salesperson_id?: string;
  salesperson_name?: string;
}
