import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import {LazyLoadEvent} from 'primeng/api';

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
      const code = contract.code.toString().toLowerCase();
      const description = contract.description.toLowerCase();
      const status = contract.status.toLowerCase();
      const start_date = contract.start_date.toLowerCase();
      const term = contract.term.toString().toLowerCase();

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
      name: "契約已終止",
      code: "contract_terminated",
    },
  ]
  ngOnInit() {
    this.getAllContractRequest()
  }
    //GET全部contract
    GetAllContract!: HttpApiService[];
    getAllContractRequest(){
      this.HttpApi.getAllContractRequest(1).subscribe(res => {
          this.GetAllContract = res.body.contracts;
          this.GetAllContract = res.body.contracts.map((contract: any) => {
            const start_date = this.formatDate2(contract.start_date)
            const created_by = this.getUserNameById(contract.created_by);
            const updated_by = this.getUserNameById(contract.updated_by);
            const created_at = this.formatDate(contract.created_at);
            const updated_at = this.formatDate(contract.updated_at);
            return {...contract,start_date, created_by, updated_by, created_at, updated_at};
          });
        },
        error => {
          console.log(error);
        });
    }


  //建立formgroup
  contract_form: FormGroup;
  constructor(private HttpApi: HttpApiService,private fb: FormBuilder) {
    this.contract_form = this.fb.group({
      contract_id: [''],
      owner: [''],
      code: [''],
      account_id: ['', [Validators.required]],
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
  showDialog(type: string, contract?: any): void {
    this.edit = true;
    this.contract_form.controls['owner'].disable();
    this.contract_form.controls['code'].disable();
    this.contract_form.controls['created_by'].disable();
    this.contract_form.controls['updated_by'].disable();
    this.contract_form.controls['created_at'].disable();
    this.contract_form.controls['updated_at'].disable();
    if (type === 'add') {
      this.dialogHeader = '新增契約';
      this.contract_form.reset();
      this.showedit = false;
      this.contract_form.patchValue({ status: this.status[0].name });
    } else if (type === 'edit') {
      console.log("contract: " + JSON.stringify(contract))
      this.dialogHeader = '編輯契約';
      this.contract_form.patchValue(contract);
      this.contract_form.patchValue({
        start_date: new Date(contract.start_date),
      });
      this.showedit = true;
      // 綁定已經選擇的狀態
      this.selectedStatus = this.status.find(s => s.name === contract.status);
    }
  }
  //懶加載
  totalRecords: any;
  loadPostsLazy(event: LazyLoadEvent) {
    const page = (event.first! / event.rows!) + 1;
    this.HttpApi.getAllContractRequest(page).subscribe(request => {
      this.totalRecords = request.body.total;
      this.getAllContractRequest()
      console.log(this.GetAllContract);
    });
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
  formatDate2(dateString2: string): string {
    const date = new Date(dateString2);
    const start_date = new Date(date.getFullYear(), date.getMonth() , date.getDate());
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

