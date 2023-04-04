import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
interface Campaign {
  campaign_name: string;
  patrilineal_campaign_name: string;
  type: string;
  status: string;
  start_date: any;
  end_date: any;
  responses: string;
  owner: string;
}
@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent {
  //table內容
  campaign: Campaign[] = [];
  //p-dropdown狀態
  status = ['--無--', 'In Progress', 'Completed', 'Aborted', 'Planned'];
  //p-dropdown狀態
  type = ['Event', 'Demo Signup', 'Email', 'Search', 'Social Media', 'Website Direct' , 'Other'];
  //table下拉選單
  items: MenuItem[] = [];
  ngOnInit() {
    this.campaign = [
      { campaign_name: "123", patrilineal_campaign_name: "123", type: "123", status: "123", start_date: "123", end_date: "123", responses: "123", owner: "123" },
    ];
    this.items = [
      {
        label: '編輯',
      },
      {
        label: '刪除',
      },
      {
        label: '變更擁有者',
      },
    ]
  }
  visible: boolean = false;
  add_campaign() {
    this.visible = true;
  }
}
