import {Component} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpApiService} from 'src/app/api/http-api.service';
import Swal from 'sweetalert2';
import _default from "chart.js/dist/plugins/plugin.tooltip";
import numbers = _default.defaults.animations.numbers;

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss'],
})
export class ViewOrderComponent {
  order_log: any[] = [
    {
      date: "2023-05-06 08:00",
      user: "林",
      status: "已建立",
    },
    {
      date: "2023-05-07 17:00",
      user: "林",
      status: "更改狀態",
    },
  ]

  //p-dropdown status的下拉值
  status: any[] = [
    {
      name: "草稿",
      code: "draft",
    },
    {
      name: "啟動中",
      code: "activated",
    }
  ]

  ngOnInit(): void {
    this.getOrderProductRequest(this.o_id);
  }

  //取得當筆報價資料
  GetOneOrder: any;
  stage: any;
  GetOneStartDate: any;

  getOneOrderRequest(o_id: any): void {
    this.HttpApi.getOneOrderRequest(o_id).subscribe({
      next: res => {
        this.GetOneOrder = res.body
        this.stage = res.body.status;
        this.GetOneStartDate = this.formatDate2(res.body.start_date);
        this.order_form.patchValue({
          code: res.body.code,
          status: this.status.find((s: { name: any; }) => s.name === this.GetOneOrder.status),
          start_date: this.formatDate2(res.body.start_date),
          account_id: res.body.account_id,
          account_name: res.body.account_name,
          contract_id: res.body.contract_id,
          contract_code: res.body.contract_code,
          grand_total: res.body.grand_total,
          description: res.body.description,
          activated_by: res.body.activated_by,
          activated_at: this.formatDate(res.body.activated_at),
          updated_by: res.body.updated_by,
          updated_at: this.formatDate(res.body.updated_at),
          created_at: this.formatDate(res.body.created_at),
          created_by: res.body.created_by,
        });
        console.log(this.GetOneOrder)
      },
      error: error => {
        console.log(error);
      }
    });
  }

  GetOrderProduct: any[]=[]
  //GET這筆訂單的所有訂單產品
  getOrderProductRequest(o_id: any): void {
    this.HttpApi.getOrderProductRequest(o_id).subscribe({
      next: res => {
        this.GetOrderProduct = res.body.products.map((order: any) => {
          const quote_price = order.quote_price != null ? order.quote_price : "-";
          return { ...order, quote_price };
        });
        console.log(this.GetOrderProduct);
      },
      error: error => {
        console.log(error);
      }
    });
  }

  GetAllProduct: any[] = [];
  totalRecords = 0;
  //GET 取得可選取所有商品含報價金額
  getAllOrderProductRequest():void{
    this.HttpApi.getAllOrderProdcutRequest(this.search, this.o_id,1).subscribe({
      next: res => {
        const product = res.body.products.filter((product: any) => product.is_enable === true)
        this.GetAllProduct = product.map((product: any) => {
          const created_at = this.formatDate(product.created_at);
          const updated_at = this.formatDate(product.updated_at);
          //如果quote_price為0，則轉成 - 字串
          const quote_price = product.quote_price === 0 ? "-" : product.quote_price;
          return {...product, quote_price, created_at, updated_at};
        });
        if (this.GetOrderProduct !== undefined){
          this.GetAllProduct = this.GetAllProduct.filter((product: any) => {
            return !this.GetOrderProduct.some((existingProduct: any) => existingProduct.product_id === product.product_id);
          });
        }
        this.totalRecords = res.body.total;
        console.log(this.GetAllProduct)
      },
      error: error => {
        console.log(error);
      }
    });
  }

