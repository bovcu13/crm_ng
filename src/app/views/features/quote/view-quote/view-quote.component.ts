import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpApiService} from 'src/app/api/http-api.service';
import Swal from "sweetalert2";
import {Table} from "primeng/table";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-view-quote',
  templateUrl: './view-quote.component.html',
  styleUrls: ['./view-quote.component.scss'],
  providers: [DatePipe]
})
export class ViewQuoteComponent {
  @ViewChild('dt1') dt1!: Table;
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
      name: "客戶簽回",
      code: "accepted",
    }
  ]
  q_id: any;
  quote_form: FormGroup;
  quote_product_form: FormGroup;

  constructor(private fb: FormBuilder, private HttpApi: HttpApiService, private route: ActivatedRoute,
              private datePipe: DatePipe) {
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
      tax: [0],
      discount: [''],
      total_price: [''],
      shipping_and_handling: [0],
      sub_total: [''],
      grand_total: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    this.q_id = this.route.snapshot.paramMap.get('q_id')
    console.log("取到的q_id: " + this.q_id)
    this.getQuoteProductRequest()
    this.getOneQuoteRequest(this.q_id)
    this.getAllopportunityRequest()
    this.getAllProductRequest()
    this.getAllQuoteHistoricalRecordsRequest(this.q_id)
    // this.getAllQuoteProductsRequest()
    this.quote_product_form = this.fb.group({
      quote_product_id: [''],
      product_name: [''],
      code: [''],
      standard_price: [''],
      product_id: [''],
      quote_id: [''],
      sub_total: [''],
      unit_price: [0, [Validators.required]],
      quantity: ['', [Validators.required]],
      discount: [0, [Validators.required]],
      total_price: [''],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

//編輯單一產品報價dialog
  editOneQuoteProduct: boolean = false;
  GetOneQuoteProduct: any;

  editOneProduct(quote_product?: any) {
    this.editOneQuoteProduct = true;
    this.GetOneQuoteProduct = quote_product
    this.quote_product_form.patchValue(quote_product);
    console.log("quote_product: " + JSON.stringify(quote_product))
  }

  //新增產品dialog
  add: boolean = false;

  addProduct() {
    this.add = true;
    this.selectedProducts = [];
    this.getAllProductRequest()
  }

  selectedProducts: any[] = []//儲存被選的商品
  //編輯所有產品報價dialog
  editselectedProducts: boolean = false;
  editGetAllQuoteProduct: boolean = false;
  showErrorMessage = false;

  editProduct() {
    if (this.GetAllQuoteProduct.length !== 0) {
      this.GetAllQuoteProduct.forEach((product) => {
        this.quote_product_form.addControl(`unit_price_${product.quote_product_id}`, this.fb.control((product.unit_price), Validators.required));
        this.quote_product_form.addControl(`quantity_${product.quote_product_id}`, this.fb.control((product.quantity), Validators.required));
        this.quote_product_form.addControl(`discount_${product.quote_product_id}`, this.fb.control((product.discount), Validators.required));
      });
      this.editGetAllQuoteProduct = true;
    }
  }

  editSelectedProduct() {
    if (this.selectedProducts.length !== 0) {
      this.selectedProducts.forEach((product) => {
        this.quote_product_form.addControl(`unit_price_${product.product_id}`, new FormControl(0, Validators.required));
        this.quote_product_form.addControl(`quantity_${product.product_id}`, new FormControl('', Validators.required));
        this.quote_product_form.addControl(`discount_${product.product_id}`, new FormControl(0, Validators.required));
      });
      this.editselectedProducts = true;
      this.editGetAllQuoteProduct = false;
      this.add = false;
      console.log(this.selectedProducts)
    }
    if (this.selectedProducts.length === 0) {
      this.editselectedProducts = false;
      this.showErrorMessage = true;
      return;
    }

  }

  //取得當筆報價資料
  GetOneQuote: any;
  stage: any;
  name: any;
  GetOneIsSyncing: any;

  getOneQuoteRequest(q_id: any): void {
    this.HttpApi.getOneQuoteRequest(q_id).subscribe({
      next: res => {
        this.GetOneQuote = res.body;
        this.name = res.body.name;
        this.stage = res.body.status;
        this.GetOneIsSyncing = res.body.is_syncing ? '是' : '否';
        this.quote_form.patchValue(res.body)
        this.quote_form.patchValue({
          status: this.status.find((s: { name: any; }) => s.name === this.GetOneQuote.status),
          expiration_date: new Date(res.body.expiration_date)
        });
        console.log(this.GetOneQuote)
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  postQuoteProductRequest(): void {
    let postEmptyField = false;
    this.selectedProducts.forEach((product) => {
      if (this.quote_product_form.controls[`unit_price_${product.product_id}`].hasError('required') ||
        this.quote_product_form.controls[`quantity_${product.product_id}`].hasError('required') ||
        this.quote_product_form.controls[`discount_${product.product_id}`].hasError('required')) {
        postEmptyField = true;
        this.editselectedProducts = false;
        Swal.fire({
          title: '未填寫',
          text: "請填寫必填欄位！",
          icon: 'warning',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          if (this.quote_product_form.controls[`unit_price_${product.product_id}`].hasError('required')) {
            this.quote_product_form.controls[`unit_price_${product.product_id}`].markAsDirty();
          }
          if (this.quote_product_form.controls[`quantity_${product.product_id}`].hasError('required')) {
            this.quote_product_form.controls[`quantity_${product.product_id}`].markAsDirty();
          }
          if (this.quote_product_form.controls[`discount_${product.product_id}`].hasError('required')) {
            this.quote_product_form.controls[`discount_${product.product_id}`].markAsDirty();
          }
          this.editselectedProducts = true;
        })
        return;
      }
      if (postEmptyField) {
        return;
      }
      if (this.quote_product_form.controls[`unit_price_${product.product_id}`].hasError('required')
        || this.quote_product_form.controls[`quantity_${product.product_id}`].hasError('required') ||
        this.quote_product_form.controls[`discount_${product.product_id}`].hasError('required')) {
        return;
      }
      const quoteProducts = []
      const unit_price = this.quote_product_form.get(`unit_price_${product.product_id}`)?.value;
      const quantity = this.quote_product_form.get(`quantity_${product.product_id}`)?.value;
      const discount = this.quote_product_form.get(`discount_${product.product_id}`)?.value;
      const quoteProduct = {
        quote_id: this.q_id,
        product_id: product.product_id,
        unit_price: unit_price,
        quantity: quantity,
        discount: discount,
        description: ' ',
      };
      quoteProducts.push(quoteProduct);
      this.HttpApi.postQuoteProductRequest({products: quoteProducts}).subscribe({
        next: Request => {
          console.log(Request)
          this.editselectedProducts = false;
          if (Request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已儲存您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.selectedProducts = []
            this.getQuoteProductRequest()
            this.getOneQuoteRequest(this.q_id)
            this.getAllQuoteHistoricalRecordsRequest(this.q_id)
            this.getAllProductRequest()
            //this.getAllQuoteProductsRequest()
          } else {
            Swal.fire({
              title: '失敗',
              text: "請確認資料是否正確 :(",
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.editselectedProducts = true;
            })
          }
        },
        error: error => {
          console.log(error);
        }
      })
    })
  }

  patchQuoteProductRequest(): void {
    this.GetAllQuoteProduct.forEach((product) => {
      if (this.quote_product_form.controls[`unit_price_${product.quote_product_id}`].hasError('required') ||
        this.quote_product_form.controls[`quantity_${product.quote_product_id}`].hasError('required') ||
        this.quote_product_form.controls[`discount_${product.quote_product_id}`].hasError('required')) {
        this.editGetAllQuoteProduct = false;
        Swal.fire({
          title: '未填寫',
          text: "請填寫必填欄位！",
          icon: 'warning',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          if (this.quote_product_form.controls[`unit_price_${product.quote_product_id}`].hasError('required')) {
            this.quote_product_form.controls[`unit_price_${product.quote_product_id}`].markAsDirty();
          }
          if (this.quote_product_form.controls[`quantity_${product.quote_product_id}`].hasError('required')) {
            this.quote_product_form.controls[`quantity_${product.quote_product_id}`].markAsDirty();
          }
          if (this.quote_product_form.controls[`discount_${product.quote_product_id}`].hasError('required')) {
            this.quote_product_form.controls[`discount_${product.quote_product_id}`].markAsDirty();
          }
          this.editGetAllQuoteProduct = true;
        })
        return;
      }
      if (this.quote_product_form.controls[`unit_price_${product.quote_product_id}`].hasError('required')
        || this.quote_product_form.controls[`quantity_${product.quote_product_id}`].hasError('required') ||
        this.quote_product_form.controls[`discount_${product.quote_product_id}`].hasError('required')) {
        return;
      }
      const quoteProducts = [];
      const unit_price = this.quote_product_form.get(`unit_price_${product.quote_product_id}`)?.value;
      const quantity = this.quote_product_form.get(`quantity_${product.quote_product_id}`)?.value;
      const discount = this.quote_product_form.get(`discount_${product.quote_product_id}`)?.value;
      const quoteProduct = {
        quote_product_id: product.quote_product_id,
        quote_id: this.q_id,
        product_id: product.product_id,
        unit_price: unit_price,
        quantity: quantity,
        discount: discount,
      };
      quoteProducts.push(quoteProduct);
      this.HttpApi.patchQuoteProductRequest({products: quoteProducts}).subscribe({
        next: Request => {
          console.log(Request)
          this.editGetAllQuoteProduct = false;
          if (Request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已儲存您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getQuoteProductRequest()
            this.getOneQuoteRequest(this.q_id)
            this.getAllQuoteHistoricalRecordsRequest(this.q_id)
            this.getAllProductRequest()
            //this.getAllQuoteProductsRequest()
          } else {
            Swal.fire({
              title: '失敗',
              text: "請確認資料是否正確 :(",
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.editGetAllQuoteProduct = true;
            })
          }
        },
        error: error => {
          console.log(error);
        }
      })
    })
  }

  //一次刪除多個報價商品
  deleteSelectQuoteProduct: any[] = []
  deletequoteproduct: any[] = []
  ErrorMessage = false;

  deleteSelectQuoteProductRequest(): void {
    if (this.deleteSelectQuoteProduct.length == 0) {
      this.ErrorMessage = true;
    } else {
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
          this.deletequoteproduct = this.deleteSelectQuoteProduct.map(product => product.quote_product_id);
          this.HttpApi.deleteQuoteProductRequest({products: this.deletequoteproduct}).subscribe({
            next: Request => {
              console.log(Request);
              if (Request.code === 200) {
                Swal.fire({
                  title: '成功',
                  text: "已刪除您的資料 :)",
                  icon: 'success',
                  showConfirmButton: false,
                  timer: 1000
                });
                this.getQuoteProductRequest()
                this.getOneQuoteRequest(this.q_id)
                this.getAllQuoteHistoricalRecordsRequest(this.q_id)
                this.getAllProductRequest()
                //this.getAllQuoteProductsRequest();
              } else {
                Swal.fire({
                  title: '失敗',
                  text: "請確認資料是否正確 :(",
                  icon: 'error',
                  showConfirmButton: false,
                  timer: 1500
                });
              }
            },
            error: error => {
              console.log(error);
            }
          });
        } else {
          Swal.fire({
            title: '取消',
            text: "已取消您的變更！",
            icon: 'error',
            showCancelButton: false,
            showConfirmButton: false,
            reverseButtons: false,
            timer: 1000
          });
        }
      });
    }
  }

  //刪除單個報價商品
  deleteQuoteProductRequest(quote_product_id: string): void {
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
        const quoteProducts: string[] = [quote_product_id];
        console.log({products: quoteProducts});
        this.HttpApi.deleteQuoteProductRequest({products: quoteProducts}).subscribe({
          next: Request => {
            console.log(Request);
            if (Request.code === 200) {
              Swal.fire({
                title: '成功',
                text: "已刪除您的資料 :)",
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              });
              this.getQuoteProductRequest()
              this.getOneQuoteRequest(this.q_id)
              this.getAllQuoteHistoricalRecordsRequest(this.q_id)
              this.getAllProductRequest()
              //this.getAllQuoteProductsRequest();
            } else {
              Swal.fire({
                title: '失敗',
                text: "請確認資料是否正確 :(",
                icon: 'error',
                showConfirmButton: false,
                timer: 1500
              });
            }
          },
          error: error => {
            console.log(error);
          }
        });
      } else {
        Swal.fire({
          title: '取消',
          text: "已取消您的變更！",
          icon: 'error',
          showCancelButton: false,
          showConfirmButton: false,
          reverseButtons: false,
          timer: 1000
        });
      }
    });
  }

  patchOneQuoteProductRequest(): void {
    if (this.quote_product_form.controls['unit_price'].hasError('required') ||
      this.quote_product_form.controls['quantity'].hasError('required') ||
      this.quote_product_form.controls['discount'].hasError('required')) {
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.quote_product_form.controls['unit_price'].hasError('required')) {
          this.quote_product_form.controls['unit_price'].markAsDirty();
        }
        if (this.quote_product_form.controls['quantity'].hasError('required')) {
          this.quote_product_form.controls['quantity'].markAsDirty();
        }
        if (this.quote_product_form.controls['discount'].hasError('required')) {
          this.quote_product_form.controls['discount'].markAsDirty();
        }
        this.editOneQuoteProduct = true;
      })
      return;
    }
    let quoteProducts = [];
    const unit_price = this.quote_product_form.get(`unit_price`)?.value;
    const quantity = this.quote_product_form.get(`quantity`)?.value;
    const discount = this.quote_product_form.get(`discount`)?.value;
    const description = this.quote_product_form.get(`description`)?.value;
    const quoteProduct = {
      quote_product_id: this.GetOneQuoteProduct.quote_product_id,
      quote_id: this.q_id,
      product_id: this.GetOneQuoteProduct.product_id,
      unit_price: unit_price,
      quantity: quantity,
      discount: discount,
      description: description
    };
    quoteProducts.push(quoteProduct);
    this.HttpApi.patchQuoteProductRequest({products: quoteProducts}).subscribe(
      {
        next: Request => {
          this.editOneQuoteProduct = false;
          if (Request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已儲存您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getQuoteProductRequest()
            this.getOneQuoteRequest(this.q_id)
            this.getAllQuoteHistoricalRecordsRequest(this.q_id)
            this.getAllProductRequest()
            //this.getAllQuoteProductsRequest()
          } else {
            Swal.fire({
              title: '失敗',
              text: "請確認資料是否正確 :(",
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.editOneQuoteProduct = true;
            })
          }
        },
        error: error => {
          console.log(error);
        }
      })
  }

  GetAllQuoteProduct: any[] = [];
  getQuoteProductRequest() {
    this.QuoteProductloading = true;
    this.HttpApi.getQuoteProductRequest(this.q_id).subscribe(
      request => {
        this.GetAllQuoteProduct = request.body.products
        console.log(this.GetAllQuoteProduct)
        this.QuoteProductloading = false;
      });
  }

  ngOnInit(): void {
    this.getAllProductRequest();
  }
  QuoteProductloading: boolean = false;
  GetAllProduct!: any[];
  productsearch: any;
  totalRecords = 0;

  getAllProductRequest() {
    this.HttpApi.getAllProductRequest(this.productsearch,1,20).subscribe({
      next: Request => {
        if (this.GetAllQuoteProduct !== undefined) {
          const product = Request.body.products.filter((product: any) => product.is_enable === true)
          // 过滤掉已被选择的产品
          this.GetAllProduct = product.filter((product: any) => {
            return !this.GetAllQuoteProduct.some((quoteProduct: any) => quoteProduct.product_id === product.product_id);
          });
        } else {
          this.GetAllProduct = Request.body.products.filter((product: any) => product.is_enable === true)
        }
        this.totalRecords = this.GetAllProduct.length;
      },
      error: error => {
        console.log(error);
      }
    })
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
    expiration_date.setHours(expiration_date.getHours() + 8);
    console.log(expiration_date)
    let body = {
      name: this.quote_form.get('name')?.value,
      status: this.quote_form.get('status')?.value.name,
      expiration_date: new Date(expiration_date).toISOString(),
      is_syncing: this.quote_form.get('is_syncing')?.value,
      account_id: this.selectedAccount_id, //帳戶ID
      description: this.quote_form.get('description')?.value,
      opportunity_id: this.selectedOpportunity_id, //商機ID
      shipping_and_handling: this.quote_form.get('shipping_and_handling')?.value,
      tax: this.quote_form.get('tax')?.value,
    }

    this.HttpApi.patchQuoteRequest(q_id, body).subscribe({
      next: Request => {
        console.log(Request)
        if (Request.code === 200) {
          Swal.fire({
            title: '成功',
            text: "已儲存您的變更 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getOneQuoteRequest(q_id)
          this.getAllQuoteHistoricalRecordsRequest(this.q_id)
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
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              window.location.href = '/main/quote';
            });
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
    this.editOneQuoteProduct = false
    this.editGetAllQuoteProduct = false
    this.editselectedProducts = false
    this.add = false
    Swal.fire({
      title: '取消',
      text: "已取消您的變更！",
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: false,
      reverseButtons: false,
      timer: 1000
    })
    this.getOneQuoteRequest(this.q_id)
  }

  showAlertCormfirm() {
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
        })
      }
    })
  }

  // GET全部Opportunity
  GetAllOpportunity: any[] = [];
  selectedOpportunity_id: string = '';
  opportunitysearch: any;

  getAllopportunityRequest() {
    this.HttpApi.getAllOpportunityRequest(this.opportunitysearch, 1).subscribe({
      next: (res) => {
        //商機階段如果不到提案狀態就無法選擇
        const getopportunity = res.body.opportunities.filter((opportunity: any) => opportunity.stage !== "資格評估" && opportunity.stage !== "需求分析");
        this.GetAllOpportunity = getopportunity.map((opportunity: any) => {
          return {
            label: opportunity.name,
            value: opportunity.opportunity_id,
            account_id: opportunity.account_id,
          };
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  selectedAccount_id: string = '';

  //取得選擇的商機帳戶id
  selectedOpportunity() {
    const selectedOpportunity = this.GetAllOpportunity.find((opportunity) => opportunity.value === this.selectedOpportunity_id);
    this.selectedAccount_id = selectedOpportunity?.account_id;
  }


  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }

  //取得當筆報價歷史紀錄
  GetQuoteHistoricalRecords: any[] = [];
  totalHistorical: any;

  getAllQuoteHistoricalRecordsRequest(q_id: any) {
    this.HttpApi.getAllHistoricalRecordsRequest(20, 1, q_id).subscribe(res => {
        this.GetQuoteHistoricalRecords = res.body.historical_records
        this.totalHistorical = res.body.total
      this.GetQuoteHistoricalRecords.forEach((record) => {
        if (record.content.startsWith('修改報價到期日期為')) {
          const formattedDate = this.datePipe.transform(record.value, 'yyyy-MM-dd');
          record.value = formattedDate || record.value;
        }
      });
        console.log(this.GetQuoteHistoricalRecords)
      }
    )
  }
}
