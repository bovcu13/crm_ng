import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';


@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {
  lead: any[] = [
    {
      "name": "David",
      "stage": "不明確",
      "owner": "林",
      "email": "abc@gmail.com",
      "phone_number": "07-1234567",
      "cell_phone": "0912345678",
      "line": "@12345",
      "account_name": "EIRC"
    },
    {
      "name": "David",
      "stage": "新線索",
      "owner": "林",
      "email": "abc@gmail.com",
      "phone_number": "07-1234567",
      "cell_phone": "0912345678",
      "line": "@12345",
      "account_name": "EIRC"
    },
    {
      "name": "David",
      "stage": "評估中",
      "owner": "林",
      "email": "abc@gmail.com",
      "phone_number": "07-1234567",
      "cell_phone": "0912345678",
      "line": "@12345",
      "account_name": "EIRC"
    },
    {
      "name": "David",
      "stage": "發展中",
      "owner": "林",
      "email": "abc@gmail.com",
      "phone_number": "07-1234567",
      "cell_phone": "0912345678",
      "line": "@12345",
      "account_name": "EIRC"
    },
    {
      "name": "David",
      "stage": "已轉換",
      "owner": "林",
      "email": "abc@gmail.com",
      "phone_number": "07-1234567",
      "cell_phone": "0912345678",
      "line": "@12345",
      "account_name": "EIRC"
    },
  ]

  stage: any[] = [
    {
      "name": "不明確",
      "code": "unqualified"
    },
    {
      "name": "新線索",
      "code": "new"
    },
    {
      "name": "評估中",
      "code": "working"
    },
    {
      "name": "發展中",
      "code": "nurturing"
    },
    {
      "name": "已轉換",
      "code": "closed"
    }
  ]

  lead_source: any = [
    {
      "name": "廣告",
      "code": "advertising"
    },
    {
      "name": "推薦",
      "code": "referral"
    },
    {
      "name": "直接訪問",
      "code": "direct_traffic"
    },
    {
      "name": "網路搜尋",
      "code": "web_search"
    },
    {
      "name": "朋友推薦",
      "code": "friend_referral"
    }
  ]

  industry: any = [
    {
      "name": "教育",
      "code": "education"
    },
    {
      "name": "金融服務",
      "code": "financial_services"
    },
    {
      "name": "醫療保健",
      "code": "healthcare"
    },
    {
      "name": "零售",
      "code": "retail"
    },
    {
      "name": "科技",
      "code": "technology"
    }
  ]

  rating: any = [
    {
      "name": "很有可能成交",
      "code": "hot"
    },
    {
      "name": "可能性不明確",
      "code": "warm"
    },
    {
      "name": "很有可能不成交",
      "code": "cold"
    }
  ]

  lead_form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.lead_form = this.fb.group({
      name: ['', [Validators.required]],
      stage: ['', [Validators.required]],
      title: ['', [Validators.required]],
      phone_number: ['', [Validators.required]],
      cell_phone: ['', [Validators.required]],
      email: ['', [Validators.required]],
      line: ['', [Validators.required]],
      lead_source: ['', [Validators.required]],
      industry: ['', [Validators.required]],
      rating: ['', [Validators.required]],
      owner: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {

  }

  edit: boolean = false;
  dialogHeader!: string;

  showDialog(type: string, lead?: any): void {
    //將"業務負責人"設定為不可修改
    this.lead_form.controls['owner'].disable();
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增線索';
      this.lead_form.reset();
    } else if (type === 'edit') {
      console.log("lead: " + JSON.stringify(lead))
      this.dialogHeader = '編輯線索';
      this.lead_form.patchValue(lead);
      this.lead_form.patchValue({
        stage: this.stage.find(s => s.name === lead.stage),
        // lead_source: this.lead_source.find(s => s.name === lead.lead_source),
        // rating: this.rating.find(s => s.name === lead.rating)
      });
    }
  }

  stageValue(event: any): void {
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

  industryValue(event: any): void {
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
  }
}
