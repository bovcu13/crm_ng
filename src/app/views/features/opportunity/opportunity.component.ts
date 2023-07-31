import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import {Opportunity} from "../../../shared/models/opportunity";
import Swal from "sweetalert2";
import {Table} from "primeng/table";
import {MenuItem} from "primeng/api";


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
      code: "qualification",
      boolean: false
    },
    {
      name: "需求分析",
      code: "needs_analysis ",
      boolean: false
    },
    {
      name: "提案",
      code: "potential",
      boolean: false
    },
    {
      name: "談判",
      code: "negotiation",
      boolean: false
    },
    {
      name: "已結束",
      code: "closed",
      boolean: false
    }
  ]
  forecast_category: any[] = [
    {
      "name": "商機被遺漏",
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
      account_name: [''],
      account_id: [''],
      lead_name: [''],
      lead_id: [''],
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
    this.getAllAccountRequest(1);
    this.getAllLeadRequest(1);
    console.log(this.opportunity_form.controls['lead_id'].value)
  }

  // 新增商機方式
  add_opportunity: MenuItem[] = [
    {
      label: "由 帳戶 新增",
      icon: "pi pi-user",
      command: () => {
        this.showDialog('add-account');
        this.dialogHeader = "由 帳戶 新增"
      }
    },
    {
      label: "由 線索 新增",
      icon: "pi pi-search",
      command: () => {
        this.showDialog('add-lead');
        this.dialogHeader = "由 線索 新增"
      }
    },
  ]

  // 搜尋關鍵字
  search: string = '';

  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  totalRecords!: number;
  loading: boolean = false;
  rowsPerPageOptions: number[] = [10, 20];
  selectedRows: number = 10;

  // 懶加載
  loadTable(e: any) {
    this.loading = true;
    this.selectedRows = e.rows
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.HttpApi.getAllOpportunityRequest(this.search, 1, page, limit, e).subscribe(
      request => {
        this.getData = request.body.opportunities;
        this.loading = false;
        console.log(this.getData)
        this.totalRecords = request.body.total;
      });
  }

  // 點擊表頭狀態列執行搜尋
  toggleStageFilter(index: number) {
    // 若已被點擊過則取消 filter
    if (this.stage[index].boolean) {
      this.getAllOpportunity();
      this.stage[index].boolean = false
    }
    // 將所有狀態值改為 false，並且將點擊狀態改為true、執行該狀態 filter
    else {
      this.dt.filterGlobal(this.stage[index].name, 'contains');
      for (let i in this.stage) {
        this.stage[i].boolean = false
      }
      this.stage[index].boolean = true
    }
    // console.log(this.status)
  }

  edit: boolean = false;
  dialogHeader!: string;

  showDialog(type: string, opportunity?: any): void {
    this.edit = true;
    if (type === 'add-account') {
      this.opportunity_form.reset();
      // 將"商機"設定為不可修改
      this.opportunity_form.controls['stage'].disable();
      this.opportunity_form.controls['account_name'].enable();
      this.opportunity_form.patchValue({
        status: this.stage.find(s => s.name === this.stage[1].name),
      });
    } else if (type === 'add-lead') {
      this.opportunity_form.reset();
      // 將"商機"設定為不可修改
      this.opportunity_form.controls['stage'].disable();
      this.opportunity_form.controls['account_name'].disable();
      this.opportunity_form.controls['lead_name'].enable();
      this.opportunity_form.patchValue({
        status: this.stage.find(s => s.name === this.stage[1].name),
      });
    } else if (type === 'edit') {
      this.dialogHeader = '編輯商機';
      console.log(this.opportunity_form.controls['lead_id'].value)
      this.opportunity_form.controls['stage'].enable();
      this.opportunity_form.controls['account_name'].disable();
      this.opportunity_form.controls['lead_name'].disable();
      this.opportunity_form.patchValue(opportunity);
      this.opportunity_form.patchValue({
        lead_name:this.GetAllLead.find((a: { value: any; }) => a.value === opportunity.lead_id),
        stage: this.stage.find(s => s.name === opportunity.stage),
        forecast_category: this.forecast_category.find(s => s.name === opportunity.forecast_category),
        account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === opportunity.account_name),
        close_date: new Date(this.opportunity_form.value.close_date),
      });
    }
  }

  // 取得帳戶 option
  GetAllAccount: any[] = [];
  accountSearch!: string;
  accountTotal!: number;
  accountPage: number = 1;
  accountLimit: number = 20;
  first: number = 0;
  last: number = 12;

  // 取得 account fuction
  getAllAccountRequest(page: number) {
    this.HttpApi.getAllAccountRequest(this.accountSearch, 1, page, this.accountLimit).subscribe({
      next: request => {
        this.accountTotal = request.body.total
        const newAccounts = request.body.accounts.map((account: any) => {
          // console.log(account)
          return {
            label: account.name,
            value: account.account_id
          };
        });
        // 將新請求到的資料加入 GetAllAccount 陣列
        this.GetAllAccount = [...this.GetAllAccount, ...newAccounts];
        console.log(this.GetAllAccount)
      },
      error: err => {
        console.log(err);
      }
    });
  }

  // 帳戶懶加載
  loadAccount(e: any) {
    // console.log(e)
    // 滾輪往下滑
    if (e.first > this.first || e.last > this.last) {
      // console.log('++')
      if (e.last % this.accountLimit === 0 && this.accountPage < (Math.ceil(this.accountTotal / this.accountLimit))) {
        this.accountPage++;
        this.getAllAccountRequest(this.accountPage)
        console.log(this.accountPage)
      }
    }
    // 滾輪往上滑
    else if (e.first < this.first || e.last < this.last) {
      // console.log('--')
    }
  }

  // 取得線索 option
  GetAllLead: any[] = [];
  leadTotal!: number;
  leadtPage: number = 1;
  leadLimit: number = 20;

  // 取得 lead fuction
  getAllLeadRequest(page: number) {
    this.HttpApi.getAllLeadRequest(this.accountSearch, 1, page, this.leadLimit).subscribe({
      next: request => {
        this.leadTotal = request.body.total
        const newLeads = request.body.leads.map((lead: any) => {
          return {
            label: lead.description,
            value: lead.lead_id
          };
        });
        // 將新請求到的資料加入 GetAllAccount 陣列
        this.GetAllLead = [...this.GetAllLead, ...newLeads];
        console.log(this.GetAllLead)
      },
      error: err => {
        console.log(err);
      }
    });
  }

  getAllOpportunity(): void {
    this.HttpApi.getAllOpportunityRequest(this.search, 1, 1, this.selectedRows).subscribe(
      request => {
        this.getData = request.body.opportunities;
        this.totalRecords = request.body.total;
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
      account_id: this.opportunity_form.controls['account_name'].value.value,
      account_name: this.opportunity_form.controls['account_name'].value.label,
      lead_id: this.opportunity_form.controls['lead_id'].value,
      close_date: new Date(this.opportunity_form.value.close_date),
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

  leadValue(event: any): void {
    this.opportunity_form.patchValue({
      lead_id: event.value.value
    })
    this.HttpApi.getOneLeadRequest(event.value.value).subscribe({
      next: request => {
        console.log(request)
        this.opportunity_form.patchValue({
          account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === request.body.account_name),
        })
        console.log(this.opportunity_form.controls['account_name'].value)
      },
      error: err => {
        console.log(err)
      }
    });
  }
}
