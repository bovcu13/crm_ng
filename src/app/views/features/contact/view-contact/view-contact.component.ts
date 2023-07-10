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
    this.getAllAccountRequest();
    this.getOneContact(this.id)
  }

  contact_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.id = this.route.snapshot.paramMap.get('id');
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

  getOneContact(id: any): void {
    this.HttpApi.getOneContactRequest(id).subscribe(
      request => {
        this.contact_form.patchValue(request.body);
        this.contact_form.patchValue({
          salutation: this.salutation.find(s => s.name === request.body.salutation),
          account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === request.body.account_name),
        });
        console.log(request.body)
      }
    )
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
          Swal.fire({
            title: '成功',
            text: "已儲存您的變更 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getOneContact(this.id);
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
