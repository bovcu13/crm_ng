import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contact: any[] = [
    {
      "account_name": "NKUST",
      "contact_owner": "林",
      "name": "David",
      "salutation": "先生",
      "mobile": "0916548964",
      "phone": "0224675656",
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
      "contact_owner": "林",
      "name": "Alice",
      "salutation": "小姐",
      "mobile": "0916978346",
      "phone": "0216879345",
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
  ];

  contact_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.contact_form = this.fb.group({
      account_name: ['', [Validators.required]],
      contact_owner: ['', [Validators.required]],
      name: ['', [Validators.required]],
      salutation: ['', [Validators.required]],
      mobile: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      title: ['', [Validators.required]],
      department: ['', [Validators.required]],
      reports_to: ['', [Validators.required]],
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
  showDialog(type: string, contact?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增';
      this.contact_form.reset();
    } else if (type === 'edit') {
      console.log("contact: " + JSON.stringify(contact))
      this.dialogHeader = '編輯';
      this.contact_form.patchValue(contact);
      //更新時間為現在時間
      const currentDate = new Date()
      this.contact_form.patchValue({
        updated_at: currentDate
      });
    }
  }

  salutationValue(event: any): void {
    const selectedsalutation = this.salutation.find((s) => s.code === event.value.code);
    this.contact_form.patchValue({
      salutation: selectedsalutation,
    });
  }
}
