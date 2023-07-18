import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MenuItem} from "primeng/api";
import {HttpApiService} from "../../../api/http-api.service";
import {Lead} from "../../../shared/models/lead";
import {concatMap, tap} from 'rxjs/operators';
import {Observable, of} from "rxjs";
import Swal from "sweetalert2";
import {Table} from "primeng/table";


@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {
  getData!: Lead[];
  @ViewChild('dt') dt!: Table;

  status: any[] = [
    {
      name: "不明確",
      code: "Unqualified",
      boolean: false
    },
    {
      name: "新線索",
      code: "New",
      boolean: false
    },
    {
      name: "評估中",
      code: "Working",
      boolean: false
    },
    {
      name: "發展中",
      code: "Nurturing",
      boolean: false
    },
    {
      name: "已轉換",
      code: "Closed",
      boolean: false
    }
  ]

  source: any = [
    {
      name: "廣告",
      code: "advertising"
    },
    {
      name: "推薦",
      code: "referral"
    },
    {
      name: "直接訪問",
      code: "direct_traffic"
    },
    {
      name: "網路搜尋",
      code: "web_search"
    },
    {
      name: "朋友推薦",
      code: "friend_referral"
    }
  ]

  industry_id: any = [
    {
      name: "教育",
      code: "education"
    },
    {
      name: "金融服務",
      code: "financial_services"
    },
    {
      name: "醫療保健",
      code: "healthcare"
    },
    {
      name: "零售",
      code: "retail"
    },
    {
      name: "科技",
      code: "technology"
    }
  ]

  rating: any = [
    {
      name: "很有可能成交",
      code: "Hot"
    },
    {
      name: "可能性不明確",
      code: "Warm"
    },
    {
      name: "很有可能不成交",
      code: "Cold"
    }
  ]

  industry: any[] = [
    {
      "name": "零售業",
      "code": "retail"
    },
    {
      "name": "技術",
      "code": "technology "
    },
    {
      "name": "通訊",
      "code": "telecommunications"
    }
  ]

  type: any[] = [
    {
      "name": "個人客戶",
      // "code": "personal_customer"
    },
    {
      "name": "法人客戶",
      // "code": "business_customer"
    },
    {
      "name": "夥伴",
      // "code": "partner"
    },
    {
      "name": "競爭對手",
      // "code": "competitor"
    }
  ];
  leadValue: any;
  //表格最後下拉控制選項
  items: MenuItem[] = [{
    icon: "pi pi-eye",
    label: '檢視', command: () => {
      window.location.assign('/main/lead/view');
    }
  }, {
    icon: "pi pi-pencil",
    label: '編輯', command: () => {
      this.showDialog('edit', this.leadValue)
    }
  },
    {
      icon: "pi pi-trash",
      label: '刪除',
    }];
  // account_type: MenuItem[] = [
  //   {
  //     label: "個人客戶",
  //     icon: "pi pi-user",
  //     command: () => {
  //       this.addAccDialog();
  //       this.account_form.controls['type'].setValue('個人客戶');
  //       console.log(this.account_form.controls['type'].value)
  //     }
  //   },
  //   {
  //     label: "法人客戶",
  //     icon: "pi pi-building",
  //     command: () => {
  //       this.addAccDialog();
  //       this.account_form.controls['type'].setValue('法人客戶');
  //       console.log(this.account_form.controls['type'].value)
  //     }
  //   },
  //   {
  //     label: "夥伴",
  //     icon: "pi pi-users",
  //     command: () => {
  //       this.addAccDialog();
  //       this.account_form.controls['type'].setValue('夥伴');
  //       console.log(this.account_form.controls['type'].value)
  //     },
  //   },
  //   {
  //     label: "競爭者",
  //     icon: "pi pi-chart-line",
  //     command: () => {
  //       this.addAccDialog();
  //       this.account_form.controls['type'].setValue('競爭者');
  //       console.log(this.account_form.controls['type'].value)
  //     },
  //   },
  // ]
  lead_form!: FormGroup;
  account_form!: FormGroup;
  edit: boolean = false;
  addAcount: boolean = false;
  dialogHeader!: string;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder) {
    this.lead_form = this.fb.group({
      lead_id: ['', [Validators.required]],
      name: [''],
      status: ['', [Validators.required]],
      account_id: ['', [Validators.required]],
      description: ['', [Validators.required]],
      title: [''],
      phone_number: [''],
      cell_phone: [''],
      email: [''],
      line: [''],
      source: [''],
      industry_id: [''],
      rating: ['',],
      owner: [''],
      account_name: ['', [Validators.required]],
      created_by: ['', [Validators.required]],
      created_at: [''],
      updated_by: ['', [Validators.required]],
      updated_at: [''],
    });
    this.account_form = this.fb.group({
      name: ['', [Validators.required]],
      owner: [''],
      phone_number: [''],
      industry: [''],
      type: [''],
      parent_account_id: [''],
      created_at: [''],
      updated_at: [''],
      created_by: ['', Validators.required],
      updated_by: ['', Validators.required],
    });
  }

  GetAllAccount!: any[];
  accountSearch!: string;

  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(this.accountSearch, 1).subscribe({
      next: request => {
        this.GetAllAccount = request.body.accounts.map((account: any) => {
          // console.log(account)
          return {
            label: account.name,
            value: account.account_id
          };
        });
      },
      error: err => {
        console.log(err);
      }
    });
  }

  // 放沒有"已轉換"階段下拉選單
  filteredStatus: any[] = [];
  which: any[] = [];

  ngOnInit(): void {
    this.getAllAccountRequest();
    // 過濾"已轉換"
    this.filteredStatus = this.status.filter(option => option.code !== 'Closed');
    this.which = this.filteredStatus
  }

  // 搜尋關鍵字
  search: string = '';

  applyFilterGlobal($event: any, stringVal: any) {
    this.search = ($event.target as HTMLInputElement).value
    this.dt.filterGlobal(this.search, stringVal);
  }

  total!: number;
  loading: boolean = false;

  // 懶加載
  loadTable(e: any) {
    this.loading = true;
    // let limit = e.rows;
    let page = e.first / e.rows + 1;
    this.HttpApi.getAllLeadRequest(this.search, 1, page, e).subscribe(
      request => {
        this.getData = request.body.leads;
        this.loading = false;
        console.log(this.getData)
        this.total = request.body.total;
      });
  }

  // 點擊表頭狀態列執行搜尋
  toggleStatusFilter(index: number) {
    // 若已被點擊過則取消 filter
    if (this.status[index].boolean) {
      this.getAllLead();
      this.status[index].boolean = false
    }
    // 將所有狀態值改為 false，並且將點擊狀態改為true、執行該狀態 filter
    else {
      this.dt.filterGlobal(this.status[index].name, 'contains');
      for (let i in this.status) {
        this.status[i].boolean = false
      }
      this.status[index].boolean = true
    }
    // console.log(this.status)
  }

  showDialog(type: string, lead ?: any): void {
    // 將"業務員"設定為不可修改
    // this.lead_form.controls['owner'].disable();
    this.edit = true;
    // console.log(lead.account_name)
    if (type === 'add'
    ) {
      this.dialogHeader = '新增線索';
      this.lead_form.reset();
      // 將"線索狀態"設定為不可修改
      this.lead_form.controls['account_name'].enable();
      this.lead_form.controls['status'].disable();
      this.lead_form.patchValue({
        status: this.status.find(s => s.name === this.status[1].name),
      });
    } else if (type === 'edit') {
      this.dialogHeader = '編輯線索';
      this.lead_form.controls['status'].enable();
      console.log(this.status.find((s: { name: any; }) => s.name === lead.status).name)
      // 若線索狀態為"已轉換"，不能更改
      if (this.status.find((s: { name: any; }) => s.name === lead.status).name === "已轉換") {
        // 將下拉選單資料改為有以轉換之資料，修正patchValue status bug
        this.which = this.status;
        this.lead_form.controls['status'].disable();
      }
      this.lead_form.controls['account_name'].disable();
      this.lead_form.patchValue(lead);
      console.log(lead);
      this.lead_form.patchValue({
        status: this.status.find((s: { name: any; }) => s.name === lead.status),
        source: this.source.find((s: { name: any; }) => s.name === lead.source),
        rating: this.rating.find((s: { name: any; }) => s.name === lead.rating),
        account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === lead.account_name),
      });
      // this.lead_form.controls['account_name'].setValue(lead.account_name);
      // console.log(this.lead_form.controls['account_name'].value);
    }
  }

  getAllLead(): void {
    this.HttpApi.getAllLeadRequest(this.search, 1).subscribe(
      request => {
        this.getData = request.body.leads;
      });
  }

