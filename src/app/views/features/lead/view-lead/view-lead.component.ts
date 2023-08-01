import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpApiService} from "../../../../api/http-api.service";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-lead',
  templateUrl: './view-lead.component.html',
  styleUrls: ['./view-lead.component.scss'],
})
export class ViewLeadComponent implements OnInit {
  name: string = "name"
  title: string = "title"
  edit: boolean = false;
  status: any[] = [
    {
      name: "不明確",
      code: "Unqualified",
    },
    {
      name: "新線索",
      code: "New",
    },
    {
      name: "評估中",
      code: "Working",
    },
    {
      name: "發展中",
      code: "Nurturing",
    },
    {
      name: "已轉換",
      code: "Closed",
    }
  ]

  source: any = [
    {
      name: "廣告",
      code: "advertising"
    },
    {
      name: "推薦",
      code: "referral"
    },
    {
      name: "直接訪問",
      code: "direct_traffic"
    },
    {
      name: "網路搜尋",
      code: "web_search"
    },
    {
      name: "朋友推薦",
      code: "friend_referral"
    }
  ]

  industry_id: any = [
    {
      name: "教育",
      code: "education"
    },
    {
      name: "金融服務",
      code: "financial_services"
    },
    {
      name: "醫療保健",
      code: "healthcare"
    },
    {
      name: "零售",
      code: "retail"
    },
    {
      name: "科技",
      code: "technology"
    }
  ]

  rating: any = [
    {
      name: "很有可能成交",
      code: "Hot"
    },
    {
      name: "可能性不明確",
      code: "Warm"
    },
    {
      name: "很有可能不成交",
      code: "Cold"
    }
  ]

  industry: any[] = [
    {
      "name": "零售業",
      "code": "retail"
    },
    {
      "name": "技術",
      "code": "technology "
    },
    {
      "name": "通訊",
      "code": "telecommunications"
    }
  ]

  // 商機選項
  stage: any[] = [
    {
      name: "資格評估",
      code: "qualification"
    },
    {
      name: "需求分析",
      code: "needs_analysis "
    },
    {
      name: "提案",
      code: "potential"
    },
    {
      name: "談判",
      code: "negotiation"
    },
    {
      name: "已結束",
      code: "closed"
    }
  ]
  forecast_category: any[] = [
    {
      "name": "被遺漏",
      "code": "omitted"
    },
    {
      "name": "進行中",
      "code": "pipeline"
    },
    {
      "name": "最佳情況",
      "code": "best_case"
    },
    {
      "name": "承諾",
      "code": "commit"
    },
    {
      "name": "結案",
      "code": "closed"
    }
  ]

