import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../../api/http-api.service";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-account',
  templateUrl: './view-account.component.html',
  styleUrls: ['./view-account.component.scss']
})
export class ViewAccountComponent implements OnInit {
  name: string = "name"
  title: string = "title"
  industry_id: any[] = [
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
  type: any[] = [
    {
      "name": "個人客戶",
      // "code": "personal_customer"
    },
    {
      "name": "法人客戶",
      // "code": "business_customer"
    },
    {
      "name": "夥伴",
      // "code": "partner"
    },
    {
      "name": "競爭對手",
      // "code": "competitor"
    }
  ];
  account_form: FormGroup;
  id: any;

  ngOnInit(): void {
    this.getOneAccount(this.id)
    this.getAllAccountSelection();
    this.getAllIndusty();
  }

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
    this.account_form = this.fb.group({
      account_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone_number: [''],
      industry_id: [''],
      type: [''],
      parent_account_id: [''],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
  }

  //取得帳戶歷程紀錄
  GetAccountHistoricalRecords: any[] = [];
  totalHistorical: any;

  getAllAccountHistoricalRecordsRequest(id: any) {
    this.HttpApi.getAllHistoricalRecordsRequest(20, 1, id).subscribe(request => {
        this.GetAccountHistoricalRecords = request.body.historical_records
        this.totalHistorical = request.body.total
        console.log("更新")
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
        this.GetAccountHistoricalRecords = request.body.historical_records
        this.totalHistorical = request.body.total
        console.log(this.GetAccountHistoricalRecords)
        console.log(this.totalHistorical)
        this.loading = false;
      },
      error: err => {
        console.log(err.status)
      }
    });
  }

  getData: any;

  getOneAccount(id: any): void {
    this.HttpApi.getOneAccountRequest(id).subscribe(
      request => {
        this.account_form.patchValue(request.body)
        const industry = {
          industry_id: request.body.industry_id,
          name: request.body.industry_name
        };
        const parent_account = {
          account_id: request.body.parent_account_id,
          name: request.body.parent_account_name
        };
        console.log()
        //dropdown
        this.account_form.patchValue({
          parent_account_id: parent_account,
          industry_id: industry,
          type: this.account_form.controls['type'].value.map((name: string) => ({name})),
        });
        console.log(request.body)
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

  // 取得行業下拉選單
  getIndustries: any[] = [];

  getAllIndusty(): void {
    this.HttpApi.getAllIndustryRequest().subscribe({
      next: request => {
        this.getIndustries = request.body.industries;
        console.log(this.getIndustries)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  patchAccount(): void {
    if (this.account_form.controls['name'].hasError('required')) {
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.account_form.controls['name'].markAsDirty();
      })
      return;
    }

    let id = this.account_form.controls['account_id'].value
    let body = {
      name: this.account_form.controls['name'].value,
      phone_number: this.account_form.controls['phone_number'].value,
      industry_id: '00000000-0000-4000-a000-000000000000',
      // 將 type 物件轉換為 string
      // 使用 JSON.parse() 將 JSON 字串解析為 JavaScript 物件
      // 使用 map() 遍歷物件陣列，提取每個物件的 name 屬性
      type: JSON.parse(JSON.stringify(this.account_form.controls['type'].value)).map((item: {
        name: any;
      }) => item.name),
      parent_account_id: this.account_form.controls['parent_account_id'].value,
    }
    this.HttpApi.patchAccountRequest(id, body)
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
          this.getAllAccountHistoricalRecordsRequest(this.id)
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
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
    this.getOneAccount(this.id);
  }

  clearControls(controlName: string): void {
    this.account_form.get(controlName)?.setValue(null)
  }
}


