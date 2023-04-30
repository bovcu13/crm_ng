import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LazyLoadEvent, MenuItem} from 'primeng/api';
import {HttpApiService} from "../../../api/http-api.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  // filteredAccount: any[] = [];
  account: any[] = [
    {
      "name": "David",
      "owner": "林",
      "phone_number": "0912345678",
      "industry_id": "金融服務",
      "type": "個人客戶",
      "parent_account_id": "NKUST",
      "created_by": "林",
      "updated_by": "林",
      "created_at": "2023-04-10  in the evening11:35", //建立日期
    },
    {
      "name": "Mars",
      "owner": "林",
      "phone_number": "0987654321",
      "industry_id": "零售業",
      "type": "法人客戶",
      "parent_account_id": "NKUST",
      "created_by": "林",
      "updated_by": "林",
      "created_at": "2023-04-09  in the evening17:55", //建立日期
    }
  ];
  industry_id: any[] = [
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
  // type: any[] = [
  //   {
  //     "name": "客戶",
  //     "code": "customer"
  //   },
  //   {
  //     "name": "夥伴",
  //     "code": "partner "
  //   },
  //   {
  //     "name": "競爭對手",
  //     "code": "competitor"
  //   }
  // ];

  account_type: MenuItem[] = [
    {
      label: "個人客戶",
      icon: "pi pi-user",
      command: () => {
        this.showDialog('add');
        this.account_form.controls['type'].setValue('個人客戶');
        console.log(this.account_form.controls['type'].value)
      }
    },
    {
      label: "法人客戶",
      icon: "pi pi-building",
      command: () => {
        this.showDialog('add');
        this.account_form.controls['type'].setValue('法人客戶');
        console.log(this.account_form.controls['type'].value)
      }
    },
    {
      label: "夥伴",
      icon: "pi pi-users",
      command: () => {
        this.showDialog('add');
        this.account_form.controls['type'].setValue('夥伴');
        console.log(this.account_form.controls['type'].value)
      },
    },
    {
      label: "競爭者",
      icon: "pi pi-chart-line",
      command: () => {
        this.showDialog('add');
        this.account_form.controls['type'].setValue('競爭者');
        console.log(this.account_form.controls['type'].value)
      },
    },
  ]
  account_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.account_form = this.fb.group({
      account_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      owner: [''],
      phone_number: [''],
      industry_id: [''],
      type: [''],
      parent_account_id: [''],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
  }

  getData!: HttpApiService[];
  filterText: any = '';

  filter() {
    if (this.filterText === '') {
      this.getData = this.account;
    } else {
      this.getData = this.account.filter(account => {
        return (
          account.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          account.phone_number.toLowerCase().includes(this.filterText.toLowerCase()) ||
          account.type.toLowerCase().includes(this.filterText.toLowerCase()) ||
          account.owner.toLowerCase().includes(this.filterText.toLowerCase())
        );
      });
    }
    console.log(this.getData)
  }

  ngOnInit() {

  }

  //時間調整
  localToUtc(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 8, date.getMinutes(), date.getSeconds()));
  }

  edit: boolean = false;
  dialogHeader!: string;

  showDialog(type: string, account?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增帳戶';
      this.account_form.reset();
    } else if (type === 'edit') {
      console.log("account: " + JSON.stringify(account));
      this.dialogHeader = '編輯帳戶';
      this.account_form.patchValue(account);
      //dropdown
      const selectedIndustry = this.industry_id.find((s) => s.name === account.industry_id);
      // const selectedType = this.type.find((s) => s.name === account.type);
      //更新時間為現在時間
      const currentDate = new Date()
      this.account_form.patchValue({
        industry_id: selectedIndustry,
        // type: selectedType,
        updated_at: currentDate
      });
    }
  }

  total!: number;

  // 懶加載
  loadPostsLazy(event: LazyLoadEvent) {
    const page = (event.first! / event.rows!) + 1;
    this.HttpApi.getAllAccountRequest(page).subscribe(request => {
      this.getData = request.body.accounts;
      this.total = request.body.total
      console.log(this.getData);
      // console.log(this.total)
    });
  }

  postAccount(): void {
    let body = {
      name: this.account_form.controls['name'].value,
      phone_number: this.account_form.controls['phone_number'].value,
      industry_id: '00000000-0000-4000-a000-000000000000',
      type: this.account_form.controls['type'].value ? this.account_form.controls['type'].value : '00000000-0000-4000-a000-000000000000',
      parent_account_id: this.account_form.controls['parent_account_id'].value ? this.account_form.controls['parent_account_id'].value : '00000000-0000-4000-a000-000000000000',
      created_by: "eb6751fe-ba8d-44f6-a92f-e2efea61793a"
    }
    this.HttpApi.postAccountRequest(body)
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

  patchAccount(): void {
    let id = this.account_form.controls['account_id'].value
    let body = {
      name: this.account_form.controls['name'].value,
      phone_number: this.account_form.controls['phone_number'].value,
      industry_id: '00000000-0000-4000-a000-000000000000',
      type: this.account_form.controls['type'].value ? this.account_form.controls['type'].value : '00000000-0000-4000-a000-000000000000',
      parent_account_id: this.account_form.controls['parent_account_id'].value ? this.account_form.controls['parent_account_id'].value : '00000000-0000-4000-a000-000000000000',
      updated_by: "eb6751fe-ba8d-44f6-a92f-e2efea61793a"
    }
    this.HttpApi.patchAccountRequest(id, body)
      .subscribe(request => {
        console.log(request)
        let event: LazyLoadEvent = {
          first: 0,
          rows: 10,
        };
        this.loadPostsLazy(event);
      })
  }

  deleteAccount(id: any): void {
    this.HttpApi.deleteAccountRequest(id).subscribe(request => {
      console.log(request)
      let event: LazyLoadEvent = {
        first: 0,
        rows: 10,
      };
      this.loadPostsLazy(event);
    })
  }

  industryValue(event: any): void {
    const selectedIndustry = this.industry_id.find((s: { code: any; }) => s.code === event.value.code);
    console.log(event.value.code);
    console.log(selectedIndustry.name);
  }

  // typeValue(event: any): void {
  //   const selectedType = this.type.find((s: { code: any; }) => s.code === event.value.code);
  //   console.log(event.value.code);
  //   console.log(selectedType.name);
  // }

}
