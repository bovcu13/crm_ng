import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../../api/http-api.service";
import {ActivatedRoute} from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.scss']
})
export class ViewContactComponent implements OnInit {
  name: string = "name"
  title: string = "title"
  id: any;

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

  ngOnInit(): void {
    this.getAllAccountSelection();
    this.getOneContact(this.id)
  }

  contact_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
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

//取得聯絡人歷程紀錄
  GetContactHistoricalRecords: any[] = [];
  totalHistorical: any;

  getAllContactHistoricalRecordsRequest(id: any) {
    this.HttpApi.getAllHistoricalRecordsRequest(20, 1, id).subscribe(request => {
        this.GetContactHistoricalRecords = request.body.historical_records
        this.totalHistorical = request.body.total
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
        this.GetContactHistoricalRecords = request.body.historical_records
        this.totalHistorical = request.body.total
        console.log(this.GetContactHistoricalRecords)
        this.loading = false;
      },
      error: err => {
        console.log(err.status)
      }
    });
  }

  getOneContact(id: any): void {
    this.HttpApi.getOneContactRequest(id).subscribe(
      request => {
        this.contact_form.patchValue(request.body);
        const account_name = {
          account_id: request.body.account_id,
          name: request.body.account_name
        };
        const salutation = {
          name: request.body.salutation
        }
        const supervisor = {
          contact_id: request.body.supervisor_id,
          name: request.body.supervisor_name,
        }
        this.contact_form.patchValue({
          account_id: account_name,
          supervisor_id: supervisor,
          salutation: salutation,
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

  patchContact(): void {
    if (this.contact_form.controls['account_name'].hasError('required') ||
      this.contact_form.controls['name'].hasError('required') ||
      this.contact_form.controls['phone_number'].hasError('required')) {
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
    this.HttpApi.patchContactRequest(id, body)
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
          this.getOneContact(this.id);
          this.getAllContactHistoricalRecordsRequest(this.id)
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
  }

  // 選擇帳戶時搜尋該帳戶聯絡人
  searchContact(id: any) {
    console.log(id.account_id)
    this.getAllContactSelection(id.account_id);
  }

}
