import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LazyLoadEvent, MenuItem} from "primeng/api";
import {HttpApiService} from "../../../api/http-api.service";
import {Lead} from "../../../shared/models/lead";
import {concatMap, tap} from 'rxjs/operators';
import {Observable, of} from "rxjs";
import Swal from "sweetalert2";


@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent implements OnInit {
  getData!: Lead[];
  filteredLead: any[] = [];
  lead: any[] = [
    {
      name: "David",
      status: "不明確",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@11111",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "新線索",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12222",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "評估中",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12333",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "發展中",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12344",
      company_name: "EIRC"
    },
    {
      name: "David",
      status: "已轉換",
      owner: "林",
      email: "abc@gmail.com",
      phone_number: "07-1234567",
      cell_phone: "0912345678",
      line: "@12345",
      company_name: "EIRC"
    },
  ]

  status: any[] = [
    {
      name: "不明確",
      code: "Unqualified",
    },
    {
      name: "新線索",
      code: "New",
    },
    {
      name: "評估中",
      code: "Working",
    },
    {
      name: "發展中",
      code: "Nurturing",
    },
    {
      name: "已轉換",
      code: "Closed",
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

  // account: any = [
  //   {
  //     name: "公司A",
  //     code: "company_a"
  //   },
  //   {
  //     name: "公司B",
  //     code: "company_b"
  //   },
  //   {
  //     name: "公司C",
  //     code: "company_c"
  //   }
  // ]

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
  account_type: MenuItem[] = [
    {
      label: "個人客戶",
      icon: "pi pi-user",
      command: () => {
        this.addAccDialog();
        this.account_form.controls['type'].setValue('個人客戶');
        console.log(this.account_form.controls['type'].value)
      }
    },
    {
      label: "法人客戶",
      icon: "pi pi-building",
      command: () => {
        this.addAccDialog();
        this.account_form.controls['type'].setValue('法人客戶');
        console.log(this.account_form.controls['type'].value)
      }
    },
    {
      label: "夥伴",
      icon: "pi pi-users",
      command: () => {
        this.addAccDialog();
        this.account_form.controls['type'].setValue('夥伴');
        console.log(this.account_form.controls['type'].value)
      },
    },
    {
      label: "競爭者",
      icon: "pi pi-chart-line",
      command: () => {
        this.addAccDialog();
        this.account_form.controls['type'].setValue('競爭者');
        console.log(this.account_form.controls['type'].value)
      },
    },
  ]
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
      account_name: [''],
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

  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(1).subscribe(
      (res) => {
        this.GetAllAccount = res.body.accounts.map((account: any) => {
          console.log(account)
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

  getLead(lead: any): void {
    this.leadValue = lead
  }

  filterText: any = '';

  filtered() {
    if (this.filterText === '') {
      this.filteredLead = this.lead;
    } else {
      this.filteredLead = this.lead.filter(lead => {
        return (
          lead.status.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.company_name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.phone_number.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.cell_phone.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.email.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.line.toLowerCase().includes(this.filterText.toLowerCase()) ||
          lead.owner.toLowerCase().includes(this.filterText.toLowerCase())
        );
      });
    }
    console.log(this.filteredLead)
  }

  ngOnInit(): void {
    this.filteredLead = this.getData;
    this.getAllAccountRequest();
  }

  total!: number;

  // 懶加載
  loadPostsLazy(event: LazyLoadEvent) {
    const page = (event.first! / event.rows!) + 1;
    this.HttpApi.getAllLeadRequest(page).subscribe(request => {
      this.getData = request.body.leads;
      this.total = request.body.total
      console.log(this.getData);
      // console.log(this.total)
    });
  }

  showDialog(type: string, lead?: any): void {
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
      this.lead_form.controls['account_name'].disable();
      this.lead_form.controls['status'].enable();
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

  // 現在時間
  currentDate = new Date()

  postLead(): void {
    let body = {
      description: this.lead_form.controls['description'].value,
      status: this.status[1].name,
      account_id: this.selectedAccountId,
      // source: this.lead_form.value.source,
      source: this.selectedSource?.name,
      account_name: this.selectedAccountName,
      rating: this.selectedRating?.name,
      // rating: "Hot",
      created_by: "7f5443f8-e607-4793-8370-560b8b688a61",
      created_at: this.currentDate
    }
    this.edit = false
    Swal.fire({
      title: '確認新增？',
      icon: 'warning',
      confirmButtonColor: '#00D963', // 设置为绿色
      showCancelButton: false,
      confirmButtonText: '確認',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.postLeadRequest(body).subscribe(request => {
          console.log(request)
          let event: LazyLoadEvent = {
            first: 0,
            rows: 10,
            sortField: undefined,
            sortOrder: undefined,
            multiSortMeta: undefined,
            filters: undefined,
            globalFilter: undefined,
          };
          if (request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已儲存您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.loadPostsLazy(event);
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
    })
  }

  patchLead(): void {
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
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45",
      updated_at: this.currentDate
    }
    this.edit = false
    Swal.fire({
      title: '確認更改？',
      icon: 'warning',
      confirmButtonColor: '#00D963', // 设置为绿色
      showCancelButton: false,
      confirmButtonText: '確認',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.patchLeadRequest(id, body)
          .subscribe(request => {
            console.log(request)
            let event: LazyLoadEvent = {
              first: 0,
              rows: 10,
              sortField: undefined,
              sortOrder: undefined,
              multiSortMeta: undefined,
              filters: undefined,
              globalFilter: undefined,
            };
            if (request.code === 200) {
              Swal.fire({
                title: '成功',
                text: "已儲存您的變更 :)",
                icon: 'success',
                showConfirmButton: false,
                timer: 1000
              })
              this.loadPostsLazy(event);
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
    })
  }

  deleteLead(id: any): void {
    Swal.fire({
      title: '確認刪除？',
      icon: 'warning',
      confirmButtonColor: '#00D963',
      cancelButtonColor: '#d90000',
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.HttpApi.deleteLeadRequest(id).subscribe(request => {
          console.log(request)
          let event: LazyLoadEvent = {
            first: 0,
            rows: 10,
          };
          if (request.code === 200) {
            Swal.fire({
              title: '成功',
              text: "已刪除您的資料 :)",
              icon: 'success',
              showConfirmButton: false,
              timer: 1000
            })
            this.loadPostsLazy(event);
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
      type: this.account_form.controls['type'].value ? this.account_form.controls['type'].value : '00000000-0000-4000-a000-000000000000',
      parent_account_id: '00000000-0000-4000-a000-000000000000',
      created_by: "eb6751fe-ba8d-44f6-a92f-e2efea61793a"
    };

    return this.HttpApi.postAccountRequest(body).pipe(
      tap(request => {
        console.log(request);
        let event: LazyLoadEvent = {
          first: 0,
          rows: 10,
          sortField: undefined,
          sortOrder: undefined,
          multiSortMeta: undefined,
          filters: undefined,
          globalFilter: undefined,
        };
        this.loadPostsLazy(event);
      })
    );
  }


  add_Acount() {
    this.edit = false
    this.addAcount = false;
    Swal.fire({
      title: '確認新增？',
      icon: 'warning',
      confirmButtonColor: '#00D963', // 设置为绿色
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
    // console.log("name: " + event.value.name);
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
