import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent {
  account: any[] = [
    {
      "account_name": "David",
      "phone": "0912345678",
      "account_owner": "林",
      "type": "夥伴"
    }
  ];
  type: any[] = [
    {
      "name": "客戶",
      "code": "customer"
    },
    {
      "name": "夥伴",
      "code": "partner "
    },
    {
      "name": "競爭對手",
      "code": "competitor"
    }
  ]

  account_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.account_form = this.fb.group({
      account_name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      account_owner: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });
  }

  edit: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, account?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增';
      this.account_form.reset();
    } else if (type === 'edit') {
      console.log("account: " + JSON.stringify(account))
      this.dialogHeader = '編輯';
      this.account_form.patchValue(account);
      this.account_form.patchValue({
        type: this.type.find(s => s.name === account.type)
      });
    }
  }
  typeValue(event: any): void {
    const selectedType = this.type.find((s) => s.code === event.value.code);
    console.log(event.value.code);
    console.log(selectedType.name);
  }
}
