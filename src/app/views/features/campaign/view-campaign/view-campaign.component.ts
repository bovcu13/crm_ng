import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Calendar} from 'primeng/calendar';
import {HttpApiService} from "../../../../api/http-api.service";
import {ActivatedRoute} from "@angular/router";
import 'chartjs-plugin-datalabels';
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['./view-campaign.component.scss'],
})
export class ViewCampaignComponent {
  @ViewChild('startDate') startDate: Calendar | undefined;
  @ViewChild('endDate') endDate: Calendar | undefined;
  @ViewChild('chart') private chartRef!: ElementRef;
  //p-dropdown狀態
  status: any[] = [
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
  type: any[] = [
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
      name: "上級指派",
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

  campaign_opportunity: any[] = [
    {
      name: "資管電腦教室C220汰舊換新",
      account_name: "國立高雄科技大學",
      amount: 15200,
    },
    {
      name: "高效能電腦",
      account_name: "富豪",
      amount: 60000,
    },
  ]

  comfirmstatustable: any[] = [
    {
      type: "線索",
      status: "已傳送",
      name: "Gina",
      title: "主管",
      account_name: "國立高雄科技大學",
    },
    {
      type: "聯絡人",
      status: "已回應",
      name: "Tina",
      title: "經理",
      account_name: "富豪",
    },
  ]

//取得當筆行銷活動約資料
  GetOneCampaign: any;
  name: any;
  stage: any;
  GetOneStartDate: any;
  GetOneEndDate: any;

  getOneCampaignRequest(c_id: any) {
    this.HttpApi.getOneCampaignRequest(c_id).subscribe({
      next: res => {
        this.GetOneCampaign = res.body;
        this.name = res.body.name;
        this.stage = res.body.status;
        this.GetOneStartDate = this.formatDate2(res.body.start_date);
        this.GetOneEndDate = this.formatDate2(res.body.end_date);
        this.campaign_form.patchValue(res.body)
        this.campaign_form.patchValue({
          status: this.status.find((s: { name: any; }) => s.name === this.GetOneCampaign.status),
          type: this.type.find((s: { name: any; }) => s.name === this.GetOneCampaign.type),
          start_date: this.GetOneStartDate !== null ? new Date(this.GetOneStartDate) : null,
          end_date: this.GetOneEndDate !== null ? new Date(this.GetOneEndDate) : null,
        });
        if (this.GetOneCampaign.status === '已終止') {
          this.campaign_form.controls['status'].disable();
        }
        console.log(this.GetOneCampaign)
        console.log(this.GetOneStartDate)
      },
      error: error => {
        console.log(error);
      }
    });
  }

  // GET全部Account
  GetAllparent_campaign: any[] = [];
  selectedParent_id: string = '';
  search: any;

  getAllCampaignRequest() {
    this.HttpApi.getAllCampaignRequest(this.search, 1).subscribe({
      next: res => {
        this.GetAllparent_campaign = res.body.campaigns.map((campaign: any) => {
          return {
            label: campaign.name,
            value: campaign.campaign_id
          };
        });
      },
      error: error => {
        console.log(error);
      }
    });
  }

  //建立formgroup表單
  campaign_form: FormGroup;
  start_date!: Date;
  end_date!: Date;
  c_id: any;

  constructor(private fb: FormBuilder, private HttpApi: HttpApiService, private route: ActivatedRoute) {
    this.campaign_form = this.fb.group({
      campaign_id: [''],
      name: ['', [Validators.required]],
      salesperson_name: [''],
      salesperson_id: [''],
      is_enable: [false],
      status: [''],
      parent_campaign_id: [''],
      parent_campaign_name: [''],
      type: [''],
      start_date: [''],
      end_date: [''],
      member: [''],
      description: [''],
      sent: [0],
      budget_cost: [0],
      expected_responses: [0],
      actual_cost: [0],
      expected_income: [0],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    this.c_id = this.route.snapshot.paramMap.get('c_id')
    console.log("取到的o_id: " + this.c_id)
    this.getOneCampaignRequest(this.c_id);
    this.getAllCampaignRequest()
  }

  patchCampaignRequest(c_id: any): void {
    if (this.campaign_form.controls['name'].hasError('required')) {
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.campaign_form.controls['name'].markAsDirty();
      })
      return;
    }

    //驗證日期是否有效
    if (this.campaign_form.controls['end_date'].value !== null &&
      this.campaign_form.controls['start_date'].value > this.campaign_form.controls['end_date'].value) {
      this.campaign_form.controls['end_date'].setErrors({'incorrect': true});
      return;
    }
    //判斷父系行銷活動是否與行銷活動相同
    if (this.selectedParent_id === this.c_id) {
      this.campaign_form.controls['parent_campaign_id']
        .setErrors({Parent_idError: true});
      return
    } else {
      this.campaign_form.controls['parent_campaign_id'].value;
    }
    if (this.campaign_form.get('parent_campaign_id')?.value === '' ||
      this.campaign_form.get('parent_campaign_id')?.value === null) {
      this.campaign_form.patchValue({parent_campaign_id: "00000000-0000-4000-a000-000000000000"});
    } else {
      this.campaign_form.value.parent_campaign_id = this.selectedParent_id;
    }
    let start_date = new Date(this.campaign_form.get('start_date')?.value);
    let end_date = new Date(this.campaign_form.get('end_date')?.value);
    let body = {
      name: this.campaign_form.get('name')?.value,
      status: this.campaign_form.get('status')?.value.name,
      type: this.campaign_form.get('type')?.value.name,
      is_enable: this.campaign_form.get('is_enable')?.value,
      parent_campaign_id: this.campaign_form.get('parent_campaign_id')?.value,
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
      description: this.campaign_form.get('description')?.value,
      sent: this.campaign_form.get('sent')?.value,
      budget_cost: this.campaign_form.get('budget_cost')?.value,
      expected_responses: this.campaign_form.get('expected_responses')?.value,
      expected_income: this.campaign_form.get('expected_income')?.value,
      actual_cost: this.campaign_form.get('actual_cost')?.value,
    }

    this.HttpApi.patchCampaignRequest(c_id, body).subscribe(
      Request => {
        console.log(Request)
        if (Request.code === 200) {
          Swal.fire({
            title: '成功',
            text: "已儲存您的變更 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getOneCampaignRequest(c_id);
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          })
        }
      })
  }

  showAlertCancel() {
    Swal.fire({
      title: '取消',
      text: "已取消您的變更！",
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: false,
      reverseButtons: false,
      timer: 1000
    })
    this.getOneCampaignRequest(this.c_id);
  }

  //新增線索dialog
  addlead: boolean = false;

  addLead() {
    this.addlead = true;
    // this.getAllLeadRequest()
  }

  GetAlllead: any[] = [];

  // getAllLeadRequest() {
  //   this.HttpApi.getAllLeadRequest(1).subscribe(
  //     (res) => {
  //       this.GetAlllead = res.body.leads
  //       console.log(this.GetAlllead)
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

  //新增線索dialog
  addcontact: boolean = false;

  addContact() {
    this.addcontact = true;
    this.getAllContactRequest()
  }

  GetAllContact: any[] = [];
  contactSearch!: string;

  getAllContactRequest() {
    this.HttpApi.getAllContactRequest(this.contactSearch, 1).subscribe({
      next: res => {
        this.GetAllContact = res.body.contacts
        console.log(this.GetAllContact)
      },
      error: error => {
        console.log(error);
      }
    });
  }

  //確認新增 險所與聯絡人dialog
  addcomfirm: boolean = false;

  addComfirm() {
    this.addlead = false;
    this.addcontact = false;
    this.addcomfirm = true;
  }

  //p-dropdown狀態
  comfirmstatus = [
    {
      name: "已傳送",
      code: "sent",
    },
    {
      name: "已回應",
      code: "responded",
    }
  ];


  //如果父系行銷活動沒有被選擇
  parent_campaign_id(parent_campaign_id: string): any {
    if (parent_campaign_id == "00000000-0000-4000-a000-000000000000") {
      return '';
    }
    return parent_campaign_id;
  }

  //拿到到期日期轉格式
  formatDate2(dateString: string): any {
    if (dateString == "0001-01-01T00:00:00Z" || dateString == "1970-01-01T00:00:00Z" || dateString == "1970-01-01") {
      return null;
    }else {
      return dateString;
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

  data: any;
  options: any;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');

    this.data = {
      labels: ['已回應', '已傳送'],
      datasets: [
        {
          data: [12, 45],
          backgroundColor: [
            documentStyle.getPropertyValue('--blue-500'),
            documentStyle.getPropertyValue('--yellow-500'),
            documentStyle.getPropertyValue('--green-500')
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue('--blue-400'),
            documentStyle.getPropertyValue('--yellow-400'),
            documentStyle.getPropertyValue('--green-400')
          ]
        }
      ]
    };

    this.options = {
      cutout: '60%',
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      }
    };
  }

  getTotal(): number {
    let total = 0;
    for (const dataset of this.data.datasets) {
      for (const value of dataset.data) {
        total += value;
      }
    }
    return total;
  }

}



