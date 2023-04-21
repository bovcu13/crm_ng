import {Component, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent {
  contract: any[] = [
    {
      "owner": "林",
      "number": "00001",
      "account_name": "milk",
      "status": "草稿",
      "start_date": "2023-04-09",
      "term": 1,
      "created_at": "2023-03-15",
      "created_by": "林",
      "updated_by": "林",
    },
    {
      "owner": "林",
      "number": "00002",
      "account_name": "nkust",
      "status": "草稿",
      "start_date": "2023-02-15",
      "term": 7,
      "created_at": "2023-02-05",
      "created_by": "林",
      "updated_by": "林",
    }
  ];

  //p-dropdown status的下拉值
  status: any[] = [
    {
      name: "草稿",
      code: "draft",
    }
  ]

  calculateEndDate(startDate: string, term: number): string {
    const start = new Date(startDate);
    const end = new Date(start.getFullYear(), start.getMonth() + term, start.getDate());
    return end.toISOString().slice(0, 10);
  }

  //建立formgroup
  contract_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.contract_form = this.fb.group({
      owner: [''],
      number: [''],
      account_name: ['',[Validators.required]],
      status: ['',[Validators.required]],
      start_date: ['',[Validators.required]],
      term: ['',[Validators.required]],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

  ngOnInit() {

  }

  //新增&編輯dialog
  edit: boolean = false;
  dialogHeader!: string;

  showDialog(type: string, contract?: any): void {
    this.edit = true;
    this.contract_form.controls['owner'].disable();
    this.contract_form.controls['number'].disable();
    this.contract_form.controls['status'].disable();
    this.contract_form.controls['created_by'].disable();
    this.contract_form.controls['updated_by'].disable();
    this.contract_form.controls['created_at'].disable();
    this.contract_form.controls['updated_at'].disable();
    if (type === 'add') {
      this.dialogHeader = '新增契約';
      this.contract_form.reset();
    } else if (type === 'edit') {
      console.log("contract: " + JSON.stringify(contract))
      this.dialogHeader = '編輯契約';
      this.contract_form.patchValue(contract);
      this.contract_form.patchValue({
        start_date: new Date(contract.start_date),
      });
    }
  }
}

