import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {
  lead: any[] = [
    {
      name: "David",
      status: "不明確",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12345",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "新線索",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12345",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "評估中",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12345",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "發展中",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12345",
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
      code: "unqualified",
    },
    {
      name: "新線索",
      code: "new",
    },
    {
      name: "評估中",
      code: "working",
    },
    {
      name: "發展中",
      code: "nurturing",
    },
    {
      name: "已轉換",
      code: "closed",
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
      code: "hot"
    },
    {
      name: "可能性不明確",
      code: "warm"
    },
    {
      name: "很有可能不成交",
      code: "cold"
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
  lead_form!: FormGroup;
  edit: boolean = false;
  dialogHeader!: string;

  constructor(private fb: FormBuilder) {
    this.lead_form = this.fb.group({
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
      company_name: [''],
      created_by: [''],
      created_at: [''],
      updated_by: [''],
      updated_at: [''],
    });
  }

  getLead(lead: any): void {
    this.leadValue = lead
  }

  ngOnInit(): void {

  }

  showDialog(type: string, lead?: any): void {
    // 將"業務員"設定為不可修改
    // this.lead_form.controls['owner'].disable();
    this.edit = true;
    console.log(this.lead_form.controls['status'].value)
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
      console.log("lead: " + JSON.stringify(lead))
      this.dialogHeader = '編輯線索';
      this.lead_form.patchValue(lead);
      this.lead_form.patchValue({
        status: this.status.find(s => s.name === lead.status),
        // source: this.source.find(s => s.name === lead.source),
        // rating: this.rating.find(s => s.name === lead.rating)
      });
    }
  }

  statusValue(event: any): void {
    // const selectedStatus = this.status.find((s) => s.code === event.value.code);
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
    // console.log(selectedStatus.name);
  }

  accountValue(event: any): void {
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
  }

  leadSourceValue(event: any): void {
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
  }

  ratingValue(event: any): void {
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
  }

  industry_idValue(event: any): void {
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
  }
}
