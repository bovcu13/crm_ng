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
    this.getAllContractRequest()
  }

  getAllOrderRequest() {
    this.HttpApi.getAllOrderRequest(this.search, 1).subscribe({
      next: res => {
        this.GetAllOrder = res.body.orders
        this.GetAllOrder = res.body.orders.map((order: any) => {
          const start_date = this.formatDate2(order.start_date)
          const activated_at = this.formatDate(order.activated_at)
          const created_at = this.formatDate(order.created_at);
          const updated_at = this.formatDate(order.updated_at);
          return {...order, start_date, activated_at, created_at, updated_at};
        });
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
        this.GetAllOrder = request.body.orders.map((order: any) => {
          const start_date = this.formatDate2(order.start_date)
          const activated_at = this.formatDate(order.activated_at)
          const created_at = this.formatDate(order.created_at);
          const updated_at = this.formatDate(order.updated_at);
          return {...order, start_date, activated_at, created_at, updated_at};
        });
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
    if (this.order_form.controls['contract_id'].hasError('required') ||
      this.order_form.controls['start_date'].hasError('required')) {
      this.edit = false;
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
    if (this.order_form.controls['start_date'].hasError('required') || this.order_form.controls['contract_id'].hasError('required')) {
      return;
    }
    let body = {
      status: this.order_form.value.status,
      description: this.order_form.value.description,
      start_date: this.order_form.value.start_date,
      contract_id: this.selectedContract_id, //契約ID
      //account_id: this.selectedAccount_id //帳戶ID
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
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }

  //編輯&新增dialog
  edit: boolean = false;
  dialogHeader!: string;
  selectedStatus!: any;
  showedit = true;//判斷是否dialog為新增與編輯
  o_id: any;
  selectedStatusName: any;

  showDialog(type: string, order?: any): void {
    if (type === 'add') {
      this.dialogHeader = '新增訂單';
      this.order_form.reset();
      this.showedit = false; // 不顯示 activated_by 控件
      this.order_form.patchValue({status: this.status[0].name});
    } else if (type === 'edit') {
      console.log("order: " + JSON.stringify(order))
      this.dialogHeader = '編輯訂單';
      this.order_form.patchValue(order);
      this.order_form.patchValue({
        start_date: new Date(order.start_date),
      });
      this.showedit = true; // 不顯示 activated_by 控件
      // 綁定已經選擇的狀態
      this.selectedStatus = this.status.find(s => s.name === order.status);
      this.selectedStatusName = this.selectedStatus.name
      this.o_id = order.order_id
    }
    this.edit = true;
  }


  patchOrderRequest(o_id: any): void {
    if (this.order_form.controls['contract_id'].hasError('required') ||
      this.order_form.controls['start_date'].hasError('required')) {
      this.edit = false;
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
    this.editStatus()//處理status的值，抓取name
    if (this.order_form.controls['account_id'].hasError('required') || this.order_form.controls['contract_id'].hasError('dateError')
      || this.order_form.controls['start_date'].hasError('required') || this.order_form.controls['contract_id'].hasError('required')) {
      return;
    }
    let body = {
      status: this.order_form.get('status')?.value,
      start_date: this.order_form.get('start_date')?.value,
      //account_id: this.selectedAccount_id, //帳戶ID
      description: this.order_form.get('description')?.value,
      contract_id: this.selectedContract_id, //契約ID
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
  selectedContract_id: any;
  contractsearch: any;

  getAllContractRequest() {
    this.HttpApi.getAllContractRequest(this.contractsearch, 1).subscribe({
      next: res => {
        const contracts = res.body.contracts.filter((contract: any) => contract.status == '已簽署');
        this.GetAllContract = contracts.map((contract: any) => {
          return {
            label: contract.code,
            value: contract.contract_id,
            date: contract.start_date,
            account_id: contract.account_id,
          };
        });
      },
      error: error => {
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

//處理status的值
  editStatus(): void {
    //判斷selectedStatus是否有值，若有值則取出name屬性
    let statusName = this.selectedStatus ? this.selectedStatus.name : "";
    //將statusName更新到表單中
    this.order_form.patchValue({status: statusName});
  }


  //設定訂單開始天數不能開始於契約開始日期
  MinDate!: any;//契約日期
  orderStartDate: any;
  validateStartDate() {
    const selectedContract = this.GetAllContract.find((contract) => contract.value === this.selectedContract_id);
    const contractStartDate = selectedContract?.date.substring(0, 10);
    this.MinDate = new Date(contractStartDate);
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

}