  //表格最後下拉控制選項
  lead_form!: FormGroup;
  opportunity_form: FormGroup;
  id: any;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.lead_form = this.fb.group({
      lead_id: ['', [Validators.required]],
      name: [''],
      status: ['', [Validators.required]],
      account_id: ['', [Validators.required]],
      description: ['', [Validators.required]],
      title: [''],
      phone_number: [''],
      cell_phone: [''],
      email: [''],
      line: [''],
      source: [''],
      industry_id: [''],
      rating: ['',],
      owner: [''],
      account_name: [''],
      created_by: ['', [Validators.required]],
      created_at: [''],
      updated_by: ['', [Validators.required]],
      updated_at: [''],
    });
    this.opportunity_form = this.fb.group({
      opportunity_id: ['', [Validators.required]],
      account_name: [''],
      account_id: [''],
      lead_id: [''],
      description: [''],
      name: ['', [Validators.required]],
      close_date: ['', [Validators.required]],
      stage: ['', [Validators.required]],
      forecast_category: ['', [Validators.required]],
      amount: [''],
      owner: [''],
      created_by: [''],
      created_at: [''],
      updated_by: [''],
      updated_at: [''],
    });
  }

  // 放沒有"已結束"階段下拉選單
  filteredStatus: any[] = [];
  which: any[] = [];

  ngOnInit(): void {
    this.getAllAccountRequest();
    this.getOneLead(this.id);
    // 過濾"已結束"
    this.filteredStatus = this.status.filter(option => option.code !== 'Closed');
    this.which = this.filteredStatus
  }

  //取得線索歷程紀錄
  GetLeadHistoricalRecords: any[] = [];
  totalHistorical: any;

  getAllLeadHistoricalRecordsRequest(id: any) {
    this.HttpApi.getAllHistoricalRecordsRequest(20, 1, id).subscribe(request => {
        this.GetLeadHistoricalRecords = request.body.historical_records
        this.totalHistorical = request.body.total
      }
    )
  }

  loading: boolean = false;

  // 懶加載
  loadTable(e: any) {
    this.loading = true;
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.HttpApi.getAllHistoricalRecordsRequest(limit, page, this.id).subscribe({
      next: request => {
        this.GetLeadHistoricalRecords = request.body.historical_records
        this.totalHistorical = request.body.total
        console.log(this.GetLeadHistoricalRecords)
        console.log(this.totalHistorical)
        this.loading = false;
      },
      error: err => {
        console.log(err.status)
      }
    });
  }

  getData: any;
  status_value!: string;

  getOneLead(id: any): void {
    this.HttpApi.getOneLeadRequest(id).subscribe(
      request => {
        this.getData = request.body
        console.log(this.getData)
        this.lead_form.controls['account_name'].disable();
        // 若線索狀態為"已轉換"，不能更改
        if (this.status.find((s: { name: any; }) => s.name === this.getData.status).name === "已轉換") {
          // 將下拉選單資料改為有以轉換之資料，修正patchValue status bug
          this.which = this.status;
          this.lead_form.controls['status'].disable();
        }
        this.lead_form.patchValue(this.getData)
        this.lead_form.patchValue({
          status: this.status.find((s: { name: any; }) => s.name === this.getData.status),
          source: this.source.find((s: { name: any; }) => s.name === this.getData.source),
          rating: this.rating.find((s: { name: any; }) => s.name === this.getData.rating),
          account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === this.getData.account_name)
        });
        this.status_value = this.status.find((s: { name: any; }) => s.name === this.getData.status).name
      }
    )
  }

  GetAllAccount: any[] = [];
  accountSearch!: string;

  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(this.accountSearch, 1).subscribe({
      next: request => {
        this.GetAllAccount = request.body.accounts.map((account: any) => {
          // console.log(account);
          return {
            label: account.name,
            value: account.account_id
          };
        });
        this.GetAllAccount = [
          ...this.GetAllAccount.map((account: any) => {
            return {
              label: account.label,
              value: account.value
            };
          })
        ];
        console.log(this.GetAllAccount)
        this.HttpApi.getOneLeadRequest(this.id).subscribe(
          request => {
            this.getData = request.body
            this.lead_form.patchValue({
              account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === this.getData.account_name)
            });
          }
        )
      },
      error: err => {
        console.log(err);
      }
    });
  }

  showDialog(): void {
    this.edit = true;
    this.opportunity_form.controls['account_name'].disable();
    this.opportunity_form.controls['description'].disable();
    this.opportunity_form.controls['stage'].disable();
    this.opportunity_form.patchValue(this.getData)
    this.opportunity_form.patchValue({
      account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === this.getData.account_name)
    });
  }


  // 現在時間
  currentDate = new Date()

  patchLead() {
    if (this.lead_form.controls['status'].hasError('required') ||
      this.lead_form.controls['description'].hasError('required')) {
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.lead_form.controls['status'].hasError('required')) {
          this.lead_form.controls['status'].markAsDirty();
        }
        if (this.lead_form.controls['description'].hasError('required')) {
          this.lead_form.controls['description'].markAsDirty();
        }
      })
      return;
    }

    let body = {
      description: this.lead_form.controls['description'].value,
      status: this.selectedStatus?.name,
      source: this.selectedSource?.name,
      rating: this.selectedRating?.name,
    }
    this.HttpApi.patchLeadRequest(this.id, body)
      .subscribe({
        next: request => {
          console.log(request)
          if (request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已儲存您的變更 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getOneLead(this.id);
            this.getAllLeadHistoricalRecordsRequest(this.id)
          } else {
            Swal.fire({
              title: '失敗',
              text: "請確認資料是否正確 :(",
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            })
          }
        },
        error: err => {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          })
          console.log(err)
        }
      });
  }

  // 轉換成商機
  postOpportunity(): void {
    let data = {
      status: this.status[4].name,
    }
    this.HttpApi.patchLeadRequest(this.id, data)
      .subscribe(request => {
        console.log(request)
        if (request.code === 200) {
          Swal.fire({
            title: '成功',
            text: "已儲存您的變更 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getOneLead(this.id);
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
    if (
      this.opportunity_form.controls['name'].hasError('required') ||
      this.opportunity_form.controls['forecast_category'].hasError('required') ||
      this.opportunity_form.controls['close_date'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.opportunity_form.controls['name'].hasError('required')) {
          this.opportunity_form.controls['name'].markAsDirty();
        }
        if (this.opportunity_form.controls['forecast_category'].hasError('required')) {
          this.opportunity_form.controls['forecast_category'].markAsDirty();
        }
        if (this.opportunity_form.controls['close_date'].hasError('required')) {
          this.opportunity_form.controls['close_date'].markAsDirty();
        }
        this.edit = true;
      })
      console.log("這")
      return;
    }

    let body = {
      name: this.opportunity_form.value.name,
      stage: this.stage[1].name,
      forecast_category: this.selectedForecastCategory.name,
      account_id: this.getData.account_id,
      close_date: new Date(this.opportunity_form.value.close_date),
      lead_id: this.id,
      amount: parseInt(this.opportunity_form.value?.amount),
    }
    console.log(body)

    this.HttpApi.postOpportunityRequest(body)
      .subscribe(request => {
        console.log(request)
        if (request.code === 200) {
          this.edit = false;
          Swal.fire({
            title: '成功',
            text: "已儲存您的資料 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getOneLead(this.id);
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.edit = true;
            console.log("這")
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
    this.getOneLead(this.id);
  }

  selectedStatus: any;

  statusValue(event: any): void {
    this.selectedStatus = this.status.find((s: { name: any; }) => s.name === event.value.name);
    this.lead_form.value.status = this.selectedStatus.name
  }

  selectedAccountName!: string;
  selectedAccountId!: string;

  accountValue(event: any): void {
    this.selectedAccountName = this.GetAllAccount.find((a: { label: any; }) => a.label === event.value.label);
    this.selectedAccountId = event.value.value
  }

  selectedSource: any;

  sourceValue(event: any): void {
    this.selectedSource = this.source.find((s: { name: any; }) => s.name === event.value.name);
    this.lead_form.value.source = this.selectedSource.name
  }

  selectedRating: any;

  ratingValue(event: any): void {
    this.selectedRating = this.rating.find((s: { name: any; }) => s.name === event.value.name);
    this.lead_form.value.rating = this.selectedRating.name
  }

  selectedStage: any;

  stageValue(event: any): void {
    this.selectedStage = this.stage.find((s) => s.name === event.value.name);
    this.opportunity_form.value.stage = this.selectedStage.name
  }

  selectedForecastCategory: any;

  forecast_categoryValue(event: any): void {
    this.selectedForecastCategory = this.forecast_category.find((s) => s.name === event.value.name);
    this.opportunity_form.value.forecast_category = this.selectedForecastCategory.name
  }

}




