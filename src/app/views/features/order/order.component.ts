import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import {Order} from "../../../shared/models/order";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
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

  searchTerm: string = '';// 定義一個 searchTerm 變數來儲存搜尋文字
// 搜尋函數
  filterorders() {
    // 如果沒有輸入搜尋文字，就直接返回原始資料
    if (!this.searchTerm) {
      this.getAllOrderRequest();
      return;
    }
    this.GetAllOrder = this.GetAllOrder.filter(order => {
      return (
        order.code.toString().toLowerCase().includes(this.searchTerm.toString().toLowerCase()) ||
        order.status.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.start_date.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        order.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    console.log(this.GetAllOrder)
  }

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

  // table lazyload
  // 搜尋關鍵字
  //search: string = '';
  loading: boolean = true;
  totalRecords = 0;

  loadTable(e: any) {
    this.loading = true;
    let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.getAllOrderRequest(limit, page);
  }

  ngOnInit() {
    //this.getAllOrderRequest()
  }

  //取得所有訂單資料
  GetAllOrder: Order[] = [];
  first = 0;

  getAllOrderRequest(limit?: number, page?: number) {
    if (!page) {
      this.first = 0;
    }
    this.HttpApi.getAllOrderRequest(limit, page).subscribe(
      (res) => {
        this.GetAllOrder = res.body.orders
        this.GetAllOrder = res.body.orders.map((order: any) => {
          const start_date = this.formatDate2(order.start_date)
          const created_by = this.getUserNameById(order.created_by);
          const updated_by = this.getUserNameById(order.updated_by);
          const created_at = this.formatDate(order.created_at);
          const updated_at = this.formatDate(order.updated_at);
          return {...order, start_date, created_by, updated_by, created_at, updated_at};
        });
        this.totalRecords = res.body.total;
        this.loading = false;
        console.log(this.GetAllOrder)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  //建立formgroup
  order_form: FormGroup;

  constructor(private fb: FormBuilder, private HttpApi: HttpApiService) {
    this.order_form = this.fb.group({
      code: [''],
      account_id: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      status: ['', [Validators.required]],
      contract_id: [''],
      contract_code: [''],
      amount: [''],
      describe: [''],
      activated_by: [''],
      activated_date: [''],
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
  showDialog(type: string, order?: any): void {
    // 新增與編輯dialog都無法自行編輯訂單號碼、建立者、建立時間、更新者、更新時間
    if (type === 'add') {
      this.dialogHeader = '新增訂單';
      this.order_form.reset();
      this.showedit = false; // 不顯示 activated_by 控件
      this.order_form.patchValue({status: this.status[0].name});
    } else if (type === 'edit') {
      console.log("order: " + JSON.stringify(order))
      this.dialogHeader = '編輯訂單';
      this.order_form.patchValue(order);
      this.showedit = true; // 不顯示 activated_by 控件
      // 綁定已經選擇的狀態
      this.selectedStatus = this.status.find(s => s.name === order.status);
    }
    this.edit = true;
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
}
