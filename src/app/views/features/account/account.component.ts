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
      owner: [''],
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

  getData!: Account[];


  ngOnInit() {

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
      // console.log("account: " + JSON.stringify(account));
      this.dialogHeader = '編輯帳戶';
      this.account_form.patchValue(account);
      //dropdown
      const selectedIndustry = this.industry_id.find((s) => s.name === account.industry_id);
      this.account_form.patchValue({
        type: this.account_form.controls['type'].value.map((name: string) => ({name})),
        industry_id: selectedIndustry,
      });
      console.log(this.account_form.value)
    }
  }

  // 搜尋關鍵字
  search!: string;

  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt.filterGlobal(this.search, stringVal);
  }

  total!: number;
  loading: boolean = false;

  // 懶加載
  loadTable(e: any) {
    this.loading = true;
    // let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.HttpApi.getAllAccountRequest(this.search, 1, page, e).subscribe({
      next: request => {
        this.getData = request.body.accounts;
        this.loading = false;
        this.total = request.body.total;
        // console.log(this.total);
      },
      error: err => {
        console.log(err.status)
      }
    });
  }

  getAllAccount(): void {
    this.HttpApi.getAllAccountRequest(this.search, 1).subscribe(
      request => {
        this.getData = request.body.accounts;
        this.total = request.body.total;
      });
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
    if (this.account_form.controls['name'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.account_form.controls['name'].markAsDirty();
        this.edit = true;
      })
      return;
    }

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
      parent_account_id: this.account_form.controls['parent_account_id'].value ? this.account_form.controls['parent_account_id'].value : '00000000-0000-4000-a000-000000000000',
    }
    console.log(body.type)
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
          this.getAllAccount();
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
    if (this.account_form.controls['name'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        this.account_form.controls['name'].markAsDirty();
        this.edit = true;
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
      parent_account_id: this.account_form.controls['parent_account_id'].value ? this.account_form.controls['parent_account_id'].value : '00000000-0000-4000-a000-000000000000',
    }
    console.log(body.type)
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

  industryValue(event: any): void {
    const selectedIndustry = this.industry_id.find((s: { code: any; }) => s.code === event.value.code);
    console.log(event.value.code);
    console.log(selectedIndustry.name);
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

  clickHeader():void{
    this.dt.filterGlobal(JSON.stringify(["個人客戶", "法人客戶", "夥伴", "競爭對手"]).slice(1, -1).replace(/"/g, ""), 'contains');
  }

  selected(event: any) {
    console.log(this.selectedValue)
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
}
