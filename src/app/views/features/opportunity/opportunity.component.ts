import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss']
})
export class OpportunityComponent {
  opportunity: any[] = [
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-12",
      "stage": "已結束",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-12",
      "stage": "談判",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-12",
      "stage": "提案",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-12",
      "stage": "需求分析",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
    {
      "account_name": "David",
      "name": "David - Acme",
      "close_date": "2023-05-12",
      "stage": "資格評估",
      "forecast_category": "預期銷售",
      "owner": "林"
    },
  ];
  stage: any[] = [
    {
      name: "資格評估",
      code: "qualification"
    },
    {
      name: "需求分析",
      code: "needs_analysis "
    },
    {
      name: "提案",
      code: "potential"
    },
    {
      name: "談判",
      code: "negotiation"
    },
    {
      name: "已結束",
      code: "closed"
    }
  ]
  forecast_category: any[] = [
    {
      "name": "被遺漏",
      "code": "omitted"
    },
    {
      "name": "進行中",
      "code": "pipeline"
    },
    {
      "name": "最佳情況",
      "code": "best_case"
    },
    {
      "name": "承諾",
      "code": "commit"
    },
    {
      "name": "結案",
      "code": "closed"
    }
  ]

  account: any = [
    {
      name: "公司A",
      code: "company_a"
    },
    {
      name: "公司B",
      code: "company_b"
    },
    {
      name: "公司C",
      code: "company_c"
    }
  ]

  opportunity_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.opportunity_form = this.fb.group({
      account_name: ['', [Validators.required]],
      name: ['', [Validators.required]],
      close_date: ['', [Validators.required]],
      stage: ['', [Validators.required]],
      forecast_category: ['', [Validators.required]],
      amount: [''],
      owner: [''],
      created_by: [''],
      created_at: [''],
      updated_by: [''],
      updated_at: [''],
    });
  }

  edit: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, opportunity?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增商機';
      this.opportunity_form.reset();
      // 將"商機"設定為不可修改
      this.opportunity_form.controls['stage'].disable();
      this.opportunity_form.patchValue({
        status: this.stage.find(s => s.name === this.stage[1].name),
      });
    } else if (type === 'edit') {
      console.log("opportunity: " + JSON.stringify(opportunity))
      this.dialogHeader = '編輯商機';
      this.opportunity_form.controls['stage'].enable();
      this.opportunity_form.patchValue(opportunity);
      this.opportunity_form.patchValue({
        stage: this.stage.find(s => s.name === opportunity.stage)
      });
    }
  }
  stageValue(event: any): void {
    const selectedStage = this.stage.find((s) => s.code === event.value.code);
    console.log(event.value.code);
    console.log(selectedStage.code);
  }
  forecast_categoryValue(event: any): void {
    const selectedForecastCategory = this.forecast_category.find((s) => s.code === event.value.code);
    console.log(event.value.code);
    console.log(selectedForecastCategory.name);
  }

  accountValue(event: any): void {
    console.log("code: " + event.value.code);
    console.log("name: " + event.value.name);
  }
}
