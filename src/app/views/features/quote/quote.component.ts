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
    //p-dropdown status的下拉值
  status: any[] = [
    {
      name: "草稿",
      code: "draft",
      boolean: false
    },
    {
      name: "需要審查",
      code: "need_review",
      boolean: false
    },
    {
      name: "審查中",
      code: "in_review",
      boolean: false
    },
    {
      name: "已批准",
      code: "approved",
      boolean: false
    },
    {
      name: "已報價",
      code: "presented",
      boolean: false
    },
    {
      name: "客戶簽回",
      code: "accepted",
      boolean: false
    }
  ]

  getAllQuoteRequest() {
    this.HttpApi.getAllQuoteRequest(this.search, 1).subscribe({
      next:(res) => {
        const getquote = res.body.quotes.filter((quote: any) => quote.opportunity_id !== "00000000-0000-4000-a000-000000000000")
        this.GetAllQuote = getquote.map((quote: any) => {
          const syncing = quote.is_syncing ? '是' : '否';
          return {...quote, syncing};
        });
      },
      error:(error) => {
        console.log(error);
      }
  });
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
      expiration_date: this.quote_form.value.expiration_date,
      opportunity_id: this.quote_form.value.opportunity_id,
      shipping_and_handling: this.quote_form.value.shipping_and_handling,
      status: this.quote_form.get('status')?.value.name,
      tax: this.quote_form.value.tax,
      description: this.quote_form.value.description,
    }
    this.HttpApi.postQuoteRequest(body).subscribe({
      next: Request => {
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
      error: error => {
        console.log(error);
      }
    })
  }
//PATCH 一筆quote
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
    if (this.quote_form.controls['name'].hasError('required')
      || this.quote_form.controls['opportunity_id'].hasError('required')) {
      return;
    }
    let body = {
      name: this.quote_form.get('name')?.value,
      status: this.quote_form.get('status')?.value.name,
      expiration_date: this.quote_form.get('expiration_date')?.value,
      is_syncing: this.quote_form.get('is_syncing')?.value,
      description: this.quote_form.get('description')?.value,
      opportunity_id: this.quote_form.get('opportunity_id')?.value,
      shipping_and_handling: this.quote_form.get('shipping_and_handling')?.value,
      tax: this.quote_form.get('tax')?.value,
    }
    this.HttpApi.patchQuoteRequest(p_id, body).subscribe({
      next: Request => {
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
      },
      error: error => {
        console.log(error);
      }
    });
  }
//Delete 一筆quote
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
        this.HttpApi.deleteQuoteRequest(q_id).subscribe({
          next: Request => {
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
          },
          error: error => {
            console.log(error);
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
      tax: [0],
      discount: [''],
      shipping_and_handling: [0],
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
  disableSaveButton: boolean = false
  // 點擊表頭狀態列執行搜尋
  toggleStatusFilter(index: number) {
    // 若已被點擊過則取消 filter
    if (this.status[index].boolean) {
      this.getAllQuoteRequest();
      this.status[index].boolean = false
    }
    // 將所有狀態值改為 false，並且將點擊狀態改為true、執行該狀態 filter
    else {
      this.dt1.filterGlobal(this.status[index].name, 'contains');
      for (let i in this.status) {
        this.status[i].boolean = false
      }
      this.status[index].boolean = true
    }
  }

  showDialog(type: string, quote?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增報價';
      this.quote_form.reset();
      this.showedit = false;
      this.quote_form.patchValue({status: this.status.find(s => s.name === this.status[0].name),});
      this.quote_form.controls['status'].disable();
    } else if (type === 'edit') {
      console.log("quote: " + JSON.stringify(quote))
      this.dialogHeader = '編輯報價';
      if (quote.status === "客戶簽回") {
        this.quote_form.patchValue({
          status: this.status.find((s: { name: any; }) => s.name === quote.status),
        });
        this.quote_form.controls['status'].disable();
        this.disableSaveButton = true;
      }else{
        this.quote_form.controls['status'].enable();
        this.disableSaveButton = false;
      }
      this.quote_form.patchValue(quote);
      this.quote_form.patchValue({
        opportunity_id: this.GetAllOpportunity.find((opportunity: { name: any; }) => opportunity.name === quote.opportunity_name),
        status: this.status.find((s: { name: any; }) => s.name === quote.status),
        expiration_date: new Date(this.quote_form.value.expiration_date),
      });
      this.showedit = true;
      // 綁定已經選擇的狀態
      this.selectedStatus = this.status.find(s => s.name === quote.status);
      this.q_id = quote.quote_id
    }
  }

  ngOnInit() {
    this.getAllOpportunitiesSelection()
  }

  // GET全部Opportunity
  GetAllOpportunity: any[] = [];
  //取得商機階段如果不到提案或談判狀態就無法選擇
  getAllOpportunitiesSelection() {
    this.HttpApi.getAllOpportunitiesSelection("提案,談判").subscribe({
      next: (res) => {
        this.GetAllOpportunity = res.body.opportunities
        console.log(this.GetAllOpportunity)
      },
      error: (error) => {
        console.log(error);
      }
    });
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
        //如果商機沒有被選取則無法顯示這筆報價
        const getquote = request.body.quotes.filter((quote: any) => quote.opportunity_id !== "00000000-0000-4000-a000-000000000000")
        this.GetAllQuote = getquote.map((quote: any) => {
          const syncing = quote.is_syncing ? '是' : '否';
          return {...quote, syncing};
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

}
