import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Calendar } from 'primeng/calendar';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})

export class CampaignComponent {
  @ViewChild('startDate') startDate: Calendar | undefined;
  @ViewChild('endDate') endDate: Calendar | undefined;
  //table內容
  filteredCampaigns: any[] = [];
  campaign: any[] = [
    {
      name: "1+1",
      enable: true,
      patrilineal_name: "15%off",
      type: "社交媒體",
      status: "策劃中",
      start_date: "2023-04-07",
      end_date: "2023-04-09",
      owner: "王大明",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    },
    {
      name: "sam",
      enable: false,
      patrilineal_name: "1+1",
      type: "電子郵件",
      status: "已完成",
      start_date: "2023-04-14",
      end_date: "2023-04-19",
      owner: "王大明",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    },
  ];
  filterText: any = '';
  filterCampaigns() {
    if (this.filterText) {
      this.filteredCampaigns = this.campaign.filter((campaign) => {
        return campaign.name.toLowerCase().includes(this.filterText.toLowerCase());
      });
    } else {
      this.filteredCampaigns = this.campaign;
    }
    if (this.filterText === '') {
      this.filteredCampaigns = this.campaign;
    } else {
      this.filteredCampaigns = this.campaign.filter(campaign => {
        return (
          campaign.name.toLowerCase().includes(this.filterText) ||
          campaign.patrilineal_name.toLowerCase().includes(this.filterText) ||
          campaign.type.toLowerCase().includes(this.filterText) ||
          campaign.status.toLowerCase().includes(this.filterText) ||
          campaign.start_date.toLowerCase().includes(this.filterText) ||
          campaign.end_date.toLowerCase().includes(this.filterText) ||
          campaign.owner.toLowerCase().includes(this.filterText)
        );
      });
    }
    console.log(this.filteredCampaigns)
  }
  ngOnInit() {
    this.filteredCampaigns = this.campaign;
  }
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
  start_date!: Date;
  end_date!: Date;

  constructor(private fb: FormBuilder) {
    this.campaign_form = this.fb.group({
      name: ['', [Validators.required]],
      owner: new FormControl({ value: '', disabled: true }),
      enable: [false],
      status: [''],
      patrilineal_name: [''],
      type: [''],
      start_date: [''],
      end_date: [''],
      description: [''],
      sent: [''],
      budget_cost: [''],
      expected_responses: [''],
      actual_cost: [''],
      expected_income: [''],
      created_at: new FormControl({ value: '', disabled: true }),
      updated_at: new FormControl({ value: '', disabled: true }),
      created_by: new FormControl({ value: '', disabled: true }),
      updated_by: new FormControl({ value: '', disabled: true }),
    }, { formGroupName: 'campaign' });
    //驗證日期是否有效
    if (this.campaign_form.controls['start_date'].value > this.campaign_form.controls['end_date'].value) {
      this.campaign_form.controls['end_date'].setErrors({ 'incorrect': true });
    }
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }
  //偵測type變量
  ontypeChange(event: any) {
    console.log("類型選擇type: " + event.value.code + event.value.name);
  }

  //dialog方法
  visible: boolean = false;
  dialogHeader!: string;
  selectedStatus!: any;
  selectedType!: any;
  showedit = true;//判斷是否dialog為新增與編輯
  showDialog(type: string, campaign?: any): void {
    this.visible = true;
    console.log('點擊: ' + type);
    this.campaign_form.reset()
    this.campaign_form.patchValue({ status: this.status[0].name });
    console.log(this.status)
    if (type === 'add') {
      this.dialogHeader = '新增行銷活動';
      this.showedit = false;
    } else if (type === 'edit') {
      console.log("campaign: " + JSON.stringify(campaign))
      this.dialogHeader = '編輯行銷活動';
      this.campaign_form.patchValue(campaign);
      this.campaign_form.patchValue({
        start_date: new Date(campaign.start_date),
        end_date: new Date(campaign.end_date)
      });
      this.showedit = true;
      // 綁定已經選擇的狀態
      this.selectedStatus = this.status.find(s => s.name === campaign.status);
      this.selectedType = this.status.find(s => s.name === campaign.type);
    }
  }
}
