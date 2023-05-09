import {Component, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import Swal from "sweetalert2";

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
        label: '帳戶',
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
        label: '線索',
        routerLink: ['/main/lead'],
      },
      {
        label: '商機',
        routerLink: ['/main/opportunity'],
      },
      {
        label: '商品/服務',
        routerLink: ['/main/product'],
        },
      {
        label: '報價',
        routerLink: ['/main/quote'],
        },
      {
        label: '契約',
        routerLink: ['/main/contract'],
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
        command: () => {
          sessionStorage.clear();
          Swal.fire({
            title: '登出',
            text: "祝您擁有美好的一天 :)",
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
        },
      }];
  }
}
