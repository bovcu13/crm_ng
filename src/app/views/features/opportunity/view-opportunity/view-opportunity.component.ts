import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../../api/http-api.service";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-opportunity',
  templateUrl: './view-opportunity.component.html',
  styleUrls: ['./view-opportunity.component.scss'],
  providers: [MessageService]
})
export class ViewOpportunityComponent implements OnInit {
  name: string = "name"
  title: string = "title"
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
  opportunity_form: FormGroup;
  id: any;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private route: ActivatedRoute
    , private messageService: MessageService) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.opportunity_form = this.fb.group({
      opportunity_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      name: ['', [Validators.required]],
      close_date: ['', [Validators.required]],
      stage: ['', [Validators.required]],
      forecast_category: ['', [Validators.required]],
      amount: [''],
      owner: [''],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllAccountRequest()
    this.getOneOpportunity(this.id)
  }

  //取得商機歷程紀錄
  GetOpportunityHistoricalRecords: any[] = [];
  totalHistorical: any;

  getAllOpportunityHistoricalRecordsRequest(id: any) {
    this.HttpApi.getAllHistoricalRecordsRequest(20, 1, id).subscribe(request => {
        this.GetOpportunityHistoricalRecords = request.body.historical_records
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
        this.GetOpportunityHistoricalRecords = request.body.historical_records
        this.totalHistorical = request.body.total
        console.log(this.GetOpportunityHistoricalRecords)
        console.log(this.totalHistorical)
        this.loading = false;
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
        this.opportunity_form.controls['account_name'].disable();
        this.opportunity_form.patchValue(this.getData)
        this.opportunity_form.patchValue({
          stage: this.stage.find(s => s.name === this.getData.stage),
          forecast_category: this.forecast_category.find(s => s.name === this.getData.forecast_category),
          account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === this.getData.account_name),
          close_date: new Date(this.opportunity_form.value.close_date),
        });
        this.status = this.stage.find((s: { name: any; }) => s.name === this.getData.stage).name
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
        this.HttpApi.getOneOpportunityRequest(this.id).subscribe(
          request => {
            this.getData = request.body
            this.opportunity_form.patchValue({
              account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === this.getData.account_name),
            });
          }
        )
      },
      error: err => {
        console.log(err);
      }
    });
  }

  // 現在時間
  currentDate = new Date()

  patchOpportunity(id: any): void {
    if (this.opportunity_form.controls['account_name'].hasError('required') ||
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
        if (this.opportunity_form.controls['account_name'].hasError('required')) {
          this.opportunity_form.controls['account_name'].markAsDirty();
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
      name: this.opportunity_form.value?.name,
      stage: this.selectedStage?.name,
      forecast_category: this.selectedForecastCategory?.name,
      account_id: this.selectedAccountId,
      account_name: this.selectedAccountName,
      close_date: new Date(this.opportunity_form.value?.close_date),
      amount: parseInt(this.opportunity_form.value?.amount),
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

  selectedStage: any;

  stageValue(event
               :
               any
  ):
    void {
    this.selectedStage = this.stage.find((s) => s.name === event.value.name);
    this.opportunity_form.value.stage = this.selectedStage.name
  }

  selectedForecastCategory: any;

  forecast_categoryValue(event
                           :
                           any
  ):
    void {
    this.selectedForecastCategory = this.forecast_category.find((s) => s.name === event.value.name);
    this.opportunity_form.value.forecast_category = this.selectedForecastCategory.name
  }


  selectedAccountName!
    :
    string;
  selectedAccountId!
    :
    string;

  accountValue(event
                 :
                 any
  ):
    void {
    this.selectedAccountName = this.GetAllAccount.find((a: { label: any; }) => a.label === event.value.label);
    this.selectedAccountId = event.value.value
  }
}
