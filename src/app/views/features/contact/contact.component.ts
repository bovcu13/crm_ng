import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LazyLoadEvent} from 'primeng/api';
import {HttpApiService} from "../../../api/http-api.service";
import {Contact} from "../../../shared/models/contact";


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
  }

  total!: number;

  // 懶加載
  loadPostsLazy(event: LazyLoadEvent) {
    const page = (event.first! / event.rows!) + 1;
    this.HttpApi.getAllContactRequest(page).subscribe(request => {
      this.getData = request.body.contacts;
      this.total = request.body.total
      console.log(this.getData);
      // console.log(this.total)
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
      this.dialogHeader = '新增聯絡人';
      this.contact_form.reset();
    } else if (type === 'edit') {
      console.log("contact: " + JSON.stringify(contact))
      this.dialogHeader = '編輯聯絡人';
      this.contact_form.patchValue(contact);
      this.contact_form.patchValue({
        salutation: this.salutation.find(s => s.name === contact.salutation),
      });
      //更新時間為現在時間
      const currentDate = new Date()
      this.contact_form.patchValue({
        updated_at: currentDate
      });
    }
  }

  postContact(): void {
    let salutation = this.contact_form.controls['salutation'].value;
    let body = {
      account_name: this.contact_form.controls['account_name'].value,
      owner: this.contact_form.controls['owner'].value,
      name: this.contact_form.controls['name'].value,
      salutation: this.contact_form.controls['salutation'].value,
      cell_phone: this.contact_form.controls['cell_phone'].value,
      phone_number: this.contact_form.controls['phone_number'].value,
      email: this.contact_form.controls['email'].value,
      title: this.contact_form.controls['title'].value,
      department: this.contact_form.controls['department'].value,
      reports_to: this.contact_form.controls['reports_to'].value,
      supervisor_id: "eb6751fe-ba8d-44f6-a92f-e2efea61793a",
      account_id: "cf6f654e-fb06-4740-bf03-374f32406d37",
      created_by: "7f5443f8-e607-4793-8370-560b8b688a61"
    }
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
        this.loadPostsLazy(event);
      })
  }

  patchContact(): void {
    let id = this.contact_form.controls['contact_id'].value
    let salutation = this.contact_form.controls['salutation'].value;
    let body = {
      account_name: this.contact_form.controls['account_name'].value,
      owner: this.contact_form.controls['owner'].value,
      name: this.contact_form.controls['name'].value,
      salutation: this.contact_form.controls['salutation'].value,
      cell_phone: this.contact_form.controls['cell_phone'].value,
      phone_number: this.contact_form.controls['phone_number'].value,
      email: this.contact_form.controls['email'].value,
      title: this.contact_form.controls['title'].value,
      department: this.contact_form.controls['department'].value,
      reports_to: this.contact_form.controls['reports_to'].value,
      supervisor_id: "eb6751fe-ba8d-44f6-a92f-e2efea61793a",
      account_id: "cf6f654e-fb06-4740-bf03-374f32406d37",
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45"
    }
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
        this.loadPostsLazy(event);
      })
  }

  deleteContact(id: any): void {
    this.HttpApi.deleteContactRequest(id).subscribe(request => {
      console.log(request)
      let event: LazyLoadEvent = {
        first: 0,
        rows: 10,
      };
      this.loadPostsLazy(event);
    })
  }

  salutationValue(event: any): void {
    const selectedsalutation = this.salutation.find((s: { code: any; }) => s.code === event.value.code);
    console.log(selectedsalutation);
    this.contact_form.value.salutation = selectedsalutation.name
    console.log(this.contact_form.value.salutation)
  }

  accountValue(event: any): void {
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
  }
}