// 現在時間
  currentDate = new Date()

  postLead(): void {
    if (this.lead_form.controls['account_name'].hasError('required') ||
      this.lead_form.controls['status'].hasError('required') ||
      this.lead_form.controls['description'].hasError('required')
    ) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.lead_form.controls['account_name'].hasError('required')) {
          this.lead_form.controls['account_name'].markAsDirty();
        }
        if (this.lead_form.controls['status'].hasError('required')) {
          this.lead_form.controls['status'].markAsDirty();
        }
        if (this.lead_form.controls['description'].hasError('required')) {
          this.lead_form.controls['description'].markAsDirty();
        }
        this.edit = true;
      })
      return;
    }
    let body = {
      description: this.lead_form.controls['description'].value,
      status: this.status[1].name,
      account_id: this.selectedAccountId,
      // source: this.lead_form.value.source,
      source: this.selectedSource?.name,
      account_name: this.selectedAccountName,
      rating: this.selectedRating?.name,
      // rating: "Hot",
    }
    this.HttpApi.postLeadRequest(body).subscribe(request => {
      console.log(request)
      if (request.code === 200) {
        this.edit = false;
        Swal.fire({
          title: '成功',
          text: "已儲存您的資料 :)",
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })
        this.getAllLead()
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


  patchLead(): void {
    if (this.lead_form.controls['account_name'].hasError('required') ||
      this.lead_form.controls['status'].hasError('required') ||
      this.lead_form.controls['description'].hasError('required')
    ) {
      this.edit = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.lead_form.controls['account_name'].hasError('required')) {
          this.lead_form.controls['account_name'].markAsDirty();
        }
        if (this.lead_form.controls['status'].hasError('required')) {
          this.lead_form.controls['status'].markAsDirty();
        }
        if (this.lead_form.controls['description'].hasError('required')) {
          this.lead_form.controls['description'].markAsDirty();
        }
        this.edit = true;
      })
      return;
    }

    let id = this.lead_form.controls['lead_id'].value
    let body = {
      description: this.lead_form.controls['description'].value,
      status: this.selectedStatus?.name,
      // account_id: this.selectedAccountId,
      // source: this.lead_form.value.source,
      source: this.selectedSource?.name,
      // account_name: this.selectedAccountName,
      rating: this.selectedRating?.name,
      // rating: "Hot",
    }

    this.HttpApi.patchLeadRequest(id, body)
      .subscribe(request => {
        console.log(request)
        if (request.code === 200) {
          this.edit = false;
          Swal.fire({
            title: '成功',
            text: "已儲存您的變更 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          this.getAllLead()
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


  deleteLead(id: any): void {
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
        this.HttpApi.deleteLeadRequest(id).subscribe(request => {
          console.log(request)
          if (request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.getAllLead()
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


// 新增帳戶
  postAccount(): Observable<any> {
    const body = {
      name: this.account_form.controls['name'].value,
      phone_number: this.account_form.controls['phone_number'].value,
      industry_id: '00000000-0000-4000-a000-000000000000',
      // 將 type 物件轉換為 string
      // 使用 JSON.parse() 將 JSON 字串解析為 JavaScript 物件
      // 使用 map() 遍歷物件陣列，提取每個物件的 name 屬性
      type: JSON.parse(JSON.stringify(this.account_form.controls['type'].value)).map((item: {
        name: any;
      }) => item.name),
      parent_account_id: '00000000-0000-4000-a000-000000000000',
    };
    return this.HttpApi.postAccountRequest(body).pipe(
      tap(request => {
        console.log(request);
        this.getAllLead()
      })
    );
  }


  add_Acount() {
    if (this.account_form.controls['name'].hasError('required')) {
      this.edit = false
      this.addAcount = false;
      Swal.fire({
        title: '未填寫',
        text: "請填寫必填欄位！",
        icon: 'warning',
        showConfirmButton: false,
        timer: 1000
      }).then(() => {
        if (this.account_form.controls['name'].hasError('required')) {
          this.account_form.controls['name'].markAsDirty();
        }
        this.addAcount = true;
      })
      return;
    }

    this.edit = false
    this.addAcount = false;
    Swal.fire({
      title: '確認新增？',
      icon: 'warning',
      confirmButtonColor: '#6EBE71',
      showCancelButton: false,
      confirmButtonText: '確認',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // 使用 concatMap 運算符來確保 postAccount() 請求完成後才調用 getAllAccountRequest() 函數
        this.postAccount().pipe(
          concatMap(() => {
            this.getAllAccountRequest();
            console.log(this.GetAllAccount);
            return of(null);
          })
        ).subscribe(() => {
          this.addAcount = false;
          this.edit = true;
        });
        Swal.fire({
          title: '成功',
          text: "已儲存您的資料 :)",
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })
      }
    })
  }

  addAccDialog(): void {
    this.addAcount = true;
    this.edit = false;
    this.account_form.reset();
  }

  addAccshowAlertCancel() {
    this.addAcount = false;
    this.edit = false
    Swal.fire({
      title: '取消',
      text: "已取消您的變更！",
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: false,
      reverseButtons: false,
      timer: 1000
    }).then(() => {
      this.addAcount = false;
      this.edit = true
    })
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

  selectedStatus: any;

  statusValue(event: any): void {
    this.selectedStatus = this.status.find((s: { name: any; }) => s.name === event.value.name);
    // console.log("code: " + event.value.code);
    console.log(event.value.name);
    this.lead_form.value.status = this.selectedStatus.name
  }

  selectedAccountName!: string;
  selectedAccountId!: string;

  accountValue(event: any): void {
    this.selectedAccountName = this.GetAllAccount.find((a: { label: any; }) => a.label === event.value.label);
    this.selectedAccountId = event.value.value
    // console.log(this.selectedAccountId)
  }

  selectedSource: any;

  sourceValue(event: any): void {
    this.selectedSource = this.source.find((s: { name: any; }) => s.name === event.value.name);
    this.lead_form.value.source = this.selectedSource.name
  }

  selectedRating: any;

  ratingValue(event: any): void {
    this.selectedRating = this.rating.find((s: { name: any; }) => s.name === event.value.name);
    this.lead_form.value.rating = this.selectedRating.name
    // console.log(typeof this.selectedRating.name)
    // console.log(this.selectedRating.name)
  }

  industry_idValue(event: any): void {
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
  }

  selectedIndustry: any;

  industryValue(event: any): void {
    this.selectedIndustry = this.industry.find((s: { code: any; }) => s.code === event.value.code);
    this.lead_form.value.industry = this.selectedIndustry.name
  }

}
