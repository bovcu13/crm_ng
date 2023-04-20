import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent {
  //table內容
  campaign: any = { name: "123", patrilineal_name: "", type: "Event", status: "Aborted", start_date: "2023-04-07", end_date: "2023-04-09", responses: "40", owner: "王大明" };
  campaign_table: any[] = [
    {
      name: "1+1",
      active: true,
      patrilineal_name: "15%off",
      type: "社交媒體",
      status: "策劃中",
      start_date: "2023-04-07",
      end_date: "2023-04-09",
      responses: "40",
      owner: "王大明",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    },
    {
      name: "sam",
      active: false,
      patrilineal_name: "1+1",
      type: "電子郵件",
      status: "已完成",
      start_date: "2023-04-14",
      end_date: "2023-04-19",
      responses: "30",
      owner: "王大明",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    },
  ];

  //p-dropdown狀態
  status = [
    {
      name: "策劃中",
      code: "planned",
    },
    {
      name: "進行中",
      code: "in_progress",
    },
    {
      name: "已完成",
      code: "completed",
    },
    {
      name: "已中止",
      code: "aborted",
    },
  ];
  //p-dropdown狀態
  type = [
    {
      name: "活動",
      code: "event",
    },
    {
      name: "樣品申請",
      code: "demo_signup",
    },
    {
      name: "社交媒體",
      code: "social_media",
    },
    {
      name: "領袖思維",
      code: "thought_leadership",
    },
    {
      name: "電子郵件",
      code: "email",
    },
    {
      name: "搜尋",
      code: "search",
    },
    {
      name: "直接瀏覽網站",
      code: "Website_direct",
    },
    {
      name: "其他",
      code: "Other",
    },
  ];

  //建立formgroup表單
  campaign_form: FormGroup;
  currentCampaign!: any;
  constructor(private fb: FormBuilder) {
    this.campaign_form = this.fb.group({
      name: ['', [Validators.required]],
      owner: ['', [Validators.required]],
      enable: [false, [Validators.required]],
      status: ['', [Validators.required]],
      patrilineal_name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      description: ['', [Validators.required]],
      sent: ['', [Validators.required]],
      budget_cost: ['', [Validators.required]],
      responses: ['', [Validators.required]],
      actual_cost: ['', [Validators.required]],
      expected_income: ['', [Validators.required]],
    });
  }
  ngOnInit() {

  }
  //dialog方法
  visible: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, campaign?: any): void {
    this.visible = true;
    console.log('Invalid type: ' + type);
    if (type === 'add') {
      this.dialogHeader = '新增行銷活動';
      this.campaign_form.reset();
    } else if (type === 'edit') {
      console.log("campaign: " + JSON.stringify(campaign))
      this.dialogHeader = '編輯行銷活動';
      this.campaign_form.patchValue(campaign);
    }
  }

}
