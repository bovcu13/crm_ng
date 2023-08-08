import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import {Table} from 'primeng/table';
import {Account} from "../../../shared/models/account";
import Swal from "sweetalert2";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  type: any[] = [
    {
      "name": "個人客戶",
      // "icon": "pi pi-user",
      // "code": "personal_customer"
    },
    {
      "name": "法人客戶",
      // "icon": "pi pi-building",
      // "code": "business_customer"
    },
    {
      "name": "夥伴",
      // "icon": "pi pi-users",
      // "code": "partner"
    },
    {
      "name": "競爭對手",
      // "icon": "pi pi-chart-line",
      // "code": "competitor"
    }
  ];

  // account_type: MenuItem[] = [
  //   {
  //     label: "個人客戶",
  //     icon: "pi pi-user",
  //     command: () => {
  //       this.showDialog('add');
  //       this.account_form.controls['type'].setValue('個人客戶');
  //       console.log(this.account_form.controls['type'].value)
  //     }
  //   },
  //   {
  //     label: "法人客戶",
  //     icon: "pi pi-building",
  //     command: () => {
  //       this.showDialog('add');
  //       this.account_form.controls['type'].setValue('法人客戶');
  //       console.log(this.account_form.controls['type'].value)
  //     }
  //   },
  //   {
  //     label: "夥伴",
  //     icon: "pi pi-users",
  //     command: () => {
  //       this.showDialog('add');
  //       this.account_form.controls['type'].setValue('夥伴');
  //       console.log(this.account_form.controls['type'].value)
  //     },
  //   },
  //   {
  //     label: "競爭者",
  //     icon: "pi pi-chart-line",
  //     command: () => {
  //       this.showDialog('add');
  //       this.account_form.controls['type'].setValue('競爭者');
  //       console.log(this.account_form.controls['type'].value)
  //     },
  //   },
  // ]
  account_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.account_form = this.fb.group({
      account_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      phone_number: [''],
      industry_id: [''],
      type: ['', [Validators.required]],
      parent_account_id: [''],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
  }

  getData!: Account[];


  ngOnInit() {
    this.getAllAccountSelection();
    this.getAllIndusty();
  }

  // 開啟 新增/編輯帳戶 彈出視窗
  edit: boolean = false;
  dialogHeader!: string;

  showDialog(type: string, account?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增帳戶';
      this.account_form.reset();
    } else if (type === 'edit') {
      console.log(account)
      this.dialogHeader = '編輯帳戶';
      this.account_form.patchValue(account);
      const industry = {
        industry_id: account.industry_id,
        name: account.industry_name
      };
      const parent_account = {
        account_id: account.parent_account_id,
        name: account.parent_account_name
      };
      //dropdown
      this.account_form.patchValue({
        parent_account_id: parent_account,
        industry_id: industry,
        type: this.account_form.controls['type'].value.map((name: string) => ({name})),
      });
    }
  }

  // 搜尋關鍵字
  search!: string;

  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt.filterGlobal(this.search, stringVal);
  }

  totalRecords!: number;
  loading: boolean = false;
  rowsPerPageOptions: number[] = [10, 20];
  selectedRows: number = 10;

  // 懶加載
  loadTable(e: any) {
    // console.log(e)
    this.selectedRows = e.rows
    this.loading = true;
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.HttpApi.getAllAccountRequest(this.search, 1, page, limit, e).subscribe({
      next: request => {
        this.getData = request.body.accounts;
        this.loading = false;
        this.totalRecords = request.body.total;
        console.log(this.getData);
      },
      error: err => {
        console.log(err)
      }
    });
  }

  // 取得帳戶 option
  getAccounts: any[] = [];
  accountSearch!: string;
  accountTotal!: number;
  accountPage: number = 1;
  accountLimit: number = 20;
  first: number = 0;
  last: number = 12;

