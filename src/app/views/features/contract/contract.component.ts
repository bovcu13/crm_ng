import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss']
})
export class ContractComponent {
  filteredContracts: any[] = [];
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
      "status": "審批中",
      "start_date": "2023-02-15",
      "term": 7,
      "created_at": "2023-02-05",
      "created_by": "林",
      "updated_by": "林",
    }
  ];

  filterText: any = '';
  filtercontracts() {
    if (this.filterText === '') {
      this.filteredContracts = this.contract;
    } else {
      this.filteredContracts = this.contract.filter(contract => {
        return (
          contract.number.toLowerCase().includes(this.filterText.toLowerCase()) ||
          contract.owner.toLowerCase().includes(this.filterText.toLowerCase()) ||
          contract.account_name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          contract.status.toLowerCase().includes(this.filterText.toLowerCase()) ||
          contract.start_date.toLowerCase().includes(this.filterText.toLowerCase()) ||
          contract.term.toString().toLowerCase().includes(this.filterText.toLowerCase())
        );
      });
    }
    console.log(this.filteredContracts)
  }
  ngOnInit() {
    this.filteredContracts = this.contract;
  }

  //p-dropdown status的下拉值
  status: any[] = [
    {
      name: "草稿",
      code: "draft",
    },
    {
      name: "審批中",
      code: "in_approval",
    },
    {
      name: "拒絕",
      code: "rejected",
    },
    {
      name: "等待簽名",
      code: "awaiting_signature",
    },
    {
      name: "等待簽名",
      code: "awaiting_signature",
    },
    {
      name: "已簽署",
      code: "signed",
    },
    {
      name: "已取消",
      code: "canceled",
    },
    {
      name: "契約已終止",
      code: "contract_terminated",
    },
  ]
  //換算契約結束日期
  calculateEndDate(startDate: string, term: number): string {
    const start = new Date(startDate);
    const end = new Date(start.getFullYear(), start.getMonth() + term, start.getDate());
    return end.toISOString().slice(0, 10);
  }

  //偵測status變量
  onStatusChange(event: any) {
    console.log("狀態選擇status: " + event.value.code + event.value.name);
  }

  //建立formgroup
  contract_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.contract_form = this.fb.group({
      owner: [''],
      number: [''],
      account_name: ['', [Validators.required]],
      status: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      term: ['', [Validators.required]],
      description: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

  //新增&編輯dialog
  edit: boolean = false;
  dialogHeader!: string;
  showedit = true;//判斷是否dialog為新增與編輯
  selectedStatus!: any;
  showDialog(type: string, contract?: any): void {
    this.edit = true;
    this.contract_form.controls['owner'].disable();
    this.contract_form.controls['number'].disable();
    this.contract_form.controls['created_by'].disable();
    this.contract_form.controls['updated_by'].disable();
    this.contract_form.controls['created_at'].disable();
    this.contract_form.controls['updated_at'].disable();
    if (type === 'add') {
      this.dialogHeader = '新增契約';
      this.contract_form.reset();
      this.showedit = false;
      this.contract_form.patchValue({ status: this.status[0].name });
    } else if (type === 'edit') {
      console.log("contract: " + JSON.stringify(contract))
      this.dialogHeader = '編輯契約';
      this.contract_form.patchValue(contract);
      this.contract_form.patchValue({
        start_date: new Date(contract.start_date),
      });
      this.showedit = true;
      // 綁定已經選擇的狀態
      this.selectedStatus = this.status.find(s => s.name === contract.status);
    }
  }
}

