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
      "account_owner": "林",
      "phone": "0912345678",
      "industry": "金融服務",
      "type": "夥伴",
      "parent_account": "NKUST",
      "created_by": "林",
      "updated_by": "林",
      "created_at": "2023-04-10  in the evening11:35", //建立日期
    },
    {
      "account_name": "Mars",
      "account_owner": "林",
      "phone": "0987654321",
      "industry": "零售業",
      "type": "對手",
      "parent_account": "NKUST",
      "created_by": "林",
      "updated_by": "林",
      "created_at": "2023-04-09  in the evening17:55", //建立日期
    }
  ];
  industry: any[] = [
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
  ];

  account_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.account_form = this.fb.group({
      account_name: ['', [Validators.required]],
      account_owner: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      type: ['', [Validators.required]],
      parent_account: ['', [Validators.required]],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
  }
  //時間調整
  localToUtc(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 8, date.getMinutes(), date.getSeconds()));
  }

  edit: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, account?: any): void {
    this.edit = true;
    this.account_form.controls['account_owner'].disable();
    this.account_form.controls['created_by'].disable();
    this.account_form.controls['updated_by'].disable();
    this.account_form.controls['created_at'].disable();
    this.account_form.controls['updated_at'].disable();
    if (type === 'add') {
      this.dialogHeader = '新增';
      this.account_form.reset();
    } else if (type === 'edit') {
      console.log("account: " + JSON.stringify(account));
      this.dialogHeader = '編輯';
      this.account_form.patchValue(account);
      //dropdown
      const selectedIndustry = this.industry.find((s) => s.name === account.industry);
      const selectedType = this.type.find((s) => s.name === account.type);
      //更新時間為現在時間
      const currentDate = new Date()
      this.account_form.patchValue({
        industry: selectedIndustry,
        type: selectedType,
        updated_at: currentDate
      });
    }
  }
  industryValue(event: any): void {
    const selectedIndustry = this.industry.find((s: { code: any; }) => s.code === event.value.code);
    console.log(event.value.code);
    console.log(selectedIndustry.name);
  }

  typeValue(event: any): void {
    const selectedType = this.type.find((s: { code: any; }) => s.code === event.value.code);
    console.log(event.value.code);
    console.log(selectedType.name);
  }
}