// 取得 account fuction
  getAllAccountSelection() {
    this.HttpApi.getAllAccountSelection().subscribe({
      next: request => {
        this.getAccounts = request.body.accounts
        console.log(this.getAccounts)
        // this.accountTotal = request.body.total
        // const newAccounts = request.body.accounts.map((account: any) => {
        //   // console.log(account)
        //   return {
        //     label: account.name,
        //     value: account.account_id
        //   };
        // });
        // // 將新請求到的資料加入 getAccounts 陣列
        // this.getAccounts = [...this.getAccounts, ...newAccounts];
        // console.log(this.getAccounts)
      },
      error: err => {
        console.log(err);
      }
    });
  }

  /*
  // 帳戶懶加載
    loadAccount(e: any) {
      // console.log(e)
      // 滾輪往下滑
      if (e.first > this.first || e.last > this.last) {
        // console.log('++')
        if (e.last % this.accountLimit === 0 && this.accountPage < (Math.ceil(this.accountTotal / this.accountLimit))) {
          this.accountPage++;
          this.getAllAccount(this.accountPage)
          console.log(this.accountPage)
        }
      }
      // 滾輪往上滑
      else if (e.first < this.first || e.last < this.last) {
        // console.log('--')
      }
    }
    */

  getAllAccount(): void {
    this.HttpApi.getAllAccountRequest(this.search, 1, 1, this.selectedRows).subscribe(
      request => {
        this.getData = request.body.accounts;
        this.totalRecords = request.body.total;
      });
  }

  clearFilter() {
    this.dt.clear();
    this.selectedValue = [
      {
        name: "個人客戶",
        boolean: false
      },
      {
        name: "法人客戶",
        boolean: false
      },
      {
        name: "夥伴",
        boolean: false
      },
      {
        name: "競爭對手",
        boolean: false
      },
    ]
  }

  getSeverity(status: string) {
    switch (status.toString()) {
      case "個人客戶":
        return {severity: 'info', icon: 'pi pi-user'};

      case "法人客戶":
        return {severity: 'success', icon: 'pi pi-building'};

      case "夥伴":
        return {severity: 'warning', icon: 'pi pi-users'};

      case "競爭對手":
        return {severity: 'danger', icon: 'pi pi-chart-line'};
      default:
        return {severity: '', icon: ''};
    }
  }

  // 現在時間
  // currentDate = new Date()

  postAccount(): void {
    if (this.account_form.controls['name'].hasError('required') ||
      this.account_form.controls['type'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.account_form.controls['name'].markAsDirty();
        this.account_form.controls['type'].markAsDirty();
        this.edit = true;
      })
      return;
    }
    let body = {
      name: this.account_form.controls['name'].value,
      phone_number: this.account_form.controls['phone_number'].value,
      industry_id: this.account_form.controls['industry_id'].value?.industry_id,
      parent_account_id: this.account_form.controls['parent_account_id'].value?.account_id,
      // 將 type 物件轉換為 string
      // 使用 JSON.parse() 將 JSON 字串解析為 JavaScript 物件
      // 使用 map() 遍歷物件陣列，提取每個物件的 name 屬性
      type: JSON.parse(JSON.stringify(this.account_form.controls['type'].value)).map((item: {
        name: any;
      }) => item.name),
    }
    console.log(body)
    this.HttpApi.postAccountRequest(body).subscribe({
      next: request => {
        if (request.code === 200) {
          this.edit = false;
          Swal.fire({
            title: '成功',
            text: "已儲存您的資料 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllAccount()
        }
      },
      error: err => {
        this.edit = false;
        Swal.fire({
          title: '失敗',
          text: "請確認資料是否正確 :(",
          icon: 'error',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.edit = true;
        })
        console.log(err)
      }
    });
  }

  patchAccount(): void {
    if (this.account_form.controls['name'].hasError('required') ||
      this.account_form.controls['type'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.account_form.controls['name'].markAsDirty();
        this.account_form.controls['type'].markAsDirty();
        this.edit = true;
      })
      return;
    }
    let id = this.account_form.controls['account_id'].value
    let body = {
      name: this.account_form.controls['name'].value,
      phone_number: this.account_form.controls['phone_number']?.value,
      industry_id: this.account_form.controls['industry_id'].value?.industry_id,
      parent_account_id: this.account_form.controls['parent_account_id'].value?.account_id,
      // 將 type 物件轉換為 string
      // 使用 JSON.parse() 將 JSON 字串解析為 JavaScript 物件
      // 使用 map() 遍歷物件陣列，提取每個物件的 name 屬性
      type: JSON.parse(JSON.stringify(this.account_form.controls['type'].value)).map((item: {
        name: any;
      }) => item.name),
    }
    console.log('id: '+id)
    console.log(body)
    this.HttpApi.patchAccountRequest(id, body)
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
          this.getAllAccount();
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            if (this.account_form.controls['name'].hasError('required')) {
              this.account_form.controls['name'].markAsDirty();
            }
            if (this.account_form.controls['type'].hasError('required')) {
              this.account_form.controls['type'].markAsDirty();
            }
            this.edit = true;
          })
        }
      })
  }

  deleteAccount(id: any): void {
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
        this.HttpApi.deleteAccountRequest(id).subscribe(request => {
          console.log(request)
          if (request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getAllAccount();
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

  // 取得行業下拉選單
  getIndustries: any[] = [];
  totalIndustries!: number;

  getAllIndusty(): void {
    this.HttpApi.getAllIndustryRequest().subscribe({
      next: request => {
        this.getIndustries = request.body.industries;
        console.log(this.getIndustries)
        // this.totalIndustries = request.body.total
        // const newIndustries = request.body.industries.map((industry: any) => {
        //   // console.log(account)
        //   return {
        //     label: industry.name,
        //     value: industry.industry_id
        //   };
        // });
        // // 將新請求到的資料加入 GetAllAccount 陣列
        // this.getIndustries = [...this.getIndustries, ...newIndustries];
        // console.log(this.getIndustries)
      },
      error: err => {
        console.log(err)
      }
    })
  }

  /*
  industyPage: number = 1;
  industyLimit: number = 20;

  // 行業懶加載
  loadIndusty(e: any) {
    // console.log(e)
    // 滾輪往下滑
    if (e.first > this.first || e.last > this.last) {
      // console.log('++')
      if (e.last % this.industyLimit === 0 && this.industyPage < (Math.ceil(this.accountTotal / this.industyLimit))) {
        this.industyPage++;
        this.getAllIndusty(this.industyPage)
        console.log(this.industyPage)
      }
    }
    // 滾輪往上滑
    else if (e.first < this.first || e.last < this.last) {
      // console.log('--')
    }
  }
  */

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

  clickSort(): void {
    this.dt.filterGlobal(JSON.stringify(["個人客戶", "法人客戶", "夥伴", "競爭對手"]).slice(1, -1).replace(/"/g, ""), 'contains');
  }

  selectedValue = [
    {
      name: "個人客戶",
      boolean: false
    },
    {
      name: "法人客戶",
      boolean: false
    },
    {
      name: "夥伴",
      boolean: false
    },
    {
      name: "競爭對手",
      boolean: false
    },
  ]

  selected(event: any) {
    console.log(event)
    switch (event.itemValue.name) {
      case "個人客戶":
        this.selectedValue[0].boolean = !this.selectedValue[0].boolean;
        console.log("個人客戶: " + this.selectedValue[0].boolean);
        this.accountTypefilter();
        break;

      case "法人客戶":
        this.selectedValue[1].boolean = !this.selectedValue[1].boolean;
        console.log("法人客戶: " + this.selectedValue[1].boolean);
        this.accountTypefilter();
        break;

      case "夥伴":
        this.selectedValue[2].boolean = !this.selectedValue[2].boolean;
        console.log("夥伴: " + this.selectedValue[2].boolean);
        this.accountTypefilter();
        break;

      case "競爭對手":
        this.selectedValue[3].boolean = !this.selectedValue[3].boolean;
        console.log("競爭對手: " + this.selectedValue[3].boolean);
        this.accountTypefilter();
        break;
      default:
        console.log("error")
        return;
    }
  }

  accountTypefilter(): void {
    let mutiSearch: string[] = []
    let trueValue = 0;
    for (const i in this.selectedValue) {
      if (this.selectedValue[i].boolean) {
        mutiSearch[trueValue] = this.selectedValue[i].name
        trueValue++;
        // console.log(JSON.stringify(mutiSearch).slice(1, -1).replace(/"/g, ""))
      }
    }
    // string[] → string
    // ["法人客戶","夥伴"] → 法人客戶,夥伴
    // g（global flag）：正則表達式中的全域標誌
    this.dt.filterGlobal(JSON.stringify(mutiSearch).slice(1, -1).replace(/"/g, ""), 'contains');
  }

  clearControls(controlName: string): void {
    this.account_form.get(controlName)?.setValue(null)
  }
}
