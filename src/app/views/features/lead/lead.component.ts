import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {HttpApiService} from "../../../api/http-api.service";
import {Lead} from "../../../shared/models/lead";


@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {
  getData!: Lead[];
  filteredLead: any[] = [];
  lead: any[] = [
    {
      name: "David",
      status: "不明確",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@11111",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "新線索",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12222",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "評估中",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12333",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "發展中",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12344",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "已轉換",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12345",
      company_name: "EIRC"
    },
  ]

  status: any[] = [
    {
      name: "不明確",
      code: "Unqualified",
    },
    {
      name: "新線索",
      code: "New",
    },
    {
      name: "評估中",
      code: "Working",
    },
    {
      name: "發展中",
      code: "Nurturing",
    },
    {
      name: "已轉換",
      code: "Closed",
    }
  ]

  source: any = [
    {
      name: "廣告",
      code: "advertising"
    },
    {
      name: "推薦",
      code: "referral"
    },
    {
      name: "直接訪問",
      code: "direct_traffic"
    },
    {
      name: "網路搜尋",
      code: "web_search"
    },
    {
      name: "朋友推薦",
      code: "friend_referral"
    }
  ]

  account: any = [
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

  industry_id: any = [
    {
      name: "教育",
      code: "education"
    },
    {
      name: "金融服務",
      code: "financial_services"
    },
    {
      name: "醫療保健",
      code: "healthcare"
    },
    {
      name: "零售",
      code: "retail"
    },
    {
      name: "科技",
      code: "technology"
    }
  ]

  rating: any = [
    {
      name: "很有可能成交",
      code: "Hot"
    },
    {
      name: "可能性不明確",
      code: "Warm"
    },
    {
      name: "很有可能不成交",
      code: "Cold"
    }
  ]

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
  leadValue: any;
  //表格最後下拉控制選項
  items: MenuItem[] = [{
    icon: "pi pi-eye",
    label: '檢視', command: () => {
      window.location.assign('/main/lead/view');
    }
  }, {
    icon: "pi pi-pencil",
    label: '編輯', command: () => {
      this.showDialog('edit', this.leadValue)
    }
  },
    {
      icon: "pi pi-trash",
      label: '刪除',
    }];
  account_type: MenuItem[] = [
    {
      label: "個人客戶",
      icon: "pi pi-user",
      command: () => {
        this.addAccDialog();
        this.account_form.controls['type'].setValue('個人客戶');
        console.log(this.account_form.controls['type'].value)
      }
    },
    {
      label: "法人客戶",
      icon: "pi pi-building",
      command: () => {
        this.addAccDialog();
        this.account_form.controls['type'].setValue('法人客戶');
        console.log(this.account_form.controls['type'].value)
      }
    },
    {
      label: "夥伴",
      icon: "pi pi-users",
      command: () => {
        this.addAccDialog();
        this.account_form.controls['type'].setValue('夥伴');
        console.log(this.account_form.controls['type'].value)
      },
    },
    {
      label: "競爭者",
      icon: "pi pi-chart-line",
      command: () => {
        this.addAccDialog();
        this.account_form.controls['type'].setValue('競爭者');
        console.log(this.account_form.controls['type'].value)
      },
    },
  ]
  lead_form!: FormGroup;
  account_form!: FormGroup;
  edit: boolean = false;
  addAcount: boolean = false;
  dialogHeader!: string;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.lead_form = this.fb.group({
      lead_id: ['', [Validators.required]],
      name: [''],
      status: ['', [Validators.required]],
      account_id: ['', [Validators.required]],
      description: ['', [Validators.required]],
      title: [''],
      phone_number: [''],
      cell_phone: [''],
      email: [''],
      line: [''],
      source: [''],
      industry_id: [''],
      rating: ['',],
      owner: [''],
      account_name: [''],
      created_by: ['', [Validators.required]],
      created_at: [''],
      updated_by: ['', [Validators.required]],
      updated_at: [''],
    });
    this.account_form = this.fb.group({
      name: ['', [Validators.required]],
      owner: [''],
      phone_number: [''],
      industry: [''],
      type: [''],
      parent_account: [''],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
  }

  getLead(lead: any): void {
    this.leadValue = lead
  }

  filterText: any = '';

  filtered() {
    if (this.filterText === '') {
      this.filteredLead = this.lead;
    } else {
      this.filteredLead = this.lead.filter(lead => {
        return (
          lead.status.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.company_name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.phone_number.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.cell_phone.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.email.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.line.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.owner.toLowerCase().includes(this.filterText.toLowerCase())
        );
      });
    }
    console.log(this.filteredLead)
  }

  ngOnInit(): void {
    this.filteredLead = this.getData
  }

  total!: number;

  // 懶加載
  loadPostsLazy(event: LazyLoadEvent) {
    const page = (event.first! / event.rows!) + 1;
    this.HttpApi.getAllLeadRequest(page).subscribe(request => {
      this.getData = request.body.leads;
      this.total = request.body.total
      console.log(this.getData);
      // console.log(this.total)
    });
  }

  showDialog(type: string, lead?: any): void {
    // 將"業務員"設定為不可修改
    // this.lead_form.controls['owner'].disable();
    this.edit = true;
    // console.log(JSON.stringify(this.lead_form.controls['status'].value))
    if (type === 'add'
    ) {
      this.dialogHeader = '新增線索';
      this.lead_form.reset();
      // 將"線索狀態"設定為不可修改
      this.lead_form.controls['status'].disable();
      this.lead_form.patchValue({
        status: this.status.find(s => s.name === this.status[1].name),
      });
    } else if (type === 'edit') {
      this.dialogHeader = '編輯線索';
      this.lead_form.controls['status'].enable();
      this.lead_form.patchValue(lead);
      console.log(lead);
      this.lead_form.patchValue({
        status: this.status.find((s: { name: any; }) => s.name === lead.status),
        source: this.source.find((s: { name: any; }) => s.name === lead.source),
        rating: this.rating.find((s: { name: any; }) => s.name === lead.rating)
      });
      console.log(this.lead_form.controls['status'].value);
    }
  }

  postLead(): void {
    let body = {
      description: this.lead_form.controls['description'].value,
      status: this.status[1].name,
      account_id: "cf6f654e-fb06-4740-bf03-374f32406d37",
      // source: this.lead_form.value.source,
      source: this.selectedSource.name,
      account_name: this.selectedAccount.name,
      rating: this.selectedRating.name,
      // rating: "Hot",
      created_by: "7f5443f8-e607-4793-8370-560b8b688a61",
    }
    this.HttpApi.postLeadRequest(body)
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

  patchLead(): void {
    let id = this.lead_form.controls['lead_id'].value
    let body = {
      description: this.lead_form.controls['description'].value,
      status: this.selectedStatus?.name,
      account_id: "cf6f654e-fb06-4740-bf03-374f32406d37",
      // source: this.lead_form.value.source,
      source: this.selectedSource?.name,
      account_name: this.selectedAccount?.name,
      rating: this.selectedRating?.name,
      // rating: "Hot",
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45"
    }
    this.HttpApi.patchLeadRequest(id, body)
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

  deleteLead(id: any): void {
    this.HttpApi.deleteLeadRequest(id).subscribe(request => {
      console.log(request)
      let event: LazyLoadEvent = {
        first: 0,
        rows: 10,
      };
      this.loadPostsLazy(event);
    })
  }

  addAccDialog(): void {
    this.addAcount = true;
    this.edit = false;
  }

  selectedStatus: any;

  statusValue(event: any): void {
    this.selectedStatus = this.status.find((s: { name: any; }) => s.name === event.value.name);
    // console.log("code: " + event.value.code);
    // console.log("name: " + event.value.name);
    this.lead_form.value.status = this.selectedStatus.name
  }

  selectedAccount: any;

  accountValue(event: any): void {
    this.selectedAccount = this.account.find((s: { name: any; }) => s.name === event.value.name);
    this.lead_form.value.account_name = this.selectedAccount.name
  }

  selectedSource: any;

  sourceValue(event: any): void {
    this.selectedSource = this.source.find((s: { name: any; }) => s.name === event.value.name);
    this.lead_form.value.source = this.selectedSource.name
  }

  selectedRating: any;

  ratingValue(event: any): void {
    this.selectedRating = this.rating.find((s: { name: any; }) => s.name === event.value.name);
    this.lead_form.value.rating = this.selectedRating.name
    // console.log(typeof this.selectedRating.name)
    // console.log(this.selectedRating.name)
  }

  industry_idValue(event: any): void {
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
  }

  selectedIndustry: any;

  industryValue(event: any): void {
    this.selectedIndustry = this.industry.find((s: { code: any; }) => s.code === event.value.code);
    this.lead_form.value.industry = this.selectedIndustry.name
  }
}
