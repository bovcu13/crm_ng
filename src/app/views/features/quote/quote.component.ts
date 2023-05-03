import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpApiService } from "../../../api/http-api.service";
@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent {
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
    if (!this.filterText) {
      this.getAllQuoteRequest();
      return;
    }
    this.GetAllQuote = this.GetAllQuote.filter((quote) => {
      // 將所有要比對的欄位轉成小寫字母
      const name = quote.name?.toLowerCase() || '';
      const code = quote.code?.toString().toLowerCase() || '';
      const opportunity_name = quote.opportunity_name?.toLowerCase() || '';
      const account_name = quote.account_name?.toLowerCase() || '';
      const status = quote.status?.toLowerCase() || '';
      const description = quote.description?.toLowerCase() || '';
      const expiration_date = quote.expiration_date?.toLowerCase() || '';
      const tax = quote.tax?.toString().toLowerCase() || '';
      const shipping_and_handling = quote.shipping_and_handling?.toString().toLowerCase() || '';
      const subtotal = quote.subtotal?.toString().toLowerCase() || '';
      return (
        code.includes(this.filterText.toLowerCase()) ||
        name.includes(this.filterText.toLowerCase()) ||
        opportunity_name.includes(this.filterText) ||
        account_name.includes(this.filterText) ||
        (quote.is_syncing ? 'true' : 'false').toLowerCase().includes(this.filterText.toLowerCase()) ||
        status.includes(this.filterText.toLowerCase()) ||
        description.includes(this.filterText.toLowerCase()) ||
        expiration_date.includes(this.filterText.toLowerCase()) ||
        tax.includes(this.filterText.toLowerCase().toLowerCase()) ||
        shipping_and_handling.includes(this.filterText.toLowerCase()) ||
        subtotal.includes(this.filterText.toLowerCase())
      );
    });
    console.log(this.GetAllQuote)
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
  ngOnInit() {
    this.getAllopportunityRequest()
  }

  //取得所有訂單資料
  GetAllQuote: HttpApiService[] = [];
  first = 0;
  getAllQuoteRequest(limit?: number, page?: number) {
    if (!page) {
      this.first = 0;
    }
    this.HttpApi.getAllQuoteRequest(limit, page).subscribe(
      (res) => {
        this.GetAllQuote = res.body.quotes
        this.GetAllQuote = res.body.quotes.map((quote: any) => {
          const expiration_date = this.formatDate2(quote.expiration_date)
          const created_at = this.formatDate(quote.created_at);
          const updated_at = this.formatDate(quote.updated_at);
          return { ...quote, expiration_date, created_at, updated_at };
        });
        this.totalRecords = res.body.total;
        this.loading = false;
        console.log(this.GetAllQuote)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //POST 一筆quote
  postQuoteRequest(): void {
    if (this.quote_form.controls['name'].hasError('required')
    || this.quote_form.controls['opportunity_id'].hasError('required') ) {
      return;
    }
    let body = {
      name: this.quote_form.value.name,
      account_id: this.selectedAccount_id,//帳戶ID
      expiration_date: this.quote_form.value.expiration_date,
      is_syncing: this.quote_form.value.is_syncing,
      opportunity_id: this.selectedOpportunity_id,//商機ID
      shipping_and_handling: this.quote_form.value.shipping_and_handling,
      status: this.quote_form.value.status,
      tax: this.quote_form.value.tax,
      description: this.quote_form.value.description,
      created_by: "7f5443f8-e607-4793-8370-560b8b688a61",
    }
    this.HttpApi.postQuoteRequest(body).subscribe(Request => {
      console.log(Request)
      this.getAllQuoteRequest()
      this.edit = false;
    },
      error => {
        console.log(error);
      })
  }

  patchQuoteRequest(p_id: any): void {
    this.editStatus()//處理status的值，抓取name
    if (this.quote_form.controls['name'].hasError('required')
    || this.quote_form.controls['opportunity_id'].hasError('required') ) {
      return;
    }
    let expiration_date = new Date(this.quote_form.get('expiration_date')?.value);
    let body = {
      name: this.quote_form.get('name')?.value,
      status: this.quote_form.get('status')?.value,
      expiration_date: expiration_date.toISOString(),
      is_syncing: this.quote_form.get('is_syncing')?.value,
      account_id: this.selectedAccount_id, //帳戶ID
      description: this.quote_form.get('description')?.value,
      opportunity_id: this.selectedOpportunity_id, //商機ID
      shipping_and_handling: this.quote_form.get('shipping_and_handling')?.value,
      tax: this.quote_form.get('tax')?.value,
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45", //修改者ID(必填)
    }
    this.HttpApi.patchQuoteRequest(p_id, body).subscribe(
      Request => {
        console.log(Request)
        this.edit = false;
        this.getAllQuoteRequest()
      })
  }
  deleteQuoteRequest(p_id: any): void {
    this.HttpApi.deleteQuoteRequest(p_id).subscribe(Request => {
      console.log(Request)
      this.getAllQuoteRequest()
    })
  }

  quote_form: FormGroup;
  constructor(private fb: FormBuilder, private HttpApi: HttpApiService) {
    this.quote_form = this.fb.group({
      quote_id: [''],
      code: [''],
      name: ['', [Validators.required]],
      opportunity_id: ['', [Validators.required]],
      opportunity_name: [''],
      is_syncing: [false],
      account_id: ['', [Validators.required]],
      account_name: [''],
      status: [''],
      description: [''],
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

  edit: boolean = false;
  dialogHeader!: string;
  showedit = true;//判斷是否dialog為新增與編輯
  selectedStatus!: any;
  q_id: any;
  showDialog(type: string, quote?: any): void {
    this.edit = true;
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
      this.q_id = quote.quote_id
    }
  }


  // GET全部Account
  GetAllOpportunity: any[] = [];
  selectedOpportunity_id: string = '';
  getAllopportunityRequest() {
    this.HttpApi.getAllopportunityRequest(1).subscribe(
      (res) => {
        this.GetAllOpportunity = res.body.opportunities.map((opportunity: any) => {
          return {
            label: opportunity.name,
            value: opportunity.opportunity_id,
            account_id: opportunity.account_id,
          };
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  selectedAccount_id: string = '';
  //取得選擇的商機帳戶id
  selectedOpportunity() {
    const selectedOpportunity = this.GetAllOpportunity.find((opportunity) => opportunity.value === this.selectedOpportunity_id);
    this.selectedAccount_id = selectedOpportunity?.account_id;
  }

  // table lazyload
  // 搜尋關鍵字
  //search: string = '';
  loading: boolean = true;
  totalRecords = 0;
  loadPostsLazy(e: any) {
    this.loading = true;
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.getAllQuoteRequest(limit, page);
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }
  //處理status的值
  editStatus(): void {
    //判斷selectedStatus是否有值，若有值則取出name屬性
    let statusName = this.selectedStatus ? this.selectedStatus.name : "";
    //將statusName更新到表單中
    this.quote_form.patchValue({ status: statusName });
  }

  //日期轉換
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + (date.getDate())).slice(-2);
    const hour = ("0" + (date.getHours())).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
  //拿到到期日期轉格式
  formatDate2(dateString2: string): any {
    if(dateString2 == "0001-01-01T00:00:00Z" || dateString2 == "1970-01-01T00:00:00Z"){
      return null
    }else{
    const date = new Date(dateString2);
    const expiration_date = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, date.getHours());
    return expiration_date.toISOString().slice(0, 10);
    }
  }

}
