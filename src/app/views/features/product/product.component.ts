import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  filteredProducts: any[] = [];
  product: any[] = [
    {
      name: "pen",
      enable: true,
      code: "00001",
      describe: "這是筆",
      series: "none",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    },
    {
      name: "grava",
      enable: false,
      code: "00002",
      describe: "這是芭樂",
      series: "none",
      created_at: "2023-04-15",
      created_by: "林",
      updated_by: "林",
    }
  ]
  filterText: any = '';
  filterproducts() {
    if (this.filterText === '') {
      this.filteredProducts = this.product;
    } else {
      this.filteredProducts = this.product.filter(product => {
        return (
          product.name.toLowerCase().includes(this.filterText.toLowerCase()) ||
          product.code.toLowerCase().includes(this.filterText.toLowerCase()) ||
          product.describe.toLowerCase().includes(this.filterText.toLowerCase()) ||
          product.series.toLowerCase().includes(this.filterText.toLowerCase()) ||
          (product.enable ? 'true' : 'false').toLowerCase().includes(this.filterText.toLowerCase())
        );
      });
    }
    console.log(this.filteredProducts)
  }
  ngOnInit() {
    this.filteredProducts = this.product;
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
      this.dialogHeader = '新增商品/服務';
      this.product_form.reset();
    } else if (type === 'edit') {
      console.log("product: " + JSON.stringify(product))
      this.dialogHeader = '編輯商品/服務';
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
