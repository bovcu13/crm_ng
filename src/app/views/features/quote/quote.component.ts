import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-quote',
  templateUrl: './quote.component.html',
  styleUrls: ['./quote.component.scss']
})
export class QuoteComponent {
  quote: any[] = [
    {
      "quote_name": "milk",
      "opportunity_name": "NKUST",
      "syncing": true,
      "expiration_date": "2023-04-05",
      "subtotal": 50,
      "total_price": 100
    }
  ];

  quote_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.quote_form = this.fb.group({
      quote_name: ['', [Validators.required]],
      opportunity_name: ['', [Validators.required]],
      syncing: ['', [Validators.required]],
      expiration_date: ['', [Validators.required]],
      subtotal: ['', [Validators.required]],
      total_price: ['', [Validators.required]],
    });
  }

  edit: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, quote?: any): void {
    this.edit = true;
    if (type === 'add') {
      this.dialogHeader = '新增';
      this.quote_form.reset();
    } else if (type === 'edit') {
      console.log("quote: " + JSON.stringify(quote))
      this.dialogHeader = '編輯';
      this.quote_form.patchValue(quote);
    }
  }
}
