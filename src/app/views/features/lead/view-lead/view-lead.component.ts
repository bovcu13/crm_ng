import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-lead',
  templateUrl: './view-lead.component.html',
  styleUrls: ['./view-lead.component.scss']
})
export class ViewLeadComponent implements OnInit {
  name = "name";
  title = 'title'
  stage: string = '不明確'
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
  lead_form!: FormGroup;
  edit: boolean = true;

  constructor(private fb: FormBuilder) {
    this.lead_form = this.fb.group({
      name: [''],
      status: [this.status[1], [Validators.required]],
      title: [''],
      phone_number: [''],
      cell_phone: [''],
      email: [''],
      line: [''],
      source: [''],
      industry_id: [''],
      rating: ['',],
      owner: [''],
      company_name: ['', [Validators.required]],
      created_by: [''],
      created_at: [''],
      updated_by: [''],
      updated_at: [''],
    });
  }

  ngOnInit(): void {

  }

  statusValue(event: any): void {
    // const selectedStatus = this.status.find((s) => s.code === event.value.code);
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
    // console.log(selectedStatus.name);
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




