import { Component } from '@angular/core';
@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent {
  lead: any[] = [
    {
      "name": "David",
      "stage": "潛在",
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
  edit: boolean = false;
  showDialog(): void {
    this.edit = true;
  }
  stageValue(event: any): void {
    console.log(event.value.code);
  }
}