  //POST 訂單產品
  postOrderProductRequest(): void {
    let postEmptyField = false;
    this.selectedProducts.forEach((product) => {
      if (this.edit_product_form.controls[`quantity_${product.product_id}`].hasError('required') ||
        this.edit_product_form.controls[`unit_price_${product.product_id}`].hasError('required')) {
        postEmptyField = true;
        this.editSelectOrderProducts = false;
        Swal.fire({
          title: '未填寫',
          text: "請填寫必填欄位！",
          icon: 'warning',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          if (this.edit_product_form.controls[`quantity_${product.product_id}`].hasError('required')) {
            this.edit_product_form.controls[`quantity_${product.product_id}`].markAsDirty();
          }
          if (this.edit_product_form.controls[`unit_price_${product.product_id}`].hasError('required')) {
            this.edit_product_form.controls[`unit_price_${product.product_id}`].markAsDirty();
          }
          this.editSelectOrderProducts = true;
        })
        return;
      }
      if (postEmptyField) {
        return;
      }
      if (this.edit_product_form.controls[`unit_price_${product.product_id}`].hasError('required')
        || this.edit_product_form.controls[`quantity_${product.product_id}`].hasError('required')) {
        return;
      }
      const orderProducts = []
      const unit_price = this.edit_product_form.get(`unit_price_${product.product_id}`)?.value;
      const quantity = this.edit_product_form.get(`quantity_${product.product_id}`)?.value;
      if(product.quote_price == "-"){
        product.quote_price = 0
      }
      const orderProduct = {
        order_id: this.o_id,
        product_id: product.product_id,
        quote_price: product.quote_price,
        unit_price: unit_price,
        quantity: quantity,
        description: ' ',
      };
      orderProducts.push(orderProduct);
      this.HttpApi.postOrderProductRequest({products: orderProducts}).subscribe({
        next: Request => {
          console.log(Request)
          this.editSelectOrderProducts = false;
          if (Request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已儲存您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getOneOrderRequest(this.o_id)
            this.getAllOrderProductRequest()
            this.getOrderProductRequest(this.o_id)
            this.selectedProducts = []
          } else {
            Swal.fire({
              title: '失敗',
              text: "請確認資料是否正確 :(",
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.editSelectOrderProducts = true;
            })
          }
        },
        error: error => {
          console.log(error);
        }
      })
    })
  }

//patch 一次修改多筆訂單商品
  patchOrderProductRequest(): void {
    this.GetOrderProduct.forEach((product) => {
      if (this.edit_product_form.controls[`unit_price_${product.order_product_id}`].hasError('required') ||
        this.edit_product_form.controls[`quantity_${product.order_product_id}`].hasError('required')) {
        this.editGetAllOrderProduct = false;
        Swal.fire({
          title: '未填寫',
          text: "請填寫必填欄位！",
          icon: 'warning',
          showConfirmButton: false,
          timer: 1000
        }).then(() => {
          if (this.edit_product_form.controls[`unit_price_${product.order_product_id}`].hasError('required')) {
            this.edit_product_form.controls[`unit_price_${product.order_product_id}`].markAsDirty();
          }
          if (this.edit_product_form.controls[`quantity_${product.order_product_id}`].hasError('required')) {
            this.edit_product_form.controls[`quantity_${product.order_product_id}`].markAsDirty();
          }
          this.editGetAllOrderProduct = true;
        })
        return;
      }
      if (this.edit_product_form.controls[`unit_price_${product.order_product_id}`].hasError('required')
        || this.edit_product_form.controls[`quantity_${product.order_product_id}`].hasError('required')) {
        return;
      }
      const orderProducts = []
      const unit_price = this.edit_product_form.get(`unit_price_${product.order_product_id}`)?.value;
      const quantity = this.edit_product_form.get(`quantity_${product.order_product_id}`)?.value;
      if(product.quote_price == "-"){
        product.quote_price = 0
      }
      const orderProduct = {
        order_product_id: product.order_product_id,
        quote_price: product.quote_price,
        order_id: this.o_id,
        product_id: product.product_id,
        unit_price: unit_price,
        quantity: quantity,
      };
      orderProducts.push(orderProduct);
      this.HttpApi.patchOrderProductRequest({products: orderProducts}).subscribe({
        next: Request => {
          console.log(Request)
          this.editGetAllOrderProduct = false;
          if (Request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已儲存您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getOneOrderRequest(this.o_id)
            this.getAllOrderProductRequest()
            this.getOrderProductRequest(this.o_id)
          } else {
            Swal.fire({
              title: '失敗',
              text: "請確認資料是否正確 :(",
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.editGetAllOrderProduct = true;
            })
          }
        },
        error: error => {
          console.log(error);
        }
      })
    })
  }

