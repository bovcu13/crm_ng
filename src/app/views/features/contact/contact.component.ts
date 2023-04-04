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
      "name": "David",
      "account_name": "NKUST",
      "phone": "0912345678",
      "email": "abc@gmail.com",
      "contact_owner": "林"
    }
  ];

  contact_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.contact_form = this.fb.group({
      name: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      contact_owner: ['', [Validators.required]],
    });
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
    }
  }
}
