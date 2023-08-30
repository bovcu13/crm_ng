import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import Swal from "sweetalert2";
import {Table} from "primeng/table";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  @ViewChild('dt1') dt1!: Table;
  //table的死值
  order: any[] = [
    {
      number: "00001",
      account_name: "NKUST",
      order_amount: 150000,
      start_date: "2023-04-16",
      status: "草稿",
      contract_number: "00001",
      activated_by: "林",
      activated_date: "2023-04-17 15:00",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    },
    {
      number: "00002",
      account_name: "sam",
      order_amount: 120000,
      start_date: "2023-03-15",
      status: "啟動中",
      contract_number: "00002",
      activated_by: "林",
      activated_date: "2023-04-17 15:00",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    }
  ];

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

  ngOnInit() {
    this.getAllContractSelection()
  }

  getAllOrderRequest() {
    this.HttpApi.getAllOrderRequest(this.search, 1).subscribe({
      next: res => {
        this.GetAllOrder = res.body.orders
        this.totalRecords = res.body.total;
        console.log(this.GetAllOrder)
      },
      error: error => {
        console.log(error);
      }
    });
  }

  // table lazyload
  totalRecords = 0;
  //取得所有訂單資料
  GetAllOrder: HttpApiService[] = [];
  first = 0;
  search: string = '';  // 搜尋關鍵字
  loading: boolean = false;

  loadPostsLazy(e: any) {
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.loading = true;
    this.HttpApi.getAllOrderRequest(this.search, 1, limit, page, e).subscribe(
      request => {
        this.GetAllOrder = request.body.orders;
        this.totalRecords = request.body.total;
        this.loading = false;
        console.log(this.GetAllOrder)
      });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  postOrderRequest(): void {
    if (this.order_form.controls['contract_code'].hasError('required') ||
      this.order_form.controls['start_date'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.order_form.controls['contract_code'].hasError('required')) {
          this.order_form.controls['contract_code'].markAsDirty();
        }
        if (this.order_form.controls['start_date'].hasError('required')) {
          this.order_form.controls['start_date'].markAsDirty();
        }
        this.edit = true;
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
    if (this.order_form.controls['start_date'].hasError('required') || this.order_form.controls['contract_code'].hasError('required')) {
      return;
    }
    let body = {
      status: this.order_form.get('status')?.value.name,
      description: this.order_form.value.description,
      start_date: this.order_form.value.start_date,
      contract_id: this.order_form.value.contract_code.contract_id, //契約ID
    }
    this.HttpApi.postOrderRequest(body).subscribe({
      next: Request => {
        console.log(Request)
        if (Request.code === 200) {
          this.edit = false;
          Swal.fire({
            title: '成功',
            text: "已儲存您的資料 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllOrderRequest()
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


  //建立formgroup
  order_form: FormGroup;
  constructor(private fb: FormBuilder, private HttpApi: HttpApiService) {
    this.order_form = this.fb.group({
      code: [''],
      account_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      status: [''],
      contract_id: [''],
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
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }

  // 點擊表頭狀態列執行搜尋
  toggleStatusFilter(index: number) {
    // 若已被點擊過則取消 filter
    if (this.status[index].boolean) {
      this.getAllOrderRequest();
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
    // console.log(this.status)
  }

  //編輯&新增dialog
  edit: boolean = false;
  dialogHeader!: string;
  showedit = true;//判斷是否dialog為新增與編輯
  o_id: any;
  showDialog(type: string, order?: any): void {
    if (type === 'add') {
      this.dialogHeader = '新增訂單';
      this.order_form.reset();
      this.showedit = false; // 不顯示 activated_by 控件
      this.order_form.patchValue({status: this.status.find(s => s.name === this.status[0].name),});
      this.order_form.controls['status'].disable();
    } else if (type === 'edit') {
      console.log("order: " + JSON.stringify(order))
      this.dialogHeader = '編輯訂單';
      if (order.status === "啟動中") {
        this.order_form.controls['status'].disable();
      }else{
        this.order_form.controls['status'].enable();
      }
      this.order_form.patchValue(order);
      this.order_form.patchValue({
        contract_code: this.GetAllContract.find((s: { contract_id: any; }) => s.contract_id === order.contract_id),
        status: this.status.find((s: { name: any; }) => s.name === order.status),
        start_date: new Date(order.start_date),
      });
      this.showedit = true; // 顯示 activated_by 控件
      this.o_id = order.order_id
    }
    this.edit = true;
  }

  patchOrderRequest(o_id: any): void {
    if (this.order_form.controls['contract_code'].hasError('required') ||
      this.order_form.controls['start_date'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.order_form.controls['contract_code'].hasError('required')) {
          this.order_form.controls['contract_code'].markAsDirty();
        }
        if (this.order_form.controls['start_date'].hasError('required')) {
          this.order_form.controls['start_date'].markAsDirty();
        }
        this.edit = true;
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
    if (this.order_form.controls['contract_code'].hasError('required') || this.order_form.controls['contract_code'].hasError('dateError')
      || this.order_form.controls['start_date'].hasError('required') || this.order_form.controls['contract_id'].hasError('required')) {
      return;
    }
    let body = {
      status: this.order_form.get('status')?.value.name,
      start_date: this.order_form.get('start_date')?.value,
      description: this.order_form.get('description')?.value,
      contract_id: this.order_form.get('contract_code')?.value.contract_id, //契約ID
    }
    this.HttpApi.patchOrderRequest(o_id, body).subscribe(
      Request => {
        console.log(Request)
        if (Request.code === 200) {
          this.edit = false;
          Swal.fire({
            title: '成功',
            text: "已儲存您的變更 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllOrderRequest()
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
      })
  }

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
            })
            this.getAllOrderRequest()
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

  // GET全部Contract
  GetAllContract: any[] = [];
  //取得契約階段如果不到已簽署就無法選擇
  getAllContractSelection() {
    this.HttpApi.getAllContractSelection("已簽署").subscribe( {
      next: (res) => {
        this.GetAllContract = res.body.contracts
        console.log(this.GetAllContract)
      },
      error: (error) => {
        console.log(error);
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

  //設定訂單開始天數不能開始於契約開始日期
  MinDate!: any;//契約日期
  orderStartDate: any;
  validateStartDate() {
    const selectedContract = this.GetAllContract.find((contract) => contract.contract_id === this.order_form.get('contract_code')?.value.contract_id);
    this.MinDate = new Date(selectedContract.start_date);
  }
}
