import { Component } from '@angular/core';
interface lead {
  name: string;
  position: string;
  company: string;
  phone_number: string;
  cell_phone: string;
  email: string;
}
@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss']
})
export class LeadComponent {
  lead: lead[] = [];
  ngOnInit(): void {
    this.lead=[

    ]
  }
}
