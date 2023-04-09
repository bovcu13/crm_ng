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
  campaign: any = {name: "123", patrilineal_name: "", type: "Event", status: "Aborted", start_date: "2023-04-07", end_date: "2023-04-09", responses: "40",owner: "王大明"  };
  campaign_table: any[] = [{ name: "123", patrilineal_name: "", type: "Event", status: "Aborted", start_date: "2023-04-07", end_date: "2023-04-09", responses: "40", owner: "王大明" },];
  //p-dropdown狀態
  status = ['--無--', 'In Progress', 'Completed', 'Aborted', 'Planned'];
  //p-dropdown狀態
  type = ['Event', 'Demo Signup', 'Email', 'Search', 'Social Media', 'Website Direct', 'Other'];
  //table下拉選單
  items: MenuItem[] = [{label: '編輯',command: () => {this.showDialog('edit',this.campaign)}},
  {label: '刪除',},{label: '變更擁有者',},];
  //建立formgroup表單
  compaign_form: FormGroup;
  currentCampaign!: any;
  constructor(private fb: FormBuilder) {
    this.compaign_form = this.fb.group({
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
  // showDialog(type: string, campaign?: any): void {
  //   this.visible = true;
  //   console.log('Invalid type: ' + type);
  //   if (type === 'add') {
  //     this.dialogHeader = '新增行銷活動';
  //     this.compaign_form.reset();
  //   } else if (type === 'edit') {
  //     console.log("campaign: " + JSON.stringify(campaign))
  //     this.dialogHeader = '編輯行銷活動';
  //     this.compaign_form.patchValue(campaign);
  //   }
  // }

  showDialog(type: string, campaign?: any) {
    this.dialogHeader = type === 'edit' ? '編輯行銷活動' : '新增行銷活動';
    this.visible = true;
    if (campaign) {
      this.currentCampaign = campaign;
      this.compaign_form.patchValue(campaign);
      console.log("campaign: " + JSON.stringify(campaign))
    } else {
      this.currentCampaign = null;
      this.compaign_form.reset();
    }
  }
}
