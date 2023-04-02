import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';


@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent {
  lead: any[] = [
    {
      "name": "David",
      "stage": "談判中",
      "owner": "林",
      "account": "EIRC"
    }
  ];
  stage: any[] = [
    {
      "name": "潛在",
      "code": "potential"
    },
    {
      "name": "談判中",
      "code": "negotiating"
    },
    {
      "name": "已結束",
      "code": "closed"
    }
  ]

  lead_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.lead_form = this.fb.group({
      name: ['', [Validators.required]],
      stage: ['', [Validators.required]],
      owner: ['', [Validators.required]],
      account: ['', [Validators.required]],
    });
  }

  edit: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, lead?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增';
      this.lead_form.reset();
    } else if (type === 'edit') {
      console.log("lead: " + JSON.stringify(lead))
      this.dialogHeader = '編輯';
      this.lead_form.patchValue(lead);
      this.lead_form.patchValue({
        stage: this.stage.find(s => s.name === lead.stage)
      });
    }
  }
  stageValue(event: any): void {
    const selectedStage = this.stage.find((s) => s.code === event.value.code);
    console.log(event.value.code);
    console.log(selectedStage.name);
  }
}
