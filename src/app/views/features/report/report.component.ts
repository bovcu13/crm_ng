import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api/menuitem';

interface Report {
  report_name: string;
  description: string;
  folder: string;
  founder: string;
  created_at: any;
  subscription: any;
}
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent {
  report: Report[] = [];
  items: MenuItem[] = [];
  ngOnInit() {
    this.report = [
      { report_name: "123", description: "123", folder: "123", founder: "123", created_at: "123", subscription: "123" },
    ];
    this.items = [
      {
        label: '執行',
      },
      {
        label: '編輯',
      },
      {
        label: '刪除',
      },
      {
        label: '新增至顯示面板',
      },
      {
        label: '訂閱',
      }
    ]
  }
  visible: boolean = false;
  add_report(){
    this.visible = true;
  }
  visible2: boolean = false;
  add_folder(){
    this.visible2 = true;
  }
}
