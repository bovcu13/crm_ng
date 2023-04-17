import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuItem } from "primeng/api";
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  product: any[] = [
    {
      name: "pen",
      enable: true,
      code: "00001",
      describe: "",
      series: "none",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    },
    {
      name: "grava",
      enable: false,
      code: "00002",
      describe: "",
      series: "none",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    }
  ]
  //表格最後下拉控制選項
  items: MenuItem[] = [{ label: '編輯', command: () => { this.showDialog('edit', this.product[0]) } },
  { label: '刪除', }];

  OnInit() {

  }

  //建立formgroup
  product_form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.product_form = this.fb.group({
      name: ['', [Validators.required]],
      series: [''],
      code: [''],
      enable: [false],
      describe: [''],
      created_at: [''],
      created_by: [''],
      updated_at: [''],
      updated_by: [''],
    });
  }
  //編輯&新增dialog
  edit: boolean = false;
  dialogHeader!: string;
  showDialog(type: string, product?: any): void {
    this.edit = true;
    this.product_form.controls['created_by'].disable();
    this.product_form.controls['updated_by'].disable();
    this.product_form.controls['created_at'].disable();
    this.product_form.controls['updated_at'].disable();
    if (type === 'add') {
      this.dialogHeader = '新增產品';
      this.product_form.reset();
    } else if (type === 'edit') {
      console.log("product: " + JSON.stringify(product))
      this.dialogHeader = '編輯產品';
      //取得目前時間
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hour = now.getHours().toString().padStart(2, '0');
      const minute = now.getMinutes().toString().padStart(2, '0');
      const formattedTime = `${year}-${month}-${day} ${hour}:${minute}`;
      //console.log(formattedTime);
      this.product_form.patchValue(product);
      this.product_form.patchValue({
        updated_at: formattedTime
      });
    }
  }
}
