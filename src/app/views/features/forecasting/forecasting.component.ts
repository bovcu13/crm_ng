import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';
interface Forecasting {
  opportunity: string;
  account_name: string;
  amount: number;
  created_end: string;
  section: string;
  possibility: any;
  type: string;
  owner: string;
}
@Component({
  selector: 'app-forecasting',
  templateUrl: './forecasting.component.html',
  styleUrls: ['./forecasting.component.scss']
})
export class ForecastingComponent {
  //選擇業務姓名
  users = ['小名', '大名', '大小名']
  selecteduser!: string;
  //選擇預測年度
  forecasting_range = ["一月 會計年度 2022", "二月 會計年度 2022", "三月 會計年度 2022", "四月 會計年度 2022", "五月 會計年度 2022", "六月 會計年度 2022", "七月 會計年度 2022", "八月 會計年度 2022", "九月 會計年度 2022", "十月 會計年度 2022", "一一月 會計年度 2022", "十二月 會計年度 2022", "一月 會計年度 2023", "二月 會計年度 2023", "三月 會計年度 2023", "四月 會計年度 2023", "五月 會計年度 2023", "六月 會計年度 2023", "七月 會計年度 2023", "八月 會計年度 2023", "九月 會計年度 2023", "十月 會計年度 2023", "一一月 會計年度 2023", "十二月 會計年度 2023", "一月 會計年度 2024", "二月 會計年度 2024", "三月 會計年度 2024", "四月 會計年度 2024"];
  selectedforecasting_start!: string;
  selectedforecasting_end!: string;
  //表格內容
  forecasting: Forecasting[] = [];
  items: MenuItem[] = [];
  constructor() {
  }
  ngOnInit() {
    this.forecasting = [
      { opportunity: "123", account_name: "123", amount: 123, created_end: "123", section: "123", possibility: 123, type: "123", owner: "123" },
    ];
  }
  visible: boolean = false;
  set_forecasting_range() {
    this.visible = true;
  }
}
