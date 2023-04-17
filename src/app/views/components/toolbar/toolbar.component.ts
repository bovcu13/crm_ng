import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  showSidebar: any
  items: MenuItem[] = [];
  account: MenuItem[] = [];

  ngOnInit() {
    this.items = [
      {
        label: '首頁',
        routerLink: ['/main/dashboard'],
      },
      {
        label: '線索',
        routerLink: ['/main/lead'],
      },
      {
        label: '帳戶',
        // routerLink: ['/main/account'],
        items: [
          {
            label: '帳戶',
            routerLink: ['/main/account'],
          },
          {
            label: '聯絡人',
            routerLink: ['/main/contact'],
          },
        ]
      },
      {
        label: '商機',
        routerLink: ['/main/opportunity'],
      },
      {
        label: '產品',
        routerLink: ['/main/product'],
      },
      {
        label: '報價',
        routerLink: ['/main/quote'],
      },
      {
        label: '訂單',
        routerLink: ['/main/order'],
      },
      {
        label: '行銷活動',
        routerLink: ['/main/campaign'],
      },
      {
        label: '預測',
        routerLink: ['/main/forecasting'],
      },
      {
        label: '報告',
        routerLink: ['/main/report'],
      },
      // {
      //   label: '顯示面板',
      //   routerLink: ['/main/display'],
      // },
    ];
    this.account = [
      {
        icon: "pi pi-user",
        label: '個人資料',
      },
      {
        icon: "pi pi-cog",
        label: '設定',
      },
      {
        icon: "pi pi-sign-out",
        label: '登出',
        routerLink: ['/login'],
      }];
  }
}
