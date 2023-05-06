import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {HttpApiService} from 'src/app/api/http-api.service';
import {Order} from 'src/app/shared/models/order';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-order',
  templateUrl: './view-order.component.html',
  styleUrls: ['./view-order.component.scss'],
  providers: [MessageService]
})
export class ViewOrderComponent {
order_product: any[] = [
    {
      name: "pen",
      code: "00001",
      price: 100,
      quantity: 20,
    },
    {
      name: "grava",
      code: "00002",
      price: 200,
      quantity: 5,
    }
  ]

  order_log: any[] = [
    {
      date: "2023-05-06 08:00",
      field: "啟用訂單",
      user: "林",
      old: "false",
      new: "true",
    },
    {
      date: "2023-05-07 17:00",
      field: "狀態",
      user: "林",
      old: "草稿",
      new: "啟動中",
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
  //取得當筆報價資料
  GetOneOrder: Order[] = [];
  selectedStatus!: any;
  selectedStatusName: any;
  getOneOrderRequest(o_id: any): void {
    this.HttpApi.getOneOrderRequest(o_id).subscribe(res => {
        this.GetOneOrder = res.body;
        this.editStatus();
        this.selectedStatus = this.status.find(s => s.name === res.body.status);
        this.selectedStatusName = this.selectedStatus.name
        this.order_form.patchValue({
          code: res.body.code,
          start_date: this.formatDate2(res.body.start_date),
          account_id: res.body.account_id,
          account_name: res.body.account_name,
          contract_id: res.body.contract_id,
          contract_code: res.body.contract_code,
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
      (error) => {
        console.log(error);
      }
    );
  }
  //GET全部product
  GetAllProduct: any[] = [];
  first = 0;
  getAllProductRequest(limit?: number, page?: number){
    if (!page) {
      this.first = 0;
    }
    this.HttpApi.getAllProductRequest(limit, ).subscribe(res => {
        this.GetAllProduct = res.body.products
        this.GetAllProduct = res.body.products.map((product: any) => {
          const created_at = this.formatDate(product.created_at);
          const updated_at = this.formatDate(product.updated_at);
          return {...product, created_at, updated_at};
        });
        console.log(this.GetAllProduct)
      },
      error => {
        console.log(error);
      });
  }

  //建立formgroup
  order_form: FormGroup;
  edit_product_form: FormGroup;
  o_id: any;
  constructor(private fb: FormBuilder, private HttpApi: HttpApiService, private route: ActivatedRoute
  ,private messageService: MessageService) {
    this.order_form = this.fb.group({
      code: [''],
      account_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      status: [''],
      contract_id: ['', [Validators.required]],
      contract_code: ['', [Validators.required]],
      amount: [''],
      description: [''],
      activated_by: [''],
      activated_at: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    this.o_id = this.route.snapshot.paramMap.get('o_id')
    console.log("取到的o_id: " + this.o_id)
    this.getOneOrderRequest(this.o_id)
    this.getAllContractRequest()
    this.getAllProductRequest()
    this.edit_product_form = this.fb.group({
      name: ['', [Validators.required]],
      quantity: ['', [Validators.required]],
      unit_price: ['', [Validators.required]],
      price: [''],
      description: [''],
    })
  }

  //新增產品dialog
  add: boolean = false;
  addProduct(){
    this.add = true;
  }

  //編輯所有產品報價dialog
  edit: boolean = false;
  editProduct(){
    this.edit = true;
  }

  // GET全部Contract
  GetAllContract: any[] = [];
  selectedContract_id: any;

  getAllContractRequest(limit?: number, page?: number) {
    this.HttpApi.getAllContractRequest(limit, page).subscribe(
      (res) => {
        const contracts = res.body.contracts.filter((contract: any) => contract.status == '已簽署');
        this.GetAllContract = contracts.map((contract: any) => {
          return {
            label: contract.code,
            value: contract.contract_id,
            account_id: contract.account_id,
            date: contract.start_date,
          };
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  patchOrderRequest(o_id: any): void {
    this.orderStartDate = this.order_form.controls['start_date'].value;
    if (this.orderStartDate < this.MinDate) {
      this.order_form.controls['start_date'].setErrors({'required-star': true});
      return
    } else {
      this.order_form.controls['start_date'].value;
    }
    this.editStatus()//處理status的值，抓取name
    if (this.order_form.controls['account_id'].hasError('required') || this.order_form.controls['contract_id'].hasError('dateError')
      || this.order_form.controls['start_date'].hasError('required') || this.order_form.controls['contract_id'].hasError('required')) {
      return;
    }
    let start_date = new Date(this.order_form.get('start_date')?.value);
    let body = {
      status: this.order_form.get('status')?.value,
      start_date: start_date.toISOString(),
      account_id: this.selectedAccount_id, //帳戶ID
      description: this.order_form.get('description')?.value,
      contract_id: this.selectedContract_id, //契約ID
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45", //修改者ID(必填)
    }
    this.HttpApi.patchOrderRequest(o_id, body).subscribe(
      Request => {
        console.log(Request)
        this.getOneOrderRequest(o_id)
      })
  }

  //設定訂單開始天數不能開始於契約開始日期
  selectedAccount_id: string = '';   //取得選擇的契約帳戶id
  MinDate!: any;//契約日期
  orderStartDate: any;
  validateStartDate() {
    const selectedContract = this.GetAllContract.find((contract) => contract.value === this.selectedContract_id);
    const contractStartDate = selectedContract?.date.substring(0, 10);
    this.MinDate = new Date(contractStartDate);
    this.selectedAccount_id = selectedContract?.account_id;
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }

  //處理status的值
  statusName!: string;
  editStatus(): void {
    //判斷selectedStatus是否有值，若有值則取出name屬性
    this.statusName = this.selectedStatus ? this.selectedStatus.name : "";
    //將statusName更新到表單中
    this.order_form.patchValue({status: this.statusName});
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
    const start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
    return start_date.toISOString().slice(0, 10);
  }

  showAlert() {
    Swal.fire({
      title: '確認更改？',
      icon: 'warning',
      confirmButtonColor: '#00D963', // 设置为绿色
      cancelButtonColor: '#FF003A',
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '成功',
          text: "已儲存您的變更 :)",
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        this.patchOrderRequest(this.o_id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: '取消',
          text: "已取消您的變更！",
          icon: 'error',
          showConfirmButton: false,
          timer: 700
        });
      }
    });
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: '即將重新導向至訂單頁面' });
    setTimeout(() => {
      window.location.assign('/main/order');
    }, 1500); // 延遲3秒後跳轉頁面
  }
}
