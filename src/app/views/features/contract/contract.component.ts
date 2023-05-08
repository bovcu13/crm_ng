import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import {LazyLoadEvent} from 'primeng/api';
import Swal from "sweetalert2";

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent {
  // contract: any[] = [
  //   {
  //     "owner": "林",
  //     "number": "00001",
  //     "account_name": "milk",
  //     "status": "草稿",
  //     "start_date": "2023-04-09",
  //     "term": 1,
  //     "created_at": "2023-03-15",
  //     "created_by": "林",
  //     "updated_by": "林",
  //   },
  //   {
  //     "owner": "林",
  //     "number": "00002",
  //     "account_name": "nkust",
  //     "status": "審批中",
  //     "start_date": "2023-02-15",
  //     "term": 7,
  //     "created_at": "2023-02-05",
  //     "created_by": "林",
  //     "updated_by": "林",
  //   }
  // ];
  //搜尋功能

  filterText!: string;  // 定義一個 filterText 變數來儲存搜尋文字
// 定義一個方法來過濾資料
  filterContracts(): void {
    // 如果沒有輸入搜尋文字，就直接返回原始資料
    if (!this.filterText) {
      this.getAllContractRequest();
      return;
    }
    // 使用 Array 的 filter() 方法對 GetAllContract 進行過濾
    this.GetAllContract = this.GetAllContract.filter((contract) => {
      // 將所有要比對的欄位轉成小寫字母
      const code = contract.code.toString().toLowerCase() || '';
      const description = contract.description.toLowerCase() || '';
      const status = contract.status.toLowerCase() || '';
      const start_date = contract.start_date.toLowerCase() || '';
      const term = contract.term.toString().toLowerCase() || '';

      // 比對是否有任何一個欄位包含搜尋文字
      return (
        code.includes(this.filterText.toString().toLowerCase()) ||
        description.includes(this.filterText.toLowerCase()) ||
        status.includes(this.filterText.toLowerCase()) ||
        start_date.includes(this.filterText.toLowerCase()) ||
        this.calculateEndDate(contract.start_date, contract.term)
          .toLowerCase()
          .includes(this.filterText.toLowerCase()) ||
        term.includes(this.filterText.toString().toLowerCase())
      );
    });
    console.log(this.GetAllContract)
  }

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
  ]

  ngOnInit() {
    this.getAllAccountRequest()
    this.getAllContractRequest()
  }

  //GET全部contract
  GetAllContract!: HttpApiService[];
  first = 0;
  totalRecords = 0;

  getAllContractRequest(limit?: number, page?: number) {
    if (!page) {
      this.first = 0;
    }
    this.HttpApi.getAllContractRequest(limit, page).subscribe(res => {
        this.GetAllContract = res.body.contracts;
        this.GetAllContract = res.body.contracts.map((contract: any) => {
          const start_date = this.formatDate2(contract.start_date)
          const created_at = this.formatDate(contract.created_at);
          const updated_at = this.formatDate(contract.updated_at);
          return {...contract, start_date, created_at, updated_at};
        });
        this.totalRecords = res.body.total;
        this.loading = false;
      },
      error => {
        console.log(error);
      });
  }

  // GET全部Account
  GetAllAccount: any[] = [];
  selectedAccount_id: string = '';

  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(1).subscribe(
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

//POST 一筆contract
  postContractRequest(): void {
    if (this.contract_form.controls['start_date'].hasError('required') ||
      this.contract_form.controls['account_id'].hasError('required') ||
      this.contract_form.controls['term'].hasError('required') ||
      this.contract_form.controls['status'].hasError('required')) {
      this.edit = false;
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
        this.edit = true;
      })
      return;
    }

    let body = {
      code: this.contract_form.value.code,
      status: this.contract_form.value.status,
      description: this.contract_form.value.description,
      start_date: this.contract_form.value.start_date,
      term: this.contract_form.value.term,
      created_by: "7f5443f8-e607-4793-8370-560b8b688a61",
      account_id: this.selectedAccount_id, //帳戶ID
    }

    this.HttpApi.postContractRequest(body).subscribe(Request => {
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
          this.getAllContractRequest()
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

  //建立formgroup
  contract_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.contract_form = this.fb.group({
      contract_id: [''],
      salesperson_name: [''],
      code: [''],
      account_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      term: ['', [Validators.required]],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

  //新增&編輯dialog
  edit: boolean = false;
  dialogHeader!: string;
  showedit = true;//判斷是否dialog為新增與編輯
  selectedStatus!: any;
  c_id: any;

  showDialog(type: string, contract?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增契約';
      this.contract_form.reset();
      this.showedit = false;
      this.contract_form.patchValue({status: this.status[0].name});
    } else if (type === 'edit') {
      console.log("contract: " + JSON.stringify(contract))
      this.dialogHeader = '編輯契約';
      this.contract_form.patchValue(contract);
      this.contract_form.patchValue({
        start_date: new Date(contract.start_date),
      });
      this.showedit = true;
      this.selectedStatus = this.status.find((s) => s.name === contract.status);// 綁定已經選擇的狀態
      this.c_id = contract.contract_id;
    }
  }

  patchContractRequest(c_id: any): void {
    if (this.contract_form.controls['start_date'].hasError('required') ||
      this.contract_form.controls['account_id'].hasError('required') ||
      this.contract_form.controls['term'].hasError('required') ||
      this.contract_form.controls['status'].hasError('required')) {
      this.edit = false;
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
        this.edit = true;
      })
      return;
    }

    this.editStatus()//處理status的值，抓取name
    let start_date = new Date(this.contract_form.get('start_date')?.value);
    let body = {
      status: this.contract_form.get('status')?.value,
      start_date: start_date.toISOString(),
      account_id: this.selectedAccount_id, //帳戶ID
      term: this.contract_form.get('term')?.value,
      description: this.contract_form.get('description')?.value,
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45"
    }

    this.HttpApi.patchContractRequest(c_id, body).subscribe(
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
          this.getAllContractRequest()
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
      });
  }


//處理status的值
  editStatus(): void {
    //判斷selectedStatus是否有值，若有值則取出name屬性
    let statusName = this.selectedStatus ? this.selectedStatus.name : "";
    //將statusName更新到表單中
    this.contract_form.patchValue({status: statusName});
  }

  deleteContractRequest(c_id: any): void {
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
        this.HttpApi.deleteContractRequest(c_id).subscribe(Request => {
          console.log(Request)
          if (Request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getAllContractRequest();
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
  loading: boolean = true;
  sortField: any;
  sortOrder: any;
  code: any;

  loadPostsLazy(event: LazyLoadEvent) {
    this.loading = true;
    let page = event.first! / event.rows! + 1;
    let limit = event.rows;
    // this.sortField = event.sortField || 'code';
    // this.sortOrder = event.sortOrder || -1;
    this.HttpApi.getAllContractRequest(limit, page)
      .subscribe(res => {
          this.GetAllContract = res.body.contracts.map((contract: any) => {
            const start_date = this.formatDate2(contract.start_date)
            const created_at = this.formatDate(contract.created_at);
            const updated_at = this.formatDate(contract.updated_at);
            return {...contract, start_date, created_at, updated_at};
          });
          this.totalRecords = res.body.total;
          this.loading = false;
        },
        error => {
          console.log(error);
        });
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
    const start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, date.getHours() - 16);
    return start_date.toISOString().slice(0, 10);
  }

  calculateEndDate(startDate: string, term: number): string {
    const start = new Date(startDate);
    const end = new Date(start.getFullYear(), start.getMonth() + term, start.getDate());
    return end.toISOString().slice(0, 10);
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }
}

