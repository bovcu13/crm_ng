import {Component} from '@angular/core';
import {HttpApiService} from "../../../api/http-api.service";
import {Product} from "../../../shared/models/product";
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LazyLoadEvent} from 'primeng/api';

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
  ngOnInit() {
    this.getAllProductRequest()
  }

//GET全部product
  GetAllProduct!: HttpApiService[];
  getAllProductRequest(): void {
    this.HttpApi.getAllProductRequest(1).subscribe(res => {
        this.GetAllProduct = res.body.products;
        this.GetAllProduct = res.body.products.map((product: any) => {
          const created_by = this.getUserNameById(product.created_by);
          const updated_by = this.getUserNameById(product.updated_by);
          const created_at = this.formatDate(product.created_at);
          const updated_at = this.formatDate(product.updated_at);
          return {...product, created_by, updated_by, created_at, updated_at};
        });
      },
      error => {
        console.log(error);
      });
  }

//POST 一筆product
  PostOneProduct!: HttpApiService[];
  BadRequest: any
  postProductRequest(): void {
    let body = {
      name: this.product_form.value.name,
      code: this.product_form.value.code,
      is_enable: this.product_form.value.is_enable,
      description: this.product_form.value.description,
      price: this.product_form.value.price,
      created_by: "eb6751fe-ba8d-44f6-a92f-e2efea61793a",
    }
    this.HttpApi.postProductRequest(body).subscribe(Request => {
      this.PostOneProduct = Request
      this.getAllProductRequest()
        if (Request.code === 400){
          this.BadRequest = "識別碼不可重複!!!";
          this.edit = true;
        } else if (Request.code === 200) {
          this.edit = false;
        }
    },
      error => {
        console.log(error);
      })
  }

  //取得使用者
  getUserNameById(id: string): string {
    // 取得使用者名稱的邏輯，例如從 API 取得該使用者名稱
    return "林";
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
        (product.enable ? 'true' : 'false').toLowerCase().includes(this.filterText.toLowerCase())
      );
    });
    console.log(this.GetAllProduct)
  }

  //懶加載
  totalRecords: any;
  first: any;
  last: any;
  loadPostsLazy(event: LazyLoadEvent) {
    const params = {
      pageSize: event.rows,
      sortField: event.sortField,
      sortOrder: event.sortOrder
    };
    this.HttpApi.getAllProductRequest(1).subscribe(
      res => {
        this.GetAllProduct = res.body.products;
        this.totalRecords = res.body.total;
        const page = res.body.page;
        const limit = res.body.limit;
        const total = res.body.total;
        const first = (page - 1) * limit + 1;
        const last = Math.min(page * limit, total);
        this.totalRecords = total;
        this.first = first;
        this.last = last;
        this.getAllProductRequest()
        console.log(this.GetAllProduct)
      },
      error => {
        console.log(error);
      }
    );
  }

//建立formgroup
  product_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.product_form = this.fb.group({
      product_id: [''],
      name: ['', [Validators.required]],
      series: [''],
      code: [''],
      enable: [false],
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

  PatchProduct!: Product;
  originalProduct: Product | null = null;// 宣告一個原始的 Product 物件，並將其初始化為 null
  showedit = true;//判斷是否dialog為新增與編輯
  showDialog(type: string, product ?: any): void {
    this.edit = true;
    this.BadRequest = null
    this.product_form.controls['created_by'].disable();
    this.product_form.controls['updated_by'].disable();
    this.product_form.controls['created_at'].disable();
    this.product_form.controls['updated_at'].disable();
    if (type === 'add') {
      this.dialogHeader = '新增商品/服務';
      this.product_form.reset();
      this.showedit = false;
    } else if (type === 'edit') {
      this.dialogHeader = '編輯商品/服務';
      this.product_form.patchValue(product);//讓編輯按鈕按下時有個別的資料出現
      this.PatchProduct = product
      this.originalProduct = product;// 當編輯對話框開啟時，設定原始的 Product 物件
      this.showedit = true;
      this.p_id = this.PatchProduct.product_id;
    }
  }
  Repeated: any;//判斷是否重複
  patchProductRequest(p_id: any): void{
      let body = {
        name: this.product_form.get('name')?.value,
        is_enable: this.product_form.get('is_enable')?.value,
        description: this.product_form.get('description')?.value,
        price: this.product_form.get('price')?.value,
        code: this.product_form.get('code')?.value,
        updated_by: "eb6751fe-ba8d-44f6-a92f-e2efea61793a",
    }
    this.HttpApi.patchProductRequest(p_id, body).subscribe(
      Request => {
        this.Repeated = Request
        console.log(Request)
        if (this.Repeated.code === 400){
          this.BadRequest = "識別碼不可重複!!!";
          this.edit = true;
        }else if (this.Repeated.code === 200){
          this.edit = false
          this.getAllProductRequest()
        }
      })
  }
  deleteProductRequest(p_id: any): void {
    this.HttpApi.deleteProductRequest(p_id).subscribe(Request => {
      console.log(Request)
      this.getAllProductRequest()
    })
  }
}

