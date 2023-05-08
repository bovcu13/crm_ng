import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {Calendar} from 'primeng/calendar';
import {HttpApiService} from "../../../api/http-api.service";
import Swal from "sweetalert2";

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})

export class CampaignComponent {
  @ViewChild('startDate') startDate: Calendar | undefined;
  @ViewChild('endDate') endDate: Calendar | undefined;
  //table內容
  campaign: any[] = [
    {
      name: "1+1",
      enable: true,
      patrilineal_name: "15%off",
      type: "社交媒體",
      status: "策劃中",
      start_date: "2023-04-07",
      end_date: "2023-04-09",
      member: 3,
      owner: "王大明",
      sent: 80,
      budget_cost: 12000,
      expected_responses: "30",
      actual_cost: 12300,
      expected_income: 5000,
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
      member: 3,
      owner: "王大明",
      sent: 100,
      budget_cost: 11000,
      expected_responses: 50,
      actual_cost: 15000,
      expected_income: 8000,
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    },
  ];

  //搜尋功能
  filterText: any = '';

  filterCampaigns() {
    if (!this.filterText) {
      this.getAllCampaignRequest();
      return;
    }
    this.GetAllCampaign = this.GetAllCampaign.filter(campaign => {
      // 將所有要比對的欄位轉成小寫字母
      const name = campaign.name?.toLowerCase() || '';
      const status = campaign.status?.toLowerCase() || '';
      //const parent_campaign_id = campaign.status?.toLowerCase() || '';
      const type = campaign.type?.toLowerCase() || '';
      const start_date = campaign.start_date?.toLowerCase() || '';
      const end_date = campaign.end_date?.toLowerCase() || '';
      const description = campaign.description?.toLowerCase() || '';
      const owner = campaign.owner?.toLowerCase() || '';
      return (
        name.toLowerCase().includes(this.filterText) ||
        status.toLowerCase().includes(this.filterText) ||
        (campaign.is_enable ? 'true' : 'false').toLowerCase().includes(this.filterText.toLowerCase()) ||
        //campaign.parent_campaign_id.toLowerCase().includes(this.filterText) ||
        type.toLowerCase().includes(this.filterText) ||
        status.toLowerCase().includes(this.filterText) ||
        start_date.toLowerCase().includes(this.filterText) ||
        end_date.toLowerCase().includes(this.filterText) ||
        description.toLowerCase().includes(this.filterText) ||
        owner.toLowerCase().includes(this.filterText)
      );
    });
    console.log(this.GetAllCampaign)
  }

