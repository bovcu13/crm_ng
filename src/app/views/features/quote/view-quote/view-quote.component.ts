import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpApiService } from 'src/app/api/http-api.service';
import { Quote } from 'src/app/shared/models/quote';

@Component({
  selector: 'app-view-quote',
  templateUrl: './view-quote.component.html',
  styleUrls: ['./view-quote.component.scss']
})
export class ViewQuoteComponent {
//p-dropdown status的下拉值
status: any[] = [
  {
    name: "草稿",
    code: "draft",
  },
  {
    name: "需要審查",
    code: "need_review",
  },
  {
    name: "審查中",
    code: "in_review",
  },
  {
    name: "已批准",
    code: "approved",
  },
  {
    name: "已呈現",
    code: "presented",
  },
  {
    name: "已接受",
    code: "accepted",
  }
]
  q_id:any;
  quote_form: FormGroup;
  constructor(private fb: FormBuilder, private HttpApi: HttpApiService, private route: ActivatedRoute) {
    this.quote_form = this.fb.group({
      quote_id: [''],
      code: [''],
      name: ['', [Validators.required]],
      opportunity_id: ['', [Validators.required]],
      opportunity_name: [''],
      is_syncing: [false],
      account_id: ['', [Validators.required]],
      account_name: [''],
      status: [''],
      description: [''],
      expiration_date: [''],
      tax: [''],
      discount: [''],
      total_price: [''],
      shipping_and_handling: [''],
      subtotal: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
    this.q_id = this.route.snapshot.paramMap.get('q_id')
    console.log("取到的q_id: " + this.q_id)
    this.getOneQuotetRequest(this.q_id)
  }

  //取得當筆報價資料
  GetOneQuote: Quote[] = [];
  getOneQuotetRequest(q_id: any): void {
    this.HttpApi.getOneQuotetRequest(q_id).subscribe( res => {
      this.GetOneQuote = res.body;
      this.quote_form.patchValue({
        code: res.body.code,
        opportunity_name: res.body.name,
        is_syncing: res.body.is_syncing,
        total_price: res.body.total_price,
      });
      console.log(this.GetOneQuote)
    },
    (error) => {
      console.log(error);
    }
  );
  }



    // GET全部Account
    GetAllOpportunity: any[] = [];
    selectedOpportunity_id: string = '';
    getAllopportunityRequest() {
      this.HttpApi.getAllopportunityRequest(1).subscribe(
        (res) => {
          this.GetAllOpportunity = res.body.opportunities.map((opportunity: any) => {
            return {
              label: opportunity.name,
              value: opportunity.opportunity_id,
              account_id: opportunity.account_id,
            };
          });
        },
        (error) => {
          console.log(error);
        }
      );
    }

    selectedAccount_id: string = '';
    //取得選擇的商機帳戶id
    selectedOpportunity() {
      const selectedOpportunity = this.GetAllOpportunity.find((opportunity) => opportunity.value === this.selectedOpportunity_id);
      this.selectedAccount_id = selectedOpportunity?.account_id;
    }

    //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }
}
