import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpApiService} from 'src/app/api/http-api.service';
import {Quote} from 'src/app/shared/models/quote';
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-quote',
  templateUrl: './view-quote.component.html',
  styleUrls: ['./view-quote.component.scss']
})
export class ViewQuoteComponent {
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
  q_id: any;
  quote_form: FormGroup;
  product_form: FormGroup;

  constructor(private fb: FormBuilder, private HttpApi: HttpApiService, private route: ActivatedRoute) {
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
    this.q_id = this.route.snapshot.paramMap.get('q_id')
    console.log("取到的q_id: " + this.q_id)
    this.getOneQuotetRequest(this.q_id)
    this.getAllopportunityRequest()
    this.product_form = this.fb.group({
      price: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      discount: ['', [Validators.required]],
    })
  }

  //取得當筆報價資料
  GetOneQuote: any;
  stage: any;
  name: any;
  GetOneIsSyncing: any;
  getOneQuotetRequest(q_id: any): void {
    this.HttpApi.getOneQuotetRequest(q_id).subscribe(res => {
        this.GetOneQuote = res.body;
        this.name = res.body.name;
        this.stage = res.body.status;
        this.GetOneIsSyncing = res.body.is_syncing;
        this.quote_form.patchValue({
          name: res.body.name,
          code: res.body.code,
          status: this.status.find((s: { name: any; }) => s.name === this.GetOneQuote.status),
          opportunity_name: res.body.opportunity_name,
          opportunity_id: res.body.opportunity_id,
          is_syncing: res.body.is_syncing,
          account_id: res.body.account_id,
          description: res.body.description,
          shipping_and_handling: res.body.shipping_and_handling,
          tax: res.body.tax,
          total_price: res.body.total_price,
          expiration_date: this.formatDate2(res.body.expiration_date),
          updated_by: res.body.updated_by,
          updated_at: this.formatDate(res.body.updated_at),
          created_at: this.formatDate(res.body.created_at),
          created_by: res.body.created_by,
        });
        console.log(this.GetOneQuote)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //新增產品dialog
  add: boolean = false;

  addProduct() {
    this.add = true;
  }

  //編輯所有產品報價dialog
  edit: boolean = false;

  editProduct() {
    this.product_form.reset();
    this.edit = true;
    this.add = false;
  }

  patchQuoteRequest(q_id: any): void {
    if (this.quote_form.controls['name'].hasError('required') ||
      this.quote_form.controls['opportunity_id'].hasError('required')) {
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
      })
      return;
    }
    let expiration_date = new Date(this.quote_form.get('expiration_date')?.value);
    let body = {
      name: this.quote_form.get('name')?.value,
      status: this.quote_form.get('status')?.value.name,
      expiration_date: expiration_date.toISOString(),
      is_syncing: this.quote_form.get('is_syncing')?.value,
      account_id: this.selectedAccount_id, //帳戶ID
      description: this.quote_form.get('description')?.value,
      opportunity_id: this.selectedOpportunity_id, //商機ID
      shipping_and_handling: this.quote_form.get('shipping_and_handling')?.value,
      tax: this.quote_form.get('tax')?.value,
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45", //修改者ID(必填)
    }

    this.HttpApi.patchQuoteRequest(q_id, body).subscribe(
      Request => {
        console.log(Request)
        if (Request.code === 200) {
          Swal.fire({
            title: '成功',
            text: "已儲存您的變更 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getOneQuotetRequest(q_id)
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
  }


  showAlertCancel() {
    Swal.fire({
      title: '取消',
      text: "已取消您的變更！",
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: false,
      reverseButtons: false,
      timer: 1000
    })
    this.getOneQuotetRequest(this.q_id)
  }

  // GET全部Opportunity
  GetAllOpportunity: any[] = [];
  selectedOpportunity_id: string = '';
  getAllopportunityRequest() {
    this.HttpApi.getAllOpportunityRequest(1).subscribe(
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

  //GET全部product
  GetAllProduct: any[] = [];
  first = 0;
  getAllProductRequest(limit ?: number, page ?: number) {
    if (!page) {
      this.first = 0;
    }
    // this.HttpApi.getAllProductRequest(limit,).subscribe(res => {
    //     this.GetAllProduct = res.body.products
    //     this.GetAllProduct = res.body.products.map((product: any) => {
    //       const created_at = this.formatDate(product.created_at);
    //       const updated_at = this.formatDate(product.updated_at);
    //       return {...product, created_at, updated_at};
    //     });
    //     this.totalRecords = res.body.total;
    //     this.loading = false;
    //     console.log(this.GetAllProduct)
    //   },
    //   error => {
    //     console.log(error);
    //   });
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
    this.getAllProductRequest(limit, page);
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
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
      const expiration_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
      return expiration_date.toISOString().slice(0, 10);
    }
  }
}
