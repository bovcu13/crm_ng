import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import {Contact} from "../../../shared/models/contact";
import Swal from "sweetalert2";
import {Table} from "primeng/table";


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  getData!: Contact[];
  @ViewChild('dt') dt!: Table;
  salutation: any[] = [
    {
      name: "先生"
    },
    {
      name: "小姐"
    },
    {
      name: "醫師"
    }
  ]

  contact_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.contact_form = this.fb.group({
      contact_id: ['', [Validators.required]],
      account_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      salutation: [''],
      cell_phone: [''],
      phone_number: ['', [Validators.required]],
      email: [''],
      title: [''],
      department: [''],
      supervisor_id: [''],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllAccountSelection();
  }

  // 搜尋關鍵字
  search: string = '';

  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  total!: number;
  loading: boolean = false;
  rowsPerPageOptions: number[] = [10, 20];
  selectedRows: number = 10;

  // 懶加載
  loadTable(e: any) {
    this.loading = true;
    this.selectedRows = e.rows
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.HttpApi.getAllContactRequest(this.search, 1, page, limit, e).subscribe(
      request => {
        this.getData = request.body.contacts;
        this.loading = false;
        console.log(this.getData)
        this.total = request.body.total;
      });
  }

  // 取得帳戶下拉選項
  getAccounts: any[] = [];
  accountSearch!: string;
  accountTotal!: number;
  accountPage: number = 1;
  accountLimit: number = 20;
  first: number = 0;
  last: number = 12;

  // // 帳戶懶加載
  // loadAccount(e: any) {
  //   // console.log(e)
  //   // 滾輪往下滑
  //   if (e.first > this.first || e.last > this.last) {
  //     // console.log('++')
  //     if (e.last % this.accountLimit === 0 && this.accountPage < (Math.ceil(this.accountTotal / this.accountLimit))) {
  //       this.accountPage++;
  //       this.getAllAccountRequest(this.accountPage)
  //     }
  //   }
  //   // 滾輪往上滑
  //   else if (e.first < this.first || e.last < this.last) {
  //     // console.log('--')
  //   }
  // }

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

  // 直屬上司下拉選單
  getContacts: any[] = [];

  getAllContactSelection(id: any) {
    this.HttpApi.getAllContactSelection(id).subscribe({
      next: request => {
        this.getContacts = request.body.contacts
        console.log(this.getContacts)
      },
      error: err => {
        console.log(err);
      }
    });
  }

  edit: boolean = false;
  dialogHeader!: string;

  showDialog(type: string, contact?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增聯絡人';
      this.contact_form.reset();
    } else if (type === 'edit') {
      this.dialogHeader = '編輯聯絡人';
      this.getAllContactSelection(contact.account_id)
      console.log(contact)
      this.contact_form.patchValue(contact);
      const account_name = {
        account_id: contact.account_id,
        name: contact.account_name
      };
      const salutation = {
        name: contact.salutation
      }
      const supervisor = {
        contact_id: contact.supervisor_id,
        name: contact.supervisor_name,
      }
      this.contact_form.patchValue({
        account_id: account_name,
        supervisor_id: supervisor,
        salutation: salutation,
      });
    }
  }

  getAllContact(): void {
    this.HttpApi.getAllContactRequest(this.search, 1, 1, this.selectedRows).subscribe(
      request => {
        this.getData = request.body.contacts;
        this.total = request.body.total;
      });
  }

  // 現在時間
  currentDate = new Date()

  postContact(): void {
    if (this.contact_form.controls['account_id'].hasError('required') ||
      this.contact_form.controls['name'].hasError('required') ||
      this.contact_form.controls['phone_number'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.contact_form.controls['account_id'].hasError('required')) {
          this.contact_form.controls['account_id'].markAsDirty();
        }
        if (this.contact_form.controls['name'].hasError('required')) {
          this.contact_form.controls['name'].markAsDirty();
        }
        if (this.contact_form.controls['phone_number'].hasError('required')) {
          this.contact_form.controls['phone_number'].markAsDirty();
        }
        this.edit = true;
      })
      return;
    }

    let body = {
      name: this.contact_form.controls['name'].value,
      salutation: this.contact_form.controls['salutation'].value?.name,
      cell_phone: this.contact_form.controls['cell_phone']?.value,
      phone_number: this.contact_form.controls['phone_number'].value,
      email: this.contact_form.controls['email']?.value,
      title: this.contact_form.controls['title']?.value,
      department: this.contact_form.controls['department']?.value,
      supervisor_id: this.contact_form.controls['supervisor_id'].value?.contact_id,
      account_id: this.contact_form.controls['account_id'].value.account_id,
    }
    console.log(body)
    this.HttpApi.postContactRequest(body)
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
          this.getAllContact();
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


  patchContact(): void {
    if (this.contact_form.controls['account_id'].hasError('required') ||
      this.contact_form.controls['name'].hasError('required') ||
      this.contact_form.controls['phone_number'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.contact_form.controls['account_id'].hasError('required')) {
          this.contact_form.controls['account_id'].markAsDirty();
        }
        if (this.contact_form.controls['name'].hasError('required')) {
          this.contact_form.controls['name'].markAsDirty();
        }
        if (this.contact_form.controls['phone_number'].hasError('required')) {
          this.contact_form.controls['phone_number'].markAsDirty();
        }
        this.edit = true;
      })
      return;
    }

    let id = this.contact_form.controls['contact_id'].value
    let body = {
      name: this.contact_form.controls['name'].value,
      salutation: this.contact_form.controls['salutation'].value?.name,
      cell_phone: this.contact_form.controls['cell_phone']?.value,
      phone_number: this.contact_form.controls['phone_number'].value,
      email: this.contact_form.controls['email']?.value,
      title: this.contact_form.controls['title']?.value,
      department: this.contact_form.controls['department']?.value,
      supervisor_id: this.contact_form.controls['supervisor_id'].value?.contact_id,
      account_id: this.contact_form.controls['account_id'].value.account_id,
    }
    console.log(body)
    this.HttpApi.patchContactRequest(id, body)
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
          this.getAllContact();
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


  deleteContact(id: any): void {
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
        this.HttpApi.deleteContactRequest(id).subscribe(request => {
          console.log(request)
          if (request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getAllContact();
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

  // 選擇帳戶時搜尋該帳戶聯絡人
  searchContact(id: any) {
    console.log(id.account_id)
    this.getAllContactSelection(id.account_id);
  }
}
