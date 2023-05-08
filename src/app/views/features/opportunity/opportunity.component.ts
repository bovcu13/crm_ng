import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LazyLoadEvent} from "primeng/api";
import {HttpApiService} from "../../../api/http-api.service";
import {Opportunity} from "../../../shared/models/opportunity";
import Swal from "sweetalert2";


@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss']
})
export class OpportunityComponent implements OnInit {
  filteredOpportunity: any[] = [];
  getData!: Opportunity[];
  opportunity: any[] = [
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-12",
      "stage": "已結束",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-12",
      "stage": "談判",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-12",
      "stage": "提案",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-12",
      "stage": "需求分析",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-11",
      "stage": "資格評估",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
  ];
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

  account: any = [
    {
      name: "公司A",
      code: "company_a"
    },
    {
      name: "公司B",
      code: "company_b"
    },
    {
      name: "公司C",
      code: "company_c"
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

  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(1).subscribe(
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

  filterText: any = '';

  filtered() {
    if (this.filterText === '') {
      this.filteredOpportunity = this.opportunity;
    } else {
      this.filteredOpportunity = this.opportunity.filter(opportunity => {
        return (
          opportunity.stage.toLowerCase().includes(this.filterText.toLowerCase()) ||
          opportunity.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          opportunity.account_name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          opportunity.close_date.toLowerCase().includes(this.filterText.toLowerCase()) ||
          opportunity.owner.toLowerCase().includes(this.filterText.toLowerCase())
        );
      });
    }
    console.log(this.filteredOpportunity)
  }

  ngOnInit() {
    this.filteredOpportunity = this.opportunity;
    this.getAllAccountRequest();
  }

  total!: number;

  // 懶加載
  loadPostsLazy(event: LazyLoadEvent) {
    const page = (event.first! / event.rows!) + 1;
    this.HttpApi.getAllOpportunityRequest(page).subscribe(request => {
      this.getData = request.body.opportunities;
      this.total = request.body.total
      console.log(this.getData);
      // console.log(this.total)
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
      this.opportunity_form.patchValue({
        status: this.stage.find(s => s.name === this.stage[1].name),
      });
    } else if (type === 'edit') {
      this.dialogHeader = '編輯商機';
      this.opportunity_form.controls['stage'].enable();
      this.opportunity_form.patchValue(opportunity);
      this.opportunity_form.patchValue({
        stage: this.stage.find(s => s.name === opportunity.stage),
        forecast_category: this.forecast_category.find(s => s.name === opportunity.forecast_category),
        account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === opportunity.account_name),
        close_date: new Date(this.opportunity_form.value.close_date),
      });
    }
  }

  // 現在時間
  currentDate = new Date()

  postOpportunity(): void {
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
    this.edit = false
    Swal.fire({
      title: '確認新增？',
      icon: 'warning',
      confirmButtonColor: '#6EBE71',
      showCancelButton: false,
      confirmButtonText: '確認',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.postOpportunityRequest(body)
          .subscribe(request => {
            console.log(request)
            let event: LazyLoadEvent = {
              first: 0,
              rows: 10,
              sortField: undefined,
              sortOrder: undefined,
              multiSortMeta: undefined,
              filters: undefined,
              globalFilter: undefined,
            };
            if (request.code === 200) {
              Swal.fire({
                title: '成功',
                text: "已儲存您的資料 :)",
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              })
              this.loadPostsLazy(event);
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
    })
  }


  patchOpportunity(): void {
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
    this.edit = false
    Swal.fire({
      title: '確認更改？',
      icon: 'warning',
      confirmButtonColor: '#6EBE71',
      showCancelButton: false,
      confirmButtonText: '確認',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.patchOpportunityRequest(id, body)
          .subscribe(request => {
            console.log(request)
            let event: LazyLoadEvent = {
              first: 0,
              rows: 10,
              sortField: undefined,
              sortOrder: undefined,
              multiSortMeta: undefined,
              filters: undefined,
              globalFilter: undefined,
            };
            if (request.code === 200) {
              Swal.fire({
                title: '成功',
                text: "已儲存您的變更 :)",
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              })
              this.loadPostsLazy(event);
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
          let event: LazyLoadEvent = {
            first: 0,
            rows: 10,
          };
          if (request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.loadPostsLazy(event);
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