  //更新一筆訂單商品 patchone
  patchOneOrderProductRequest(): void {
    if (this.edit_product_form.controls['unit_price'].hasError('required') ||
      this.edit_product_form.controls['quantity'].hasError('required')) {
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.edit_product_form.controls['unit_price'].hasError('required')) {
          this.edit_product_form.controls['unit_price'].markAsDirty();
        }
        if (this.edit_product_form.controls['quantity'].hasError('required')) {
          this.edit_product_form.controls['quantity'].markAsDirty();
        }
        this.editOneOrderProduct = true;
      })
      return;
    }
    let orderProducts = [];
    const unit_price = this.edit_product_form.get(`unit_price`)?.value;
    const quantity = this.edit_product_form.get(`quantity`)?.value;
    const description = this.edit_product_form.get(`description`)?.value;
    if(this.GetOneOrderProduct.quote_price == "-"){
      this.GetOneOrderProduct.quote_price = 0
    }
    const orderProduct = {
      order_product_id: this.GetOneOrderProduct.order_product_id,
      order_id: this.o_id,
      product_id: this.GetOneOrderProduct.product_id,
      quote_price: this.GetOneOrderProduct.quote_price,
      unit_price: unit_price,
      quantity: quantity,
      description: description
    };
    orderProducts.push(orderProduct);
    this.HttpApi.patchOrderProductRequest({products: orderProducts}).subscribe(
      {
        next: Request => {
          this.editOneOrderProduct = false;
          if (Request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已儲存您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getOneOrderRequest(this.o_id)
            this.getAllOrderProductRequest()
            this.getOrderProductRequest(this.o_id)
          } else {
            Swal.fire({
              title: '失敗',
              text: "請確認資料是否正確 :(",
              icon: 'error',
              showConfirmButton: false,
              timer: 1500
            }).then(() => {
              this.editOneOrderProduct = true;
            })
          }
        },
        error: error => {
          console.log(error);
        }
      })
  }
  //一次刪除多個訂單商品
  deleteSelectOrderProduct: any[]=[]
  ErrorMessage = false;
  deleteOrderProductRequest(): void {
    if (this.deleteSelectOrderProduct.length == 0){
      this.ErrorMessage = true;
      return
    }else{
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
          const deletequoteproduct = this.deleteSelectOrderProduct.map(product => product.order_product_id);
          this.HttpApi.deleteOrderProductRequest({products: deletequoteproduct}).subscribe({
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
                this.getOneOrderRequest(this.o_id)
                this.getAllOrderProductRequest()
                this.getOrderProductRequest(this.o_id)
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
 //刪除此筆order_product
  deleteOneOrderProductRequest(order_product_id: string): void {
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
        const orderProducts: string[] = [order_product_id];
        this.HttpApi.deleteOrderProductRequest({products: orderProducts}).subscribe({
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
              this.getOneOrderRequest(this.o_id)
              this.getAllOrderProductRequest()
              this.getOrderProductRequest(this.o_id)
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
  //建立formgroup
  order_form: FormGroup;
  edit_product_form: FormGroup;
  o_id: any;

  constructor(private fb: FormBuilder, private HttpApi: HttpApiService, private route: ActivatedRoute) {
    this.order_form = this.fb.group({
      code: [''],
      account_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      status: [''],
      contract_id: ['', [Validators.required]],
      contract_code: ['', [Validators.required]],
      grand_total: [''],
      activated_by: [''],
      activated_at: [''],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    this.o_id = this.route.snapshot.paramMap.get('o_id')
    console.log("取到的o_id: " + this.o_id)
    this.getOrderProductRequest(this.o_id)
    this.getOneOrderRequest(this.o_id)
    this.getAllContractRequest()
    this.getAllOrderProductRequest()
    this.edit_product_form = this.fb.group({
      quote_product_id: [''],
      product_name: [''],
      code: [''],
      standard_price: [''],
      quote_price: [0],
      product_id: [''],
      quote_id: [''],
      sub_total: [''],
      unit_price: [0, [Validators.required]],
      quantity: ['', [Validators.required]],
      grand_total: [''],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    })
  }

  //新增產品dialog
  add: boolean = false;
  selectedProducts: any[] = []

  addProduct() {
    this.add = true;
    this.selectedProducts = [];
    this.getAllOrderProductRequest()
  }
  //控制所選訂單商品dialog
  editSelectOrderProducts: boolean = false;
  showErrorMessage = false;
  //編輯所有產品報價dialog
  editSelectedProduct() {
    if (this.selectedProducts.length !== 0) {
      this.selectedProducts.forEach((product) => {
        this.edit_product_form.addControl(`unit_price_${product.product_id}`, new FormControl(0, Validators.required));
        this.edit_product_form.addControl(`quantity_${product.product_id}`, new FormControl('', Validators.required));
        this.edit_product_form.addControl(`discount_${product.product_id}`, new FormControl(0, Validators.required));
      });
      this.editSelectOrderProducts = true;
      this.editGetAllOrderProduct = false;
      this.add = false;
      console.log(this.selectedProducts)
    }
    if (this.selectedProducts.length === 0) {
      this.editSelectOrderProducts = false;
      this.showErrorMessage = true;
      return;
    }

  }

  //編輯單一產品報價dialog
  editOneOrderProduct: boolean = false;
  GetOneOrderProduct: any;

  editOneProduct(order_product?: any) {
    this.editOneOrderProduct = true;
    this.GetOneOrderProduct = order_product
    this.GetOneOrderProduct.created_at = this.formatDate(order_product.created_at)
    this.GetOneOrderProduct.updated_at = this.formatDate(order_product.updated_at)
    this.edit_product_form.patchValue(order_product);
    console.log("order_product: " + JSON.stringify(order_product))
  }

  //控制所有訂單商品dialog
  editGetAllOrderProduct: boolean = false;
  editAllProduct() {
    this.editGetAllOrderProduct = true;
    if (this.GetOrderProduct.length !== 0) {
      this.GetOrderProduct.forEach((product) => {
        this.edit_product_form.addControl(`unit_price_${product.order_product_id}`, this.fb.control((product.unit_price), Validators.required));
        this.edit_product_form.addControl(`quantity_${product.order_product_id}`, this.fb.control((product.quantity), Validators.required));
      });
    }
  }

  // GET全部Contract
  GetAllContract: any[] = [];
  search: string = '';

  getAllContractRequest() {
    this.HttpApi.getAllContractRequest(this.search, 1).subscribe({
      next: res => {
        const contracts = res.body.contracts.filter((contract: any) => contract.status == '已簽署');
        this.GetAllContract = contracts.map((contract: any) => {
          return {
            label: contract.code,
            value: contract.contract_id,
            // account_id: contract.account_id,
            date: contract.start_date,
          };
        });
      },
      error: error => {
        console.log(error);
      }
    });
  }

  patchOrderRequest() {
    if (this.order_form.controls['contract_id'].hasError('required') ||
      this.order_form.controls['start_date'].hasError('required')) {
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.order_form.controls['contract_id'].hasError('required')) {
          this.order_form.controls['contract_id'].markAsDirty();
        }
        if (this.order_form.controls['start_date'].hasError('required')) {
          this.order_form.controls['start_date'].markAsDirty();
        }
      })
      return;
    }

    this.orderStartDate = this.order_form.controls['start_date'].value;
    if (this.orderStartDate < this.MinDate) {
      this.order_form.controls['start_date'].setErrors({'required-star': true});
      return
    } else {
      this.order_form.controls['start_date'].value;
    }
    if (this.order_form.controls['account_id'].hasError('required') || this.order_form.controls['contract_id'].hasError('dateError')
      || this.order_form.controls['start_date'].hasError('required') || this.order_form.controls['contract_id'].hasError('required')) {
      return;
    }
    let start_date = new Date(this.order_form.get('start_date')?.value);
    let body = {
      status: this.order_form.get('status')?.value.name,
      start_date: start_date.toISOString(),
      // account_id: this.selectedAccount_id, //帳戶ID
      description: this.order_form.get('description')?.value,
      contract_id: this.selectedContract_id, //契約ID
    }
    this.HttpApi.patchOrderRequest(this.o_id, body).subscribe(
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
          this.getOneOrderRequest(this.o_id)
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

  //刪除這筆訂單
  deleteOrderRequest(o_id: any): void {
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
        this.HttpApi.deleteOrderRequest(o_id).subscribe(Request => {
          console.log(Request)
          if (Request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            }).then(() => {
              window.location.href = '/main/order';
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

  //設定訂單開始天數不能開始於契約開始日期
  MinDate!: any;//契約日期
  orderStartDate: any;
  selectedContract_id: any;

  // selectedAccount_id: string = '';   //取得選擇的契約帳戶id
  validateStartDate() {
    const selectedContract = this.GetAllContract.find((contract) => contract.value === this.order_form.get('contract_id')?.value);
    const contractStartDate = selectedContract?.date.substring(0, 10);
    this.MinDate = new Date(contractStartDate);
    // this.selectedAccount_id = selectedContract?.account_id;
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

  formatDate2(dateString2: string): string {
    const date = new Date(dateString2);
    const start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, date.getHours());
    return start_date.toISOString().slice(0, 10);
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
    this.getOneOrderRequest(this.o_id)
  }
}
