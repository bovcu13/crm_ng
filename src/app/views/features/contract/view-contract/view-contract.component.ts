import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpApiService} from "../../../../api/http-api.service";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.scss'],
  providers: [MessageService]
})
export class ViewContractComponent {
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

  contract_log: any[] = [
    {
      date: "2023-05-06 08:00",
      field: "已建立",
      user: "林",
    },
    {
      date: "2023-05-07 17:00",
      field: "狀態",
      user: "林",
      old: "草稿",
      new: "審批中",
    },
  ];

  contract_order: any[] = [
    {
      order_code: "O2305003",
      status: "草稿",
      start_date: "2023-05-07",
      contract_code: "C2305002",
    },
    {
      order_code: "O2305002",
      status: "啟動中",
      start_date: "2023-02-11",
      contract_code: "C2305002",
    },
  ]

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

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.contract_form = this.fb.group({
      contract_id: [''],
      salesperson_name: [''],
      code: [''],
      account_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      start_date: [new Date(), [Validators.required]],
      term: ['', [Validators.required]],
      description: [''],
    });
    this.c_id = this.route.snapshot.paramMap.get('c_id')
    console.log("取到的o_id: " + this.c_id)
    this.getOneContractRequest(this.c_id)
    this.getAllAccountRequest()
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
    const start_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
    return start_date.toISOString().slice(0, 10);
  }

  getEndDate(): string {
    const startDate = this.contract_form.controls['start_date'].value;
    const term = this.contract_form.controls['term'].value;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + term, endDate.getDate() - 1);
    return endDate.toISOString().slice(0, 10);
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
    this.getOneContractRequest(this.c_id)
  }
}
