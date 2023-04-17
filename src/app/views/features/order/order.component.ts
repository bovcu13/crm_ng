import {Component} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import {MenuItem} from "primeng/api";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  order: any = {
    number: "00001",
    account_name: "NKUST",
    order_amount: "150000",
    start_date: "2023-04-16",
    status: "草稿",
    contract_number: "00001",
    created_at:"2023-04-15",
    created_by: "林",
    updated_by: "林",
  };

  //table的死值
  order_table: any[] = [
    {
      number: "00001",
      account_name: "NKUST",
      order_amount: "150000",
      start_date: "2023-04-16",
      status: "草稿",
      contract_number: "00001",
      created_at:"2023-04-15",
      created_by: "林",
      updated_by: "林",
    },
    {
      number: "00002",
      account_name: "sam",
      order_amount: "120000",
      start_date: "2023-03-15",
      status: "啟動中",
      contract_number: "00002",
      created_at:"2023-04-15",
      created_by: "林",
      updated_by: "林",
    }
  ]
  //p-dropdown status的下拉值
  status: any[] = [
    {
      name: "草稿",
      code: "draft",
    },
    {
      name: "啟動中",
      code: "activated",
    }
  ]
  //表格最後下拉控制選項
  items: MenuItem[] = [{label: '編輯',command: () => {this.showDialog('edit',this.order)}},
    {label: '刪除',}];
  //時間調整
  localToUtc(date: Date): Date {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours() - 8, date.getMinutes(), date.getSeconds()));
  }
  //建立formgroup
  order_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.order_form = this.fb.group({
      number: [''],
      account_name: ['', [Validators.required]],
      order_amount: [''],
      start_date: ['', [Validators.required]],
      status: ['', [Validators.required]],
      contract_number: ['', [Validators.required]],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

  //編輯&新增dialog
  edit: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, order?: any): void {
    this.edit = true;
    this.order_form.controls['number'].disable();
    this.order_form.controls['created_by'].disable();
    this.order_form.controls['updated_by'].disable();
    this.order_form.controls['created_at'].disable();
    this.order_form.controls['updated_at'].disable();
    if (type === 'add') {
      this.dialogHeader = '新增產品';
      this.order_form.reset();
    } else if (type === 'edit') {
      console.log("order: " + JSON.stringify(order))
      this.dialogHeader = '編輯產品';
      this.order_form.patchValue(order);
      //更新時間為現在時間
      const currentDate = new Date()
      this.order_form.patchValue({
        updated_at: currentDate
      });
    }
  }
}
