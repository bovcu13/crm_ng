import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
      series: "none"
    },
    {
      name: "grava",
      enable: false,
      code: "00002",
      describe: "",
      series: "none"
    }
  ]
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
      this.product_form.patchValue(product);
    }
  }
}
