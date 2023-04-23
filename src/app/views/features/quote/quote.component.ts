import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent {
   filteredQuotes: any[] = [];
  quote: any[] = [
    {
      "quote_id": 1,
      "number": "00001",
      "name": "milk",
      "opportunity_name": "12345",
      "account_name": "NKUST",
      "syncing": true,
      "status": "已接受",
      "describe": "test1",
      "expiration_date": "2023-04-05",
      "tax": 10,
      "shipping_and_handling": "1.5",
      "subtotal": 50.00,
      "created_at": "2023-04-15",
      "created_by": "林",
      "updated_by": "林",
    },
    {
      "quote_id": 2,
      "number": "00002",
      "name": "aaa",
      "opportunity_name": "sam",
      "account_name": "Gina",
      "syncing": false,
      "status": "審查中",
      "describe": "test2",
      "expiration_date": "2023-04-04",
      "tax": "",
      "shipping_and_handling": "",
      "subtotal": 60.00,
      "created_at": "2023-04-14",
      "created_by": "林",
      "updated_by": "林",
    }
  ];
  filterText: any = '';
  filterquotes() {
    if (this.filterText) {
      this.filteredQuotes = this.quote.filter((quote) => {
        return quote.name.toLowerCase().includes(this.filterText.toLowerCase());
      });
    } else {
      this.filteredQuotes = this.quote;
    }
    if (this.filterText === '') {
      this.filteredQuotes = this.quote;
    } else {
      this.filteredQuotes = this.quote.filter(quote => {
        return (
          quote.quote_id.toString().toLowerCase().includes(this.filterText.toLowerCase()) ||
          quote.name.toLowerCase().includes(this.filterText) ||
          quote.opportunity_name.toLowerCase().includes(this.filterText) ||
          quote.account_name.toLowerCase().includes(this.filterText) ||
          (quote.syncing ? 'true' : 'false').toLowerCase().includes(this.filterText.toLowerCase()) ||
          quote.status.toLowerCase().includes(this.filterText) ||
          quote.describe.toLowerCase().includes(this.filterText) ||
          quote.expiration_date.toLowerCase().includes(this.filterText) ||
          quote.tax.toString().toLowerCase().includes(this.filterText.toLowerCase()) ||
          quote.shipping_and_handling.toLowerCase().includes(this.filterText) ||
          quote.subtotal.toString().toLowerCase().includes(this.filterText.toLowerCase())
        );
      });
    }
    console.log(this.filteredQuotes)
  }
  ngOnInit() {
    this.filteredQuotes = this.quote;
  }

  //p-dropdown status的下拉值
  status: any[] = [
    {
      name: "草稿",
      code: "draft",
    },
    {
      name: "需要審查",
      code: "need_review",
    },
    {
      name: "審查中",
      code: "in_review",
    },
    {
      name: "已批准",
      code: "approved",
    },
    {
      name: "已呈現",
      code: "presented",
    },
    {
      name: "已接受",
      code: "accepted",
    }
  ]
  OnInit() {
  }
  quote_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.quote_form = this.fb.group({
      number: [''],
      name: ['', [Validators.required]],
      opportunity_name: [''],
      syncing: [false],
      opportunity: [''],
      account_name: [''],
      status: [''],
      describe: [''],
      expiration_date: [''],
      tax: [''],
      discount: [''],
      total_price: [''],
      shipping_and_handling: [''],
      subtotal: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }

  edit: boolean = false;
  dialogHeader!: string;
  showedit = true;//判斷是否dialog為新增與編輯
  selectedStatus!: any;
  showDialog(type: string, quote?: any): void {
    this.edit = true;
    this.quote_form.controls['number'].disable();
    this.quote_form.controls['opportunity_name'].disable();
    this.quote_form.controls['account_name'].disable();
    this.quote_form.controls['subtotal'].disable();
    this.quote_form.controls['discount'].disable();
    this.quote_form.controls['updated_by'].disable();
    this.quote_form.controls['created_at'].disable();
    this.quote_form.controls['updated_at'].disable();
    if (type === 'add') {
      this.dialogHeader = '新增報價';
      this.quote_form.reset();
      this.showedit = false;
      this.quote_form.patchValue({ status: this.status[0].name });
    } else if (type === 'edit') {
      console.log("quote: " + JSON.stringify(quote))
      this.dialogHeader = '編輯報價';
      this.quote_form.patchValue(quote);
      this.showedit = true;
      // 綁定已經選擇的狀態
      this.selectedStatus = this.status.find(s => s.name === quote.status);
    }
  }
}
