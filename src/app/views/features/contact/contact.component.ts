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
      "name": "先生",
      "code": "Mr."
    },
    {
      "name": "小姐",
      "code": "Ms."
    },
    {
      "name": "醫師",
      "code": "Dr."
    }
  ]

  account_name: any = [
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

  contact_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.contact_form = this.fb.group({
      contact_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      account_id: ['', [Validators.required]],
      owner: [''],
      name: ['', [Validators.required]],
      salutation: [''],
      cell_phone: [''],
      phone_number: ['', [Validators.required]],
      email: [''],
      title: [''],
      department: [''],
      reports_to: [''],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.getAllAccountRequest()
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
    this.HttpApi.getAllContactRequest(this.search, 1, page, e).subscribe(
      request => {
        this.getData = request.body.contacts;
        this.loading = false;
        console.log(this.getData)
        this.total = request.body.total;
      });
  }

  // 取得帳戶 option
  GetAllAccount!: any[];
  accountSearch!: string;

  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(this.accountSearch, 1).subscribe({
      next: request => {
        this.GetAllAccount = request.body.accounts.map((account: any) => {
          // console.log(account)
          return {
            label: account.name,
            value: account.account_id
          };
        });
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
      this.contact_form.patchValue(contact);
      this.contact_form.patchValue({
        salutation: this.salutation.find(s => s.name === contact.salutation),
        account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === contact.account_name),
      });
    }
  }

  getAllContact():void{
    this.HttpApi.getAllContactRequest(this.search, 1).subscribe(
      request => {
        this.getData = request.body.contacts;
        this.total = request.body.total;
      });
  }

  // 現在時間
  currentDate = new Date()

  postContact(): void {
    if (this.contact_form.controls['account_name'].hasError('required') ||
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
        if (this.contact_form.controls['account_name'].hasError('required')) {
          this.contact_form.controls['account_name'].markAsDirty();
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
      account_name: this.contact_form.controls['account_name'].value,
      owner: this.contact_form.controls['owner'].value,
      name: this.contact_form.controls['name'].value,
      salutation: this.selectedsalutation?.name,
      cell_phone: this.contact_form.controls['cell_phone'].value,
      phone_number: this.contact_form.controls['phone_number'].value,
      email: this.contact_form.controls['email'].value,
      title: this.contact_form.controls['title'].value,
      department: this.contact_form.controls['department'].value,
      reports_to: this.contact_form.controls['reports_to'].value,
      supervisor_id: "eb6751fe-ba8d-44f6-a92f-e2efea61793a",
      account_id: this.selectedAccountId,
    }
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
    if (this.contact_form.controls['account_name'].hasError('required') ||
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
        if (this.contact_form.controls['account_name'].hasError('required')) {
          this.contact_form.controls['account_name'].markAsDirty();
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
      account_name: this.contact_form.controls['account_name'].value,
      owner: this.contact_form.controls['owner'].value,
      name: this.contact_form.controls['name'].value,
      salutation: this.selectedsalutation?.name,
      cell_phone: this.contact_form.controls['cell_phone'].value,
      phone_number: this.contact_form.controls['phone_number'].value,
      email: this.contact_form.controls['email'].value,
      title: this.contact_form.controls['title'].value,
      department: this.contact_form.controls['department'].value,
      reports_to: this.contact_form.controls['reports_to'].value,
      supervisor_id: "eb6751fe-ba8d-44f6-a92f-e2efea61793a",
      account_id: this.selectedAccountId
    }
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

  selectedsalutation: any;

  salutationValue(event: any): void {
    this.selectedsalutation = this.salutation.find((s: { name: any; }) => s.name === event.value.name);
    this.contact_form.value.salutation = this.selectedsalutation.name
    console.log(this.selectedsalutation);
    // console.log(this.contact_form.value.salutation)
  }

  selectedAccountName!: string;
  selectedAccountId!: string;

  accountValue(event: any): void {
    this.selectedAccountName = this.GetAllAccount.find((a: { label: any; }) => a.label === event.value.label);
    this.selectedAccountId = event.value.value
    // console.log(this.selectedAccountId)
  }
}
