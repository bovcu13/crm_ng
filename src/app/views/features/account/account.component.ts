import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuItem} from 'primeng/api';
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
  // type: any[] = [
  //   {
  //     "name": "客戶",
  //     "code": "customer"
  //   },
  //   {
  //     "name": "夥伴",
  //     "code": "partner "
  //   },
  //   {
  //     "name": "競爭對手",
  //     "code": "competitor"
  //   }
  // ];

  account_type: MenuItem[] = [
    {
      label: "個人客戶",
      icon: "pi pi-user",
      command: () => {
        this.showDialog('add');
        this.account_form.controls['type'].setValue('個人客戶');
        console.log(this.account_form.controls['type'].value)
      }
    },
    {
      label: "法人客戶",
      icon: "pi pi-building",
      command: () => {
        this.showDialog('add');
        this.account_form.controls['type'].setValue('法人客戶');
        console.log(this.account_form.controls['type'].value)
      }
    },
    {
      label: "夥伴",
      icon: "pi pi-users",
      command: () => {
        this.showDialog('add');
        this.account_form.controls['type'].setValue('夥伴');
        console.log(this.account_form.controls['type'].value)
      },
    },
    {
      label: "競爭者",
      icon: "pi pi-chart-line",
      command: () => {
        this.showDialog('add');
        this.account_form.controls['type'].setValue('競爭者');
        console.log(this.account_form.controls['type'].value)
      },
    },
  ]
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

  edit: boolean = false;
  dialogHeader!: string;

  showDialog(type: string, account?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增帳戶';
      this.account_form.reset();
    } else if (type === 'edit') {
      console.log("account: " + JSON.stringify(account));
      this.dialogHeader = '編輯帳戶';
      this.account_form.patchValue(account);
      //dropdown
      const selectedIndustry = this.industry_id.find((s) => s.name === account.industry_id);
      // const selectedType = this.type.find((s) => s.name === account.type);
      this.account_form.patchValue({
        industry_id: selectedIndustry,
        // type: selectedType,
      });
    }
  }

  // 搜尋關鍵字
  search: string = '';
  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  total!: number;
  // 懶加載
  loadTable(e: any) {
    // this.loading = true;
    // let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.HttpApi.getAllAccountRequest(this.search, 1, page, e).subscribe(
      request => {
        this.getData = request.body.accounts;
        console.log(this.getData)
        this.total = request.body.total;
      });
  }

  getAllAccount():void{
    this.HttpApi.getAllAccountRequest(this.search, 1).subscribe(
      request => {
        this.getData = request.body.accounts;
        this.total = request.body.total;
      });
  }

  // 現在時間
  currentDate = new Date()

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
      type: this.account_form.controls['type'].value ? this.account_form.controls['type'].value : '00000000-0000-4000-a000-000000000000',
      parent_account_id: this.account_form.controls['parent_account_id'].value ? this.account_form.controls['parent_account_id'].value : '00000000-0000-4000-a000-000000000000',
      created_by: "7f5443f8-e607-4793-8370-560b8b688a61",
      created_at: this.currentDate
    }
    this.HttpApi.postAccountRequest(body).subscribe(request => {
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
      type: this.account_form.controls['type'].value ? this.account_form.controls['type'].value : '00000000-0000-4000-a000-000000000000',
      parent_account_id: this.account_form.controls['parent_account_id'].value ? this.account_form.controls['parent_account_id'].value : '00000000-0000-4000-a000-000000000000',
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45",
      updated_at: this.currentDate
    }
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

}
