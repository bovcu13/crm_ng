import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import {Opportunity} from "../../../shared/models/opportunity";
import Swal from "sweetalert2";
import {Table} from "primeng/table";


@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss']
})
export class OpportunityComponent implements OnInit {
  getData!: Opportunity[];
  @ViewChild('dt') dt!: Table;
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

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.opportunity_form = this.fb.group({
      opportunity_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
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

  GetAllAccount!: any[];
  accountSearch!: string;

  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(this.accountSearch, 1).subscribe(
      (res) => {
        this.GetAllAccount = res.body.accounts.map((account: any) => {
          // console.log(account)
          return {
            label: account.name,
            value: account.account_id
          };
        });
        console.log(this.GetAllAccount)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit() {
    this.getAllAccountRequest();
  }

  // 搜尋關鍵字
  search: string = '';

  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  total!: number;
  loading: boolean = false;

  // 懶加載
  loadTable(e: any) {
    this.loading = true;
    // let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.HttpApi.getAllOpportunityRequest(this.search, 1, page, e).subscribe(
      request => {
        this.getData = request.body.opportunities;
        this.loading = false;
        console.log(this.getData)
        this.total = request.body.total;
      });
  }

  edit: boolean = false;
  dialogHeader!: string;

  showDialog(type: string, opportunity?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增商機';
      this.opportunity_form.reset();
      // 將"商機"設定為不可修改
      this.opportunity_form.controls['stage'].disable();
      this.opportunity_form.controls['account_name'].enable();
      this.opportunity_form.patchValue({
        status: this.stage.find(s => s.name === this.stage[1].name),
      });
    } else if (type === 'edit') {
      this.dialogHeader = '編輯商機';
      this.opportunity_form.controls['stage'].enable();
      this.opportunity_form.controls['account_name'].disable();
      this.opportunity_form.patchValue(opportunity);
      this.opportunity_form.patchValue({
        stage: this.stage.find(s => s.name === opportunity.stage),
        forecast_category: this.forecast_category.find(s => s.name === opportunity.forecast_category),
        account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === opportunity.account_name),
        close_date: new Date(this.opportunity_form.value.close_date),
      });
    }
  }

  getAllOpportunity(): void {
    this.HttpApi.getAllOpportunityRequest(this.search, 1).subscribe(
      request => {
        this.getData = request.body.opportunities;
        this.total = request.body.total;
      });
  }

  // 現在時間
  currentDate = new Date()

  postOpportunity(): void {
    if (this.opportunity_form.controls['account_name'].hasError('required') ||
      this.opportunity_form.controls['name'].hasError('required') ||
      this.opportunity_form.controls['stage'].hasError('required') ||
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
        this.edit = true;
      })
      return;
    }

    let body = {
      name: this.opportunity_form.value.name,
      stage: this.stage[1].name,
      forecast_category: this.selectedForecastCategory.name,
      account_id: this.selectedAccountId,
      account_name: this.selectedAccountName,
      close_date: new Date(this.opportunity_form.value.close_date),
      amount: parseInt(this.opportunity_form.value?.amount),
      created_by: "7f5443f8-e607-4793-8370-560b8b688a61",
      created_at: this.currentDate
    }

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
          this.getAllOpportunity()
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.edit = true;
          })
        }
      })
  }


  patchOpportunity(): void {
    if (this.opportunity_form.controls['account_name'].hasError('required') ||
      this.opportunity_form.controls['name'].hasError('required') ||
      this.opportunity_form.controls['stage'].hasError('required') ||
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
        this.edit = true;
      })
      return;
    }

    let id = this.opportunity_form.controls['opportunity_id'].value
    let body = {
      name: this.opportunity_form.value?.name,
      stage: this.selectedStage?.name,
      forecast_category: this.selectedForecastCategory?.name,
      account_id: this.selectedAccountId,
      account_name: this.selectedAccountName,
      close_date: new Date(this.opportunity_form.value?.close_date),
      amount: parseInt(this.opportunity_form.value?.amount),
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45",
      updated_at: this.currentDate
    }
    this.HttpApi.patchOpportunityRequest(id, body)
      .subscribe(request => {
        console.log(request)
        if (request.code === 200) {
          this.edit = false;
          Swal.fire({
            title: '成功',
            text: "已儲存您的變更 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllOpportunity()
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.edit = true;
          })
        }
      })
  }


  deleteOpportunity(id: any): void {
    Swal.fire({
      title: '確認刪除？',
      icon: 'warning',
      confirmButtonColor: '#6EBE71',
      cancelButtonColor: '#FF3034',
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.deleteOpportunityRequest(id).subscribe(request => {
          console.log(request)
          if (request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getAllOpportunity()
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
      } else {
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


  selectedAccountName!: string;
  selectedAccountId!: string;

  accountValue(event: any): void {
    this.selectedAccountName = this.GetAllAccount.find((a: { label: any; }) => a.label === event.value.label);
    this.selectedAccountId = event.value.value
    // console.log(this.selectedAccountId)
  }
}
