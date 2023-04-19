import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuItem } from "primeng/api";

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
  //table的死值
  order: any[] = [
    {
      number: "00001",
      account_name: "NKUST",
      order_amount: "150000",
      start_date: "2023-04-16",
      status: "草稿",
      contract_number: "00001",
      activated_by: "林",
      activated_date: "2023-04-17 15:00",
      created_at: "2023-04-15",
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
      activated_by: "林",
      activated_date: "2023-04-17 15:00",
      created_at: "2023-04-15",
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
      describe: [''],
      activated_by: [''],
      activated_date: [''],
      created_at: [''],
      updated_at: [''],
      created_by: [''],
      updated_by: [''],
    });
  }

  //編輯&新增dialog
  edit: boolean = false;
  dialogHeader!: string;
  showedit = true;//判斷是否dialog為新增與編輯
  showDialog(type: string, order?: any): void {
    // 新增與編輯dialog都無法自行編輯訂單號碼、建立者、建立時間、更新者、更新時間
    this.order_form.controls['number'].disable();
    this.order_form.controls['created_by'].disable();
    this.order_form.controls['updated_by'].disable();
    this.order_form.controls['created_at'].disable();
    this.order_form.controls['updated_at'].disable();
    this.order_form.controls['activated_by'].disable();
    this.order_form.controls['activated_date'].disable();
    if (type === 'add') {
      this.dialogHeader = '新增訂單';
      this.order_form.reset();
      this.showedit = false; // 不顯示 activated_by 控件
    } else if (type === 'edit') {
      console.log("order: " + JSON.stringify(order))
      this.dialogHeader = '編輯訂單';
      //取得電腦目前時區
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hour = now.getHours().toString().padStart(2, '0');
      const minute = now.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${year}-${month}-${day} ${hour}:${minute}`;
      //console.log(formattedTime);
      //更新時間為現在時間
      this.order_form.patchValue({
        updated_at: formattedTime
      });
      this.order_form.patchValue(order);
      this.showedit = true; // 不顯示 activated_by 控件
    }
    this.edit = true;
  }
}
