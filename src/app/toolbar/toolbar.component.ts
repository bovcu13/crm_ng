import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {
  showSidebar: any
  items: MenuItem[] = [];
  ngOnInit() {
    this.items = [
      {
        label: '商機',
        routerLink: ['/Lead'],
      },
      {
        label: '帳戶',
        routerLink: ['/Account'],
      },
      {
        label: '聯絡人',
        routerLink: ['/Contact'],
      },
      {
        label: '機會',
        routerLink: ['/Opportunity'],
      },
      {
        label: '報價',
        routerLink: ['/Quote'],
      },
      {
        label: '行銷活動',
        routerLink: ['/Campaign'],
      },
      {
        label: '預測',
        routerLink: ['/Forecasting'],
      },
      {
        label: '報告',
        routerLink: ['/Report'],
      },
      {
        label: '顯示面板',
        routerLink: [''],
      },
      {
        label: '行事曆',
        routerLink: ['/Event'],
      },
    ];
  }
}