  ngOnInit() {

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

  //取得所有行銷活動資料
  GetAllCampaign: HttpApiService[] = [];
  GetAllparent_campaign: any[] = [];
  selectedParent_id: any;//儲存行銷活動父系id
  first = 0;
  totalRecords = 0;
  loading: boolean = true;

  getAllCampaignRequest(limit?: number, page?: number) {
    if (!page) {
      this.first = 0;
    }
    this.HttpApi.getAllCampaignRequest(limit, page).subscribe(
      (res) => {
        const campaigns = res.body.campaigns
        this.GetAllparent_campaign = campaigns.map((order: any) => {
          return {
            label: order.name,
            value: order.campaign_id,
          };
        });
        this.GetAllCampaign = res.body.campaigns
        this.GetAllCampaign = res.body.campaigns.map((order: any) => {
          const parent_campaign_id = this.parent_campaign_id(order.parent_campaign_id)
          const start_date = this.formatDate2(order.start_date)
          const end_date = this.formatDate2(order.end_date)
          const created_at = this.formatDate(order.created_at);
          const updated_at = this.formatDate(order.updated_at);
          return { ...order, parent_campaign_id, start_date, end_date, created_at, updated_at };
        });
        this.totalRecords = res.body.total;
        this.loading = false;
        console.log(this.GetAllCampaign)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  postCampaignRequest(): void {
    this.editType()//處理type的值，抓取name
    if (this.campaign_form.controls['name'].hasError('required')) {
      return;
    }
    //驗證日期是否有效
    if (this.campaign_form.controls['end_date'].value !== null &&
      this.campaign_form.controls['start_date'].value > this.campaign_form.controls['end_date'].value) {
      this.campaign_form.controls['end_date'].setErrors({ 'incorrect': true });
      return;
    }
    if (this.campaign_form.value.parent_campaign_id == null) {
      this.campaign_form.value.parent_campaign_id = "00000000-0000-4000-a000-000000000000"
    } else {
      this.campaign_form.value.parent_campaign_id = this.selectedParent_id;
    }
    let start_date = new Date(this.campaign_form.get('start_date')?.value);
    let end_date = new Date(this.campaign_form.get('end_date')?.value);
    let body = {
      name: this.campaign_form.value.name,
      status: this.campaign_form.value.status,
      parent_campaign_id: this.campaign_form.value.parent_campaign_id,
      type: this.campaign_form.value.type,
      is_enable: this.campaign_form.value.is_enable,
      description: this.campaign_form.value.description,
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
      sent: this.campaign_form.value.sent,
      budget_cost: this.campaign_form.value.budget_cost,
      expected_responses: this.campaign_form.value.expected_responses,
      expected_income: this.campaign_form.value.expected_income,
      actual_cost: this.campaign_form.value.actual_cost,
      created_by: "7f5443f8-e607-4793-8370-560b8b688a61",
    }
    this.edit = false
    Swal.fire({
      title: '確認新增？',
      icon: 'warning',
      confirmButtonColor: '#00D963', // 设置为绿色
      showCancelButton: false,
      confirmButtonText: '確認',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.postCampaignRequest(body).subscribe(Request => {
            console.log(Request)
            this.getAllCampaignRequest()
            this.edit = false;
          },
          error => {
            console.log(error);
          })
        Swal.fire({
          title: '成功',
          text: "已新增您的變更 :)",
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })
      }
    })
  }


  //建立formgroup表單
  campaign_form: FormGroup;
  start_date!: Date;
  end_date!: Date;

  constructor(private fb: FormBuilder, private HttpApi: HttpApiService) {
    this.campaign_form = this.fb.group({
      campaign_id: [''],
      name: ['', [Validators.required]],
      owner: [''],
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
  }

  //dialog方法
  edit: boolean = false;
  dialogHeader!: string;
  selectedStatus!: any;
  selectedType!: any;
  showedit = true;//判斷是否dialog為新增與編輯
  c_id: any;

  showDialog(type: string, campaign?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增行銷活動';
      this.campaign_form.reset()
      this.campaign_form.patchValue({status: this.status[0].name});
      this.showedit = false;
    } else if (type === 'edit') {
      console.log("campaign: " + JSON.stringify(campaign))
      this.dialogHeader = '編輯行銷活動';
      this.campaign_form.patchValue(campaign);
      this.selectedStatus = this.status.find(s => s.name === campaign.status);//編輯時將狀態傳至dialog中
      this.selectedType = this.type.find(s => s.name === campaign.type);//編輯時將狀態傳至dialog中
      this.showedit = true;
      this.c_id = campaign.campaign_id;
    }
  }

  patchCampaignRequest(c_id: any): void {
    if (this.campaign_form.controls['name'].hasError('required')) {
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
        .setErrors({ Parent_idError: true });
      return
    } else {
      this.campaign_form.controls['parent_campaign_id'].value;
    }
    this.editStatus()//處理status的值，抓取name
    this.editType()//處理type的值，抓取name
    if (this.campaign_form.get('parent_campaign_id')?.value === '' ||
    this.campaign_form.get('parent_campaign_id')?.value === null) {
      this.campaign_form.patchValue({ parent_campaign_id: "00000000-0000-4000-a000-000000000000" });
    } else {
      this.campaign_form.value.parent_campaign_id = this.selectedParent_id;
    }
    let start_date = new Date(this.campaign_form.get('start_date')?.value);
    let end_date = new Date(this.campaign_form.get('end_date')?.value);
    let body = {
      name: this.campaign_form.get('name')?.value,
      status: this.campaign_form.get('status')?.value,
      is_enable: this.campaign_form.get('is_enable')?.value,
      parent_campaign_id: this.campaign_form.get('parent_campaign_id')?.value,
      type: this.campaign_form.get('type')?.value,
      start_date: start_date.toISOString(),
      end_date: end_date.toISOString(),
      description: this.campaign_form.get('description')?.value,
      sent: this.campaign_form.get('sent')?.value,
      budget_cost: this.campaign_form.get('budget_cost')?.value,
      expected_responses: this.campaign_form.get('expected_responses')?.value,
      expected_income: this.campaign_form.get('expected_income')?.value,
      actual_cost: this.campaign_form.get('actual_cost')?.value,
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45"
    }
    this.edit = false
    Swal.fire({
      title: '確認更改？',
      icon: 'warning',
      confirmButtonColor: '#00D963', // 设置为绿色
      showCancelButton: false,
      confirmButtonText: '確認',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.patchCampaignRequest(c_id, body).subscribe(
          Request => {
            console.log(Request)
            this.edit = false;
            this.getAllCampaignRequest()
          });
          Swal.fire({
          title: '成功',
          text: "已新增您的變更 :)",
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })
      }
    })
  }

  deleteCampaignRequest(c_id: any): void {
    Swal.fire({
      title: '確認刪除？',
      icon: 'warning',
      confirmButtonColor: '#00D963',
      cancelButtonColor: '#d90000',
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '成功',
          text: "已儲存您的變更 :)",
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })
        this.HttpApi.deleteCampaignRequest(c_id).subscribe(Request => {
          console.log(Request)
          this.getAllCampaignRequest()
        })
      }else{
        Swal.fire({
          title: '取消',
          text: "已取消您的變更！",
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: false,
          reverseButtons: false,
          timer: 1000
        })
      }
    })
  }

  showAlertCancel() {
    this.edit = false
    Swal.fire({
      title: '取消',
      text: "已取消您的變更！",
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: false,
      reverseButtons: false,
      timer: 1000
    })
  }

  //處理status的值
  editStatus(): void {
    //判斷selectedStatus是否有值，若有值則取出name屬性
    let statusName = this.selectedStatus ? this.selectedStatus.name : "";
    //將statusName更新到表單中
    this.campaign_form.patchValue({ status: statusName });
  }

  //處理type的值
  editType(): void {
    //判斷selectedStatus是否有值，若有值則取出name屬性
    let TypeName = this.selectedType ? this.selectedType.name : "";
    //將statusName更新到表單中
    this.campaign_form.patchValue({ type: TypeName });
  }

  //懶加載
  loadTable(e: any) {
    this.loading = true;
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.getAllCampaignRequest(limit, page);
  }

  //如果父系行銷活動沒有被選擇
  parent_campaign_id(parent_campaign_id: string): any {
    if (parent_campaign_id == "00000000-0000-4000-a000-000000000000") {
      return '';
    }
    return parent_campaign_id;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + (date.getDate())).slice(-2);
    const hour = ("0" + (date.getHours())).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }

  //拿到到期日期轉格式
  formatDate2(dateString2: string): any {
    if (dateString2 == "0001-01-01T00:00:00Z" || dateString2 == "1970-01-01T00:00:00Z") {
      return null;
    } else {
      const date = new Date(dateString2);
      const date1 = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
      return date1.toISOString().slice(0, 10);
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

}
