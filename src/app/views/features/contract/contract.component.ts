import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpApiService} from "../../../api/http-api.service";
import {LazyLoadEvent, MessageService} from 'primeng/api';
import Swal from "sweetalert2";
import {Table} from "primeng/table";

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
  providers: [MessageService]
})
export class ContractComponent {
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
  ]

  ngOnInit() {
    this.getAllOpportunityRequest()
  }

  //GET全部contract
  GetAllContract!: HttpApiService[];
  first = 0;
  totalRecords = 0;

  getAllContractRequest() {
    this.HttpApi.getAllContractRequest(this.search, 1).subscribe({
      next: res => {
        const contract = res.body.contracts.filter((contract: any) => contract.account_name != null);
        this.GetAllContract = contract.map((contract: any) => {
          const start_date = this.formatDate2(contract.start_date)
          const end_date = this.formatDate2(contract.end_date)
          const created_at = this.formatDate(contract.created_at);
          const updated_at = this.formatDate(contract.updated_at);
          return {...contract, start_date, end_date, created_at, updated_at};
        });
        this.totalRecords = res.body.total;
      },
      error: error => {
        console.log(error);
      }
    });
  }

  // GET全部Opportunity
  GetAllOpportunity: any[] = [];
  OpportunitySearch!: string;

  getAllOpportunityRequest() {
    this.HttpApi.getAllOpportunityRequest(this.OpportunitySearch, 1).subscribe({
      next: res => {
        const GetOpportunity = res.body.opportunities.filter((opportunity: any) => opportunity.stage == "已結束")
        this.GetAllOpportunity = GetOpportunity.map((opportunity: any) => {
          return {
            label: opportunity.name,
            value: opportunity.opportunity_id,
            account_id: opportunity.account_id,
          };
        });
      },
      error: error => {
        console.log(error);
      }
    });
  }

//POST 一筆contract
  postContractRequest(): void {
    if (this.contract_form.controls['start_date'].hasError('required') ||
      this.contract_form.controls['opportunity_id'].hasError('required') ||
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
        if (this.contract_form.controls['opportunity_id'].hasError('required')) {
          this.contract_form.controls['opportunity_id'].markAsDirty();
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
      status: this.contract_form.get('status')?.value.name,
      description: this.contract_form.value.description,
      start_date: this.contract_form.value.start_date,
      term: this.contract_form.value.term,
      opportunity_id: this.contract_form.value.opportunity_id,
    }

    this.HttpApi.postContractRequest(body).subscribe({
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
      error: error => {
        console.log(error);
      }
    })
  }

  //建立formgroup
  contract_form: FormGroup;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private messageService: MessageService) {
    this.contract_form = this.fb.group({
      contract_id: [''],
      salesperson_name: [''],
      code: [''],
      opportunity_id: ['', [Validators.required]],
      account_name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: [''],
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
  c_id: any;
  disableSaveButton: boolean = false

  showDialog(type: string, contract?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增契約';
      this.contract_form.reset();
      this.showedit = false;
      this.contract_form.patchValue({status: this.status.find(s => s.name === this.status[0].name),});
      this.contract_form.controls['status'].disable();
    } else if (type === 'edit') {
      console.log("contract: " + JSON.stringify(contract))
      this.dialogHeader = '編輯契約';
      this.contract_form.patchValue(contract);
      this.contract_form.patchValue({
        start_date: new Date(contract.start_date),
        account_name: this.GetAllOpportunity.find((a: { label: any; }) => a.label === contract.account_name),
      });
      this.showedit = true;
      if (contract.status === "已過期" || contract.status === "已取消") {
        this.contract_form.patchValue({
          status: this.status.find((s: { name: any; }) => s.name === contract.status),
        });
        this.contract_form.controls['status'].disable();
        this.disableSaveButton = true;
      } else {
        this.contract_form.patchValue({
          status: this.status.find((s: { name: any; }) => s.name === contract.status),
        });
        this.contract_form.controls['status'].enable();
        this.disableSaveButton = false;
      }
      this.c_id = contract.contract_id;
    }
  }

  patchContractRequest(c_id: any): void {
    if (this.contract_form.controls['start_date'].hasError('required') ||
      this.contract_form.controls['opportunity_id'].hasError('required') ||
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
        if (this.contract_form.controls['opportunity_id'].hasError('required')) {
          this.contract_form.controls['opportunity_id'].markAsDirty();
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
    let start_date = new Date(this.contract_form.get('start_date')?.value);
    let body = {
      status: this.contract_form.get('status')?.value.name,
      start_date: start_date.toISOString(),
      opportunity_id: this.contract_form.get('opportunity_id')?.value,
      term: this.contract_form.get('term')?.value,
      description: this.contract_form.get('description')?.value,
    }
    this.HttpApi.patchContractRequest(c_id, body).subscribe({
      next: Request => {
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
      },
      error: error => {
        console.log(error);
      }
    });
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
  search: string = '';  // 搜尋關鍵字
  loading: boolean = false;

  loadPostsLazy(e: LazyLoadEvent) {
    let page = e.first! / e.rows! + 1;
    let limit = e.rows;
    this.loading = true;
    this.HttpApi.getAllContractRequest(this.search, 1, limit, page, e)
      .subscribe({
        next: res => {
          const contract = res.body.contracts.filter((contract: any) => contract.account_name != null);
          this.GetAllContract = contract.map((contract: any) => {
            const start_date = this.formatDate2(contract.start_date)
            const end_date = this.formatDate2(contract.end_date)
            const created_at = this.formatDate(contract.created_at);
            const updated_at = this.formatDate(contract.updated_at);
            return {...contract, start_date, end_date, created_at, updated_at};
          });
          this.totalRecords = res.body.total;
          console.log(this.GetAllContract)
          this.loading = false;
        },
        error: error => {
          console.log(error);
        }
      });
  }

  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt1.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
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
    const formattedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString().slice(0, 10);
    return formattedDate;
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }

  //上傳檔案
  uploadedFiles: any[] = [];

  onUpload(event: UploadEvent) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }
    this.messageService.add({severity: 'info', summary: 'File Uploaded', detail: ''});
  }
}

