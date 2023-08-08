import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../../api/http-api.service";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";
import Swal from "sweetalert2";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-view-opportunity',
  templateUrl: './view-opportunity.component.html',
  styleUrls: ['./view-opportunity.component.scss'],
  providers: [MessageService, DatePipe]
})
export class ViewOpportunityComponent implements OnInit {
  name: string = "name"
  title: string = "title"
  stage: any[] = [
    {
      name: "資格評估",
      // code: "qualification"
    },
    {
      name: "需求分析",
      // code: "needs_analysis"
    },
    {
      name: "提案",
      // code: "potential"
    },
    {
      name: "談判",
      // code: "negotiation"
    },
    {
      name: "已結束",
      // code: "closed"
    }
  ]
  forecast_category: any[] = [
    {
      name: "商機被遺漏",
      // "code": "omitted"
    },
    {
      name: "進行中",
      // "code": "pipeline"
    },
    {
      name: "最佳情況",
      // "code": "best_case"
    },
    {
      name: "承諾",
      // "code": "commit"
    },
    {
      name: "結案",
      // "code": "closed"
    }
  ]
  quoteStatus: any[] = [
    {
      name: "草稿",
      // code: "draft",
      boolean: false
    },
    {
      name: "需要審查",
      // code: "need_review",
      boolean: false
    },
    {
      name: "審查中",
      // code: "in_review",
      boolean: false
    },
    {
      name: "已批准",
      // code: "approved",
      boolean: false
    },
    {
      name: "已報價",
      // code: "presented",
      boolean: false
    },
    {
      name: "客戶簽回",
      // code: "accepted",
      boolean: false
    }
  ]
  opportunity_form: FormGroup;
  quote_form: FormGroup;
  id: any;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private route: ActivatedRoute
    , private messageService: MessageService, private datePipe: DatePipe) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.opportunity_form = this.fb.group({
      opportunity_id: ['', [Validators.required]],
      account_id: [''],
      lead_id: [''],
      name: ['', [Validators.required]],
      close_date: ['', [Validators.required]],
      stage: ['', [Validators.required]],
      forecast_category: ['', [Validators.required]],
      amount: [''],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
    this.quote_form = this.fb.group({
      quote_id: [''],
      code: [''],
      name: ['', [Validators.required]],
      opportunity_id: ['', [Validators.required]],
      is_syncing: [false],
      account_id: ['', [Validators.required]],
      quoteStatus: [''],
      description: [''],
      expiration_date: [''],
      total_price: [''],
      tax: [0],
      discount: [''],
      shipping_and_handling: [0],
      sub_total: [''],
      grand_total: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

  ngOnInit() {
    this.getAllAccountSelection();
    this.getOneOpportunity(this.id);
    this.getAllLeadSelection();
  }

  //取得商機歷程紀錄
  GetOpportunityHistoricalRecords: any[] = [];
  totalHistorical: any;

  getAllOpportunityHistoricalRecordsRequest(id: any) {
    this.HttpApi.getAllHistoricalRecordsRequest(20, 1, id).subscribe(request => {
        this.GetOpportunityHistoricalRecords = request.body.historical_records
        this.totalHistorical = request.body.total
        this.GetOpportunityHistoricalRecords.forEach((record) => {
          if (record.content.startsWith('修改商機結束日期為')) {
            const formattedDate = this.datePipe.transform(record.value, 'yyyy-MM-dd');
            record.value = formattedDate || record.value;
          }
        });
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
        this.GetOpportunityHistoricalRecords = request.body.historical_records
        this.totalHistorical = request.body.total
        console.log(this.GetOpportunityHistoricalRecords)
        console.log(this.totalHistorical)
        this.loading = false;
        this.GetOpportunityHistoricalRecords.forEach((record) => {
          if (record.content.startsWith('修改商機結束日期為')) {
            const formattedDate = this.datePipe.transform(record.value, 'yyyy-MM-dd');
            record.value = formattedDate || record.value;
          }
        });
      },
      error: err => {
        console.log(err.status)
      }
    });
  }

  getData: any;
  status!: string;

  getOneOpportunity(id: any): void {
    this.HttpApi.getOneOpportunityRequest(id).subscribe(
      request => {
        this.getData = request.body
        console.log(this.getData)
        this.opportunity_form.controls['account_id'].disable();
        this.opportunity_form.controls['lead_id'].disable();
        this.opportunity_form.patchValue(this.getData)
        const account = {
          account_id: this.getData.account_id,
          name: this.getData.account_name
        };
        const lead = {
          lead_id: this.getData.lead_id,
          description: this.getData.lead_description
        };
        this.opportunity_form.patchValue({
          stage: this.stage.find(stage => stage.name === this.getData.stage),
          forecast_category: this.forecast_category.find(forecast_category => forecast_category.name === this.getData.forecast_category),
          close_date: new Date(this.opportunity_form.value.close_date),
          account_id: account,
          // 要先判斷lead_id有沒有值，否則會回傳 { lead_id: '', description: ''}
          lead_id: this.getData.lead_id ? lead : '',
        });
        this.status = this.stage.find((status: { name: any; }) => status.name === this.getData.stage).name
      }
    )
  }

  // 取得帳戶下拉選項
  getAccounts: any[] = [];

  getAllAccountSelection() {
    this.HttpApi.getAllAccountSelection().subscribe({
      next: request => {
        this.getAccounts = request.body.accounts
        console.log(this.getAccounts)
      },
      error: err => {
        console.log(err);
      }
    });
  }

  // 取得帳戶下拉選項
  getLeads: any[] = [];

  getAllLeadSelection() {
    this.HttpApi.getAllLeadSelection().subscribe({
      next: request => {
        this.getLeads = request.body.leads
        console.log(this.getLeads)
      },
      error: err => {
        console.log(err);
      }
    });
  }

  // 現在時間
  currentDate = new Date()

  patchOpportunity(id: any): void {
    if (this.opportunity_form.controls['account_id'].hasError('required') ||
      this.opportunity_form.controls['name'].hasError('required') ||
      this.opportunity_form.controls['stage'].hasError('required') ||
      this.opportunity_form.controls['forecast_category'].hasError('required') ||
      this.opportunity_form.controls['close_date'].hasError('required')
    ) {
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.opportunity_form.controls['account_id'].hasError('required')) {
          this.opportunity_form.controls['account_id'].markAsDirty();
        }
        if (this.opportunity_form.controls['name'].hasError('required')) {
          this.opportunity_form.controls['name'].markAsDirty();
        }
        if (this.opportunity_form.controls['stage'].hasError('required')) {
          this.opportunity_form.controls['stage'].markAsDirty();
        }
        if (this.opportunity_form.controls['forecast_category'].hasError('required')) {
          this.opportunity_form.controls['forecast_category'].markAsDirty();
        }
        if (this.opportunity_form.controls['close_date'].hasError('required')) {
          this.opportunity_form.controls['close_date'].markAsDirty();
        }
      })
      return;
    }
    let body = {
      name: this.opportunity_form.controls['name'].value,
      stage: this.opportunity_form.controls['stage'].value.name,
      forecast_category: this.opportunity_form.controls['forecast_category'].value.name,
      account_id: this.opportunity_form.controls['account_id'].value.account_id,
      lead_id: this.opportunity_form.controls['lead_id'].value?.lead_id,
      close_date: new Date(this.opportunity_form.controls['close_date'].value),
      amount: parseInt(this.opportunity_form.controls['amount']?.value),
    }
    this.HttpApi.patchOpportunityRequest(id, body)
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
          this.getOneOpportunity(this.id)
          this.getAllOpportunityHistoricalRecordsRequest(this.id)
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          })
        }
      });
  }

  quoteDialog: boolean = false;

  showQuote() {
    this.quoteDialog = true
    this.quote_form.controls['quoteStatus'].disable()
    this.quote_form.patchValue({quoteStatus: this.quoteStatus.find(s => s.name === this.quoteStatus[0].name),});
  }

  //POST 一筆quote
  postQuoteRequest(): void {
    if (this.quote_form.controls['name'].hasError('required') ||
      this.quote_form.controls['opportunity_id'].hasError('required')) {
      this.quoteDialog = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.quote_form.controls['name'].hasError('required')) {
          this.quote_form.controls['name'].markAsDirty();
        }
        if (this.quote_form.controls['opportunity_id'].hasError('required')) {
          this.quote_form.controls['opportunity_id'].markAsDirty();
        }
        this.quoteDialog = true;
      })
      return;
    }

    if (this.quote_form.controls['name'].hasError('required')
      || this.quote_form.controls['opportunity_id'].hasError('required')) {
      return;
    }
    let body = {
      name: this.quote_form.value.name,
      account_id: this.opportunity_form.controls['account_name'].value.value,
      expiration_date: new Date(this.quote_form.value.expiration_date),
      opportunity_id: this.id,
      shipping_and_handling: this.quote_form.value.shipping_and_handling,
      status: '草稿',
      tax: this.quote_form.value.tax,
      description: this.quote_form.value.description,
    }
    console.log(body)
    this.HttpApi.postQuoteRequest(body).subscribe({
      next: Request => {
        console.log(Request)
        this.quoteDialog = false;
        if (Request.code === 200) {
          Swal.fire({
            title: '成功',
            text: "已儲存您的資料 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.quoteDialog = true;
          })
        }
      },
      error: error => {
        console.log(error);
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
    this.getOneOpportunity(this.id)
  }

}
