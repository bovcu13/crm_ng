import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LazyLoadEvent} from 'primeng/api';
import {HttpApiService} from "../../../api/http-api.service";
import {Contact} from "../../../shared/models/contact";
import Swal from "sweetalert2";


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  getData!: Contact[];
  filteredContacts: any[] = [];
  contact: any[] = [
    {
      "account_name": "NKUST",
      "owner": "林",
      "name": "David",
      "salutation": "先生",
      "cell_phone": "0916548964",
      "phone_number": "0224675656",
      "email": "abc@gmail.com",
      "title": "經理",
      "department": "星球科技有限公司",
      "reports_to": "王小名總經理",
      "created_by": "林",
      "updated_by": "林",
      "created_at": "2023-04-10  in the evening11:35", //建立日期
    },
    {
      "account_name": "NKUST",
      "owner": "林",
      "name": "Alice",
      "salutation": "小姐",
      "cell_phone": "0916978346",
      "phone_number": "0216879345",
      "email": "def@gmail.com",
      "title": "主管",
      "department": "EIRC科技有限公司",
      "reports_to": "林總經理",
      "created_by": "林",
      "updated_by": "林",
      "created_at": "2023-04-03  in the morning10:00:00", //建立日期
    }
  ];
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

  filterText: any = '';

  filtercontacts() {
    if (this.filterText === '') {
      this.filteredContacts;
    } else {
      this.filteredContacts = this.contact.filter(contact => {
        return (
          contact.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          contact.account_name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          contact.cell_phone.toLowerCase().includes(this.filterText.toLowerCase()) ||
          contact.email.toLowerCase().includes(this.filterText.toLowerCase()) ||
          contact.owner.toLowerCase().includes(this.filterText.toLowerCase())
        );
      });
    }
    console.log(this.filteredContacts)
  }

  ngOnInit() {
    this.filteredContacts = this.getData;
    this.getAllAccountRequest()
  }

  total!: number;

  // 懶加載
  loadPostsLazy(event: LazyLoadEvent) {
    const page = (event.first! / event.rows!) + 1;
    // this.HttpApi.getAllContactRequest(page).subscribe(request => {
    //   this.getData = request.body.contacts;
    // });
    this.HttpApi.getAllContactRequest(page).subscribe(request => {
      this.getData = request.body.contacts;
      this.total = request.body.total
      console.log(this.getData)
    });
  }

  //時間調整
  localToUtc(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 8, date.getMinutes(), date.getSeconds()));
  }

  // 取得帳戶 option
  GetAllAccount!: any[];

  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(1).subscribe(
      (request) => {
        this.GetAllAccount = request.body.accounts.map((account: any) => {
          // console.log(account)
          return {
            label: account.name,
            value: account.account_id
          };
        });
      },
      (error) => {
        console.log(error);
      }
    );
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

  // 現在時間
  currentDate = new Date()

  postContact(): void {
    if (this.contact_form.controls['account_name'].hasError('required') ||
        this.contact_form.controls['name'].hasError('required') ||
        this.contact_form.controls['phone_number'].hasError('required'))
    {
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
        this.HttpApi.postContactRequest(body)
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

  patchContact(): void {
    if (this.contact_form.controls['account_name'].hasError('required') ||
      this.contact_form.controls['name'].hasError('required') ||
      this.contact_form.controls['phone_number'].hasError('required'))
    {
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
      account_id: this.selectedAccountId,
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
        this.HttpApi.patchContactRequest(id, body)
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
