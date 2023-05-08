import {Component} from '@angular/core';
import {HttpApiService} from "../../../api/http-api.service";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LazyLoadEvent} from 'primeng/api';
import Swal from "sweetalert2";

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {

  // product: any[] = [
  //   {
  //     name: "pen",
  //     enable: true,
  //     code: "00001",
  //     price: 100,
  //     description: "這是筆",
  //     series: "none",
  //     created_at: "2023-04-15",
  //     created_by: "林",
  //     updated_by: "林",
  //   },
  //   {
  //     name: "grava",
  //     enable: false,
  //     code: "00002",
  //     price: 200,
  //     description: "這是芭樂",
  //     series: "none",
  //     created_at: "2023-04-15",
  //     created_by: "林",
  //     updated_by: "林",
  //   }
  // ]
  //搜尋功能
  filterText: any;

  filterProducts(): void {
    if (!this.filterText) {
      this.getAllProductRequest();
      return;
    }
    // 使用 Array 的 filter() 方法對 GetAllProduct 進行過濾
    this.GetAllProduct = this.GetAllProduct.filter((product) => {
      // 將所有要比對的欄位轉成小寫字母
      const name = product.name?.toLowerCase() || '';
      const code = product.code?.toLowerCase() || '';
      const description = product.description?.toLowerCase() || '';
      const price = product.price?.toString().toLowerCase() || '';
      // 比對是否有任何一個欄位包含搜尋文字
      return (
        name.includes(this.filterText.toLowerCase()) ||
        code.includes(this.filterText.toLowerCase()) ||
        description.includes(this.filterText.toLowerCase()) ||
        price.includes(this.filterText.toLowerCase()) ||
        (product.is_enable ? 'true' : 'false').toLowerCase().includes(this.filterText.toLowerCase())
      );
    });
    console.log(this.GetAllProduct)
  }

//GET全部product
  GetAllProduct!: HttpApiService[];

  getAllProductRequest(limit?: number, page?: number) {
    if (!page) {
      this.first = 0;
    }
    this.HttpApi.getAllProductRequest(limit, page).subscribe(res => {
        this.GetAllProduct = res.body.products;
        this.GetAllProduct = res.body.products.map((product: any) => {
          const created_at = this.formatDate(product.created_at);
          const updated_at = this.formatDate(product.updated_at);
          return {...product, created_at, updated_at};
        });
        this.totalRecords = res.body.total;
        this.loading = false;
        console.log(this.GetAllProduct)
      },
      error => {
        console.log(error);
      });
  }

//POST 一筆product
  BadRequest: any

  postProductRequest(): void {
    if (this.product_form.controls['name'].hasError('required') ||
      this.product_form.controls['price'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.product_form.controls['name'].hasError('required')) {
          this.product_form.controls['name'].markAsDirty();
        }
        if (this.product_form.controls['price'].hasError('required')) {
          this.product_form.controls['price'].markAsDirty();
        }
        this.edit = true;
      })
      return;
    }

    let body = {
      name: this.product_form.value.name,
      code: this.product_form.value.code,
      is_enable: this.product_form.value.is_enable,
      description: this.product_form.value.description,
      price: this.product_form.value.price,
      created_by: "7f5443f8-e607-4793-8370-560b8b688a61",
    }
    this.edit = false
    Swal.fire({
      title: '確認新增？',
      icon: 'warning',
      confirmButtonColor: '#6EBE71',
      showCancelButton: false,
      confirmButtonText: '確認',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.postProductRequest(body).subscribe(Request => {
            this.Repeated = Request
            console.log(Request)
            if (this.Repeated.code === 400) {
              this.BadRequest = "識別碼不可重複!!!";
              this.edit = true;
            } else if (this.Repeated.code === 200) {
              Swal.fire({
                title: '成功',
                text: "已儲存您的資料 :)",
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              })
              this.getAllProductRequest()
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
    });
  }

//建立formgroup
  product_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.product_form = this.fb.group({
      product_id: [''],
      name: ['', [Validators.required]],
      series: [''],
      code: [''],
      is_enable: [false],
      price: ['', [Validators.required]],
      description: [''],
      created_at: [''],
      created_by: [''],
      updated_at: [''],
      updated_by: [''],
    });
  }

//編輯&新增dialog
  edit: boolean = false;
  dialogHeader!: string;
  p_id: any;

  showedit = true;//判斷是否dialog為新增與編輯
  showDialog(type: string, product ?: any): void {
    this.edit = true;
    this.BadRequest = null
    if (type === 'add') {
      this.dialogHeader = '新增商品/服務';
      this.product_form.reset();
      this.showedit = false;
    } else if (type === 'edit') {
      this.dialogHeader = '編輯商品/服務';
      this.product_form.patchValue(product);//讓編輯按鈕按下時有個別的資料出現
      this.showedit = true;
      this.p_id = product.product_id;
    }
  }

  Repeated: any;//判斷是否重複
  patchProductRequest(p_id: any): void {
    if (this.product_form.controls['name'].hasError('required') ||
      this.product_form.controls['price'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.product_form.controls['name'].hasError('required')) {
          this.product_form.controls['name'].markAsDirty();
        }
        if (this.product_form.controls['price'].hasError('required')) {
          this.product_form.controls['price'].markAsDirty();
        }
        this.edit = true;
      })
      return;
    }

    let body = {
      name: this.product_form.get('name')?.value,
      is_enable: this.product_form.get('is_enable')?.value,
      description: this.product_form.get('description')?.value,
      price: this.product_form.get('price')?.value,
      code: this.product_form.get('code')?.value,
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45",
    }
    this.edit = false
    Swal.fire({
      title: '確認更改？',
      icon: 'warning',
      confirmButtonColor: '#6EBE71',
      showCancelButton: false,
      confirmButtonText: '確認',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.patchProductRequest(p_id, body).subscribe(
          Request => {
            this.Repeated = Request
            console.log(Request)
            if (this.Repeated.code === 400) {
              this.BadRequest = "識別碼不可重複!!!";
              this.edit = true;
            } else if (this.Repeated.code === 200) {
              Swal.fire({
                title: '成功',
                text: "已儲存您的變更 :)",
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              })
              this.getAllProductRequest()
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
          }
        )
      }
    });
  }

  deleteProductRequest(p_id: any): void {
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
        this.HttpApi.deleteProductRequest(p_id).subscribe(Request => {
          console.log(Request)
          if (Request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getAllProductRequest()
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
    });
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

  //懶加載
  totalRecords = 0;
  first = 0;
  loading: boolean = true;

  loadPostsLazy(e: any) {
    this.loading = true;
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.getAllProductRequest(limit, page);
  }

  //日期轉換
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hour}:${minute}`;
  }
}

