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
      "opportunity_name": "Acme",
      "close_date": "2023-05-12",
      "stage": "已結束",
      "forecast_category": "預期銷售",
      "opportunity_owner": "林"
    }
  ];
  stage: any[] = [
    {
      "name": "資格評估",
      "code": "qualification"
    },
    {
      "name": "需求分析",
      "code": "needs_analysis "
    },
    {
      "name": "提案",
      "code": "potential"
    },
    {
      "name": "談判",
      "code": "negotiation"
    },
    {
      "name": "已結束",
      "code": "closed"
    }
  ]
  forecast_category: any[] = [
    {
      "name": "預測",
      "code": "pipeline"
    },
    {
      "name": "預期銷售",
      "code": "omitted"
    },
    {
      "name": "已銷售",
      "code": "closed"
    }
  ]

  opportunity_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.opportunity_form = this.fb.group({
      account_name: ['', [Validators.required]],
      opportunity_name: ['', [Validators.required]],
      close_date: ['', [Validators.required]],
      stage: ['', [Validators.required]],
      forecast_category: ['', [Validators.required]],
      opportunity_owner: ['', [Validators.required]],
    });
  }

  edit: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, opportunity?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增';
      this.opportunity_form.reset();
    } else if (type === 'edit') {
      console.log("opportunity: " + JSON.stringify(opportunity))
      this.dialogHeader = '編輯';
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
}
