import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpApiService} from "../../../../api/http-api.service";
import {ActivatedRoute} from "@angular/router";
import {LazyLoadEvent, MessageService} from "primeng/api";
import Swal from 'sweetalert2';
import {Table} from "primeng/table";

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.scss'],
  providers: [MessageService]
})
export class ViewContractComponent {
  @ViewChild('dt1') dt1!: Table;
//p-dropdown status的下拉值
  status: any[] = [
    {
      name: "草稿",
      code: "draft",
    },
    {
      name: "審批中",
      code: "in_approval",
    },
    {
      name: "拒絕",
      code: "rejected",
    },
    {
      name: "等待簽名",
      code: "awaiting_signature",
    },
    {
      name: "已簽署",
      code: "signed",
    },
    {
      name: "已取消",
      code: "canceled",
    },
    {
      name: "已過期",
      code: "expired",
    },
  ];

  //p-dropdown status的下拉值
  order_status: any[] = [
    {
      name: "草稿",
      code: "draft",
    },
    {
      name: "啟動中",
      code: "activated",
    }
  ];
  //取得當筆契約歷史紀錄
  GetContractHistoricalRecords: any[] = [];
  totalHistorical: any;
  getAllContractHistoricalRecordsRequest(c_id: any){
    this.HttpApi.getAllContractHistoricalRecordsRequest(20,1,c_id).subscribe(res => {
      this.GetContractHistoricalRecords= res.body.historical_records.map((contract: any) => {
        const modified_at = this.formatDate(contract.modified_at)
        return {...contract, modified_at};
      });
      this.totalHistorical = res.body.total
      }
    )
  }
  loadTable(e: any) {
    let page = e.first / e.rows + 1;
    let limit = e.rows;
    this.loading = true;
    this.HttpApi.getAllContractHistoricalRecordsRequest(limit, page, e).subscribe(
      request => {
        this.GetContractHistoricalRecords= request.body.historical_records.map((contract: any) => {
          const modified_at = this.formatDate(contract.modified_at)
          return {...contract, modified_at};
        });
        this.totalHistorical = request.body.total
        console.log(this.GetContractHistoricalRecords)
      });
  }
  //取得當筆契約資料
  GetOneContract!: any;
  stage: any;
  getOneContractRequest(c_id: any) {
    this.HttpApi.getOneContractRequest(c_id).subscribe(res => {
        this.GetOneContract = res.body;
        this.stage = res.body.status;
        this.contract_form.patchValue({
          code: res.body.code,
          status: this.status.find((s: { name: any; }) => s.name === this.GetOneContract.status),
          salesperson_name: res.body.salesperson_name,
          start_date: this.formatDate2(res.body.start_date),
          term: res.body.term,
          end_date: this.formatDate2(res.body.end_date),
          account_id: res.body.account_id,
          account_name: res.body.account_name,
          description: res.body.description,
          updated_by: res.body.updated_by,
          updated_at: this.formatDate(res.body.updated_at),
          created_at: this.formatDate(res.body.created_at),
          created_by: res.body.created_by,
        });
        if (this.GetOneContract.status === '已取消' || this.GetOneContract.status === '已過期') {
          this.contract_form.controls['status'].disable();
        }
        console.log(this.GetOneContract)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  patchContractRequest() {
    if (this.contract_form.controls['start_date'].hasError('required') ||
      this.contract_form.controls['account_id'].hasError('required') ||
      this.contract_form.controls['term'].hasError('required') ||
      this.contract_form.controls['status'].hasError('required')) {
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.contract_form.controls['start_date'].hasError('required')) {
          this.contract_form.controls['start_date'].markAsDirty();
        }
        if (this.contract_form.controls['account_id'].hasError('required')) {
          this.contract_form.controls['account_id'].markAsDirty();
        }
        if (this.contract_form.controls['term'].hasError('required')) {
          this.contract_form.controls['term'].markAsDirty();
        }
        if (this.contract_form.controls['status'].hasError('required')) {
          this.contract_form.controls['status'].markAsDirty();
        }
      })
      return;
    }
    let start_date = new Date(this.contract_form.get('start_date')?.value);
    let body = {
      status: this.contract_form.get('status')?.value.name,
      start_date: start_date.toISOString(),
      account_id: this.contract_form.get('account_id')?.value,
      term: this.contract_form.get('term')?.value,
      description: this.contract_form.get('description')?.value,
    }
    this.HttpApi.patchContractRequest(this.c_id, body).subscribe(
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
          this.getOneContractRequest(this.c_id)
        } else {
          Swal.fire({
            title: '失敗',
            text: "請確認資料是否正確 :(",
            icon: 'error',
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    )
  }

//編輯&新增dialog
  edit: boolean = false;
  dialogHeader!: string;
  showedit = true;//判斷是否dialog為新增與編輯
  o_id: any;
  //設定訂單開始天數不能開始於契約開始日期
  MinDate!: any;//契約日期
  showDialog(type: string, order?: any): void {
    this.MinDate = new Date(this.contract_form.controls['start_date'].value);
    if (type === 'add') {
      this.dialogHeader = '新增訂單';
      this.order_form.reset();
      this.showedit = false; // 不顯示 activated_by 控件
      this.order_form.patchValue({status: this.order_status[0].name});
    } else if (type === 'edit') {
      console.log("order: " + JSON.stringify(order))
      this.dialogHeader = '編輯訂單';
      this.order_form.patchValue(order);
      this.order_form.patchValue({
        start_date: new Date(order.start_date),
        status: this.order_status.find((s: { name: any; }) => s.name === order.status),
      });
      this.showedit = true; // 不顯示 activated_by 控件
      this.o_id = order.order_id
    }
    this.edit = true;
  }

  // GET全部Account
  GetAllAccount: any[] = [];
  accountSearch!: string;
  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(this.accountSearch, 1).subscribe(
      (res) => {
        this.GetAllAccount = res.body.accounts.map((account: any) => {
          return {
            label: account.name,
            value: account.account_id
          };
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //建立formgroup
  contract_form: FormGroup;
  c_id: any;
  order_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.contract_form = this.fb.group({
      contract_id: [''],
      salesperson_name: [''],
      code: [''],
      account_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      start_date: [[Validators.required]],
      term: ['', [Validators.required]],
      end_date: [''],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    this.order_form = this.fb.group({
      code: [''],
      start_date: ['', [Validators.required]],
      status: [''],
      contract_id: ['', [Validators.required]],
      contract_code: ['', [Validators.required]],
      amount: [''],
      activated_by: [''],
      activated_at: [''],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    this.c_id = this.route.snapshot.paramMap.get('c_id')
    console.log("取到的o_id: " + this.c_id)
    this.getOneContractRequest(this.c_id)
    this.getAllAccountRequest()
    this.getAllOrderRequest()
    this.getAllContractHistoricalRecordsRequest(this.c_id)
  }

  // table lazyload
  totalRecords = 0;
  //取得所有訂單資料
  GetAllOrder: HttpApiService[] = [];
  search: string = '';  // 搜尋關鍵字
  loading: boolean = false;
  getAllOrderRequest() {
    this.loading = true
    this.HttpApi.getAllOrderRequest(this.search,1).subscribe(
      (res) => {
        this.loading = false;
        const contracts = res.body.orders.filter((order: any) => order.contract_id == this.c_id);
        this.GetAllOrder = contracts.map((order: any) => {
          const start_date = this.formatDate2(order.start_date)
          const activated_at = this.formatDate(order.activated_at)
          const created_at = this.formatDate(order.created_at);
          const updated_at = this.formatDate(order.updated_at);
          return {...order, start_date, activated_at, created_at, updated_at};
        });
        this.totalRecords = res.body.total;
        console.log(this.GetAllOrder)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  postOrderRequest(): void {
    if (this.order_form.controls['start_date'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.order_form.controls['start_date'].hasError('required')) {
          this.order_form.controls['start_date'].markAsDirty();
        }
        this.edit = true;
      })
      return;
    }
    if (this.order_form.controls['start_date'].value < this.contract_form.controls['start_date'].value) {
      this.order_form.controls['start_date'].setErrors({'required-star': true});
      return
    } else {
      this.order_form.controls['start_date'].value;
    }
    if (this.order_form.controls['start_date'].hasError('required')) {
      return;
    }
    let body = {
      status: this.order_form.value.status,
      description: this.order_form.value.description,
      start_date: this.order_form.value.start_date,
      contract_id: this.c_id, //契約ID
    }
    this.HttpApi.postOrderRequest(body).subscribe(Request => {
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
      error => {
        console.log(error);
      })
  }
  patchOrderRequest() {
    if (this.order_form.controls['start_date'].hasError('required')) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.order_form.controls['start_date'].hasError('required')) {
          this.order_form.controls['start_date'].markAsDirty();
        }
      })
      return;
    }
    if (this.order_form.controls['start_date'].value < this.contract_form.controls['start_date'].value) {
      this.order_form.controls['start_date'].setErrors({'required-star': true});
      return
    }
    if (this.order_form.controls['contract_id'].hasError('dateError')
      || this.order_form.controls['start_date'].hasError('required') || this.order_form.controls['contract_id'].hasError('required')) {
      return;
    }
    let start_date = new Date(this.order_form.get('start_date')?.value);
    let body = {
      status: this.order_form.get('status')?.value.name,
      start_date: start_date.toISOString(),
      description: this.order_form.get('description')?.value,
      contract_id: this.c_id, //契約ID
    }
    this.HttpApi.patchOrderRequest(this.o_id, body).subscribe(
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
            this.edit = false;
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
    const start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate()+1, date.getHours());
    return start_date.toISOString().slice(0, 10);
  }

  showAlertCancel() {
    this.edit = false;
    Swal.fire({
      title: '取消',
      text: "已取消您的變更！",
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: false,
      reverseButtons: false,
      timer: 1000
    })
    this.getOneContractRequest(this.c_id)
  }
}
