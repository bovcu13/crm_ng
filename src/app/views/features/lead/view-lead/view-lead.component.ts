import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HttpApiService} from "../../../../api/http-api.service";
import {ActivatedRoute} from "@angular/router";
import {MessageService} from "primeng/api";
import Swal from "sweetalert2";

@Component({
  selector: 'app-view-lead',
  templateUrl: './view-lead.component.html',
  styleUrls: ['./view-lead.component.scss'],
  providers: [MessageService]
})
export class ViewLeadComponent implements OnInit {
  name: string = "name"
  title: string = "title"
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

  //表格最後下拉控制選項
  lead_form!: FormGroup;
  edit: boolean = true;
  id: any;

  constructor(private HttpApi: HttpApiService, private fb: FormBuilder, private route: ActivatedRoute
    , private messageService: MessageService) {
    this.id = this.route.snapshot.paramMap.get('id');
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
  }

  ngOnInit(): void {
    this.getAllAccountRequest();
    this.getOneLead(this.id)
  }

  getData: any;
  stage!: string;

  getOneLead(id: any): void {
    this.HttpApi.getOneLeadRequest(id).subscribe(
      request => {
        this.getData = request.body
        console.log(this.getData)
        this.lead_form.controls['account_name'].disable();
        this.lead_form.patchValue(this.getData)
        this.lead_form.patchValue({
          lead_id: this.getData.lead_id,
          name: this.getData.name,
          industry_id: this.getData.industry_id,
          owner: this.getData.owner,
          description: this.getData.description,
          created_by: this.getData.created_by,
          created_at: this.getData.created_at,
          updated_by: this.getData.updated_by,
          updated_at: this.getData.updated_at,
          status: this.status.find((s: { name: any; }) => s.name === this.getData.status),
          source: this.source.find((s: { name: any; }) => s.name === this.getData.source),
          rating: this.rating.find((s: { name: any; }) => s.name === this.getData.rating),
          account_name: this.GetAllAccount.find((a: { label: any; }) => a.label === this.getData.account_name)
        });
        this.stage = this.status.find((s: { name: any; }) => s.name === this.getData.status).name
      }
    )
  }

  GetAllAccount: any[] = [];

  getAllAccountRequest() {
    this.HttpApi.getAllAccountRequest(1).subscribe(
      (request) => {
        this.GetAllAccount = request.body.accounts.map((account: any) => {
          // console.log(account);
          return {
            label: account.name,
            value: account.account_id
          };
        });
        this.GetAllAccount = [
          ...this.GetAllAccount.map((account: any) => {
            return {
              label: account.label,
              value: account.value
            };
          })
        ];
        console.log(this.GetAllAccount)
      },
      (error) => {
        console.log(error);
      }
    );
  }


  // 現在時間
  currentDate = new Date()
  isActive: boolean = false;

  patchLead(id: any): void {
    let body = {
      description: this.lead_form.controls['description'].value,
      status: this.selectedStatus?.name,
      source: this.selectedSource?.name,
      rating: this.selectedRating?.name,
      updated_by: "b93bda2c-d18d-4cc4-b0ad-a57056f8fc45",
      updated_at: this.currentDate
    }
    this.HttpApi.patchLeadRequest(id, body)
      .subscribe(request => {
        console.log(request)
        this.getOneLead(this.id)
      })
  }

  showAlert() {
    Swal.fire({
      title: '確認更改？',
      icon: 'warning',
      confirmButtonColor: '#00D963',
      cancelButtonColor: '#FF003A',
      showCancelButton: true,
      confirmButtonText: '確認',
      cancelButtonText: '取消',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: '成功',
          text: "已儲存您的變更 :)",
          icon: 'success',
          showConfirmButton: false,
          timer: 1500
        })
        this.patchLead(this.id);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: '取消',
          text: "已取消您的變更！",
          icon: 'error',
          showConfirmButton: false,
          timer: 700
        });
      }
    });
  }

  showWarn() {
    this.messageService.add({ severity: 'warn', summary: 'Warn', detail: '即將重新導向至契約頁面' });
    setTimeout(() => {
      window.location.assign('/main/lead');
    }, 1500); // 延遲3秒後跳轉頁面
  }

  selectedStatus: any;

  statusValue(event: any): void {
    this.selectedStatus = this.status.find((s: { name: any; }) => s.name === event.value.name);
    this.lead_form.value.status = this.selectedStatus.name
  }

  selectedAccountName!: string;
  selectedAccountId!: string;

  accountValue(event: any): void {
    this.selectedAccountName = this.GetAllAccount.find((a: { label: any; }) => a.label === event.value.label);
    this.selectedAccountId = event.value.value
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
  }

}




