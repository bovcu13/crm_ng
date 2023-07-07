import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import Swal from "sweetalert2";
import {Table} from "primeng/table";

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent {
  @ViewChild('dt1') dt1!: Table;
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
      name: "已報價",
      code: "presented",
    },
    {
      name: "已接受",
      code: "accepted",
    }
  ]

  getAllQuoteRequest() {
    this.HttpApi.getAllQuoteRequest(this.search, 1).subscribe(
      (res) => {
        this.GetAllQuote = res.body.quotes
        this.GetAllQuote = res.body.quotes.map((quote: any) => {
          const expiration_date = this.formatDate2(quote.expiration_date)
          const created_at = this.formatDate(quote.created_at);
          const updated_at = this.formatDate(quote.updated_at);
          return {...quote, expiration_date, created_at, updated_at};
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //POST 一筆quote
  postQuoteRequest(): void {
    if (this.quote_form.controls['name'].hasError('required') ||
      this.quote_form.controls['opportunity_id'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.quote_form.controls['name'].hasError('required')) {
          this.quote_form.controls['name'].markAsDirty();
        }
        if (this.quote_form.controls['opportunity_id'].hasError('required')) {
          this.quote_form.controls['opportunity_id'].markAsDirty();
        }
        this.edit = true;
      })
      return;
    }

    if (this.quote_form.controls['name'].hasError('required')
      || this.quote_form.controls['opportunity_id'].hasError('required')) {
      return;
    }
    let body = {
      name: this.quote_form.value.name,
      account_id: this.selectedAccount_id,//帳戶ID
      expiration_date: this.quote_form.value.expiration_date,
      // is_syncing: this.quote_form.value.is_syncing,
      opportunity_id: this.selectedOpportunity_id,//商機ID
      shipping_and_handling: this.quote_form.value.shipping_and_handling,
      status: this.quote_form.value.status,
      tax: this.quote_form.value.tax,
      description: this.quote_form.value.description,
    }
    this.HttpApi.postQuoteRequest(body).subscribe(Request => {
        console.log(Request)
        this.edit = false;
        if (Request.code === 200) {
          Swal.fire({
            title: '成功',
            text: "已儲存您的資料 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllQuoteRequest()
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.edit = true;
          })
        }
      },
      error => {
        console.log(error);
      })
  }

  patchQuoteRequest(p_id: any): void {
    if (this.quote_form.controls['name'].hasError('required') ||
      this.quote_form.controls['opportunity_id'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.quote_form.controls['name'].hasError('required')) {
          this.quote_form.controls['name'].markAsDirty();
        }
        if (this.quote_form.controls['opportunity_id'].hasError('required')) {
          this.quote_form.controls['opportunity_id'].markAsDirty();
        }
        this.edit = true;
      })
      return;
    }

    this.editStatus()//處理status的值，抓取name
    if (this.quote_form.controls['name'].hasError('required')
      || this.quote_form.controls['opportunity_id'].hasError('required')) {
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
    }
    this.HttpApi.patchQuoteRequest(p_id, body).subscribe(
      Request => {
        console.log(Request)
        this.edit = false;
        if (Request.code === 200) {
          this.edit = false;
          Swal.fire({
            title: '成功',
            text: "已儲存您的變更 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllQuoteRequest()
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          }).then(() => {
            this.edit = true;
          })
        }
      });
  }


  deleteQuoteRequest(q_id: any): void {
    Swal.fire({
      title: '確認刪除？',
      icon: 'warning',
      confirmButtonColor: '#6EBE71',
      cancelButtonColor: '#FF3034',
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.deleteQuoteRequest(q_id).subscribe(Request => {
          console.log(Request)
          if (Request.code === 200) {
            this.edit = false;
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getAllQuoteRequest()
          } else {
            Swal.fire({
              title: '失敗',
              text: "請確認資料是否正確 :(",
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            })
          }
        })
      } else {
        Swal.fire({
          title: '取消',
          text: "已取消您的變更！",
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: false,
          reverseButtons: false,
          timer: 1000
        })
      }
    })
  }

  showAlertCancel() {
    this.edit = false
    Swal.fire({
      title: '取消',
      text: "已取消您的變更！",
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: false,
      reverseButtons: false,
      timer: 1000
    })
  }

  showAlertCormfirm() {
    this.edit = false
    Swal.fire({
      title: '確認將報價金額同步到商機？',
      icon: 'warning',
      confirmButtonColor: '#6EBE71',
      cancelButtonColor: '#FF3034',
      showCancelButton: true,
      confirmButtonText: '同步',
      cancelButtonText: '不同步',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.quote_form.patchValue({
          is_syncing: true,
        });
        console.log(this.quote_form.get('is_syncing')?.value)
        Swal.fire({
          title: '成功',
          text: "已成功同步金額，請按下儲存鍵 :)",
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          this.edit = true;
        })
      } else {
        this.quote_form.patchValue({
          is_syncing: false,
        });
        Swal.fire({
          title: '失敗',
          text: "已取消同步！請按下儲存鍵",
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: false,
          reverseButtons: false,
          timer: 1000
        }).then(() => {
          this.edit = true;
        })
      }
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
      total_price: [''],
      tax: [''],
      discount: [''],
      shipping_and_handling: [''],
      sub_total: [''],
      grand_total: [''],
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
      this.quote_form.patchValue({status: this.status[0].name});
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

  ngOnInit() {
    this.getAllopportunityRequest()
  }

  // GET全部Account
  GetAllOpportunity: any[] = [];
  selectedOpportunity_id: string = '';
  opportunitysearch: any;

  getAllopportunityRequest() {
    this.HttpApi.getAllOpportunityRequest(this.opportunitysearch, 1).subscribe(
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
  totalRecords = 0;
  //取得所有訂單資料
  GetAllQuote: HttpApiService[] = [];
  first = 0;
  search: string = '';  // 搜尋關鍵字
  loading: boolean = false;

  loadPostsLazy(e: any) {
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.loading = true;
    this.HttpApi.getAllQuoteRequest(this.search, 1, limit, page, e).subscribe(
      request => {
        const getquote = request.body.quotes.filter((quote: any) => quote.opportunity_id !== "00000000-0000-4000-a000-000000000000")
        this.GetAllQuote = getquote.map((quote: any) => {
          const expiration_date = this.formatDate2(quote.expiration_date)
          const created_at = this.formatDate(quote.created_at);
          const updated_at = this.formatDate(quote.updated_at);
          return {...quote, expiration_date, created_at, updated_at};
        });
        this.totalRecords = this.GetAllQuote.length;
        this.loading = false;
        console.log(this.GetAllQuote)
      });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
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
    this.quote_form.patchValue({status: statusName});
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
    if (dateString2 == "0001-01-01T00:00:00Z" || dateString2 == "1970-01-01T00:00:00Z") {
      return null
    } else {
      const date = new Date(dateString2);
      const expiration_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, date.getHours());
      return expiration_date.toISOString().slice(0, 10);
    }
  }

}
