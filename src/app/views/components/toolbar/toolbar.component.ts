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
        label: 'CRM',
        routerLink: ['/main/dashboard'] ,
      },
      {
        label: '商機',
        routerLink: ['/main/lead'],
      },
      {
        label: '帳戶',
        routerLink: ['/main/account'],
      },
      {
        label: '聯絡人',
        routerLink: ['/main/contact'],
      },
      {
        label: '機會',
        routerLink: ['/main/opportunity'],
      },
      {
        label: '報價',
        routerLink: ['/main/quote'],
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
      {
        label: '顯示面板',
        routerLink: ['/main/display'],
      },
      {
        label: '行事曆',
        routerLink: ['/main/event'],
      },
      // {
      //   label: '報價',
      //   items: [
      //     {
      //       label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
      //       items: [
      //         {
      //           label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
      //           items: [
      //             { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
      //             { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
      //             { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
      //           ]
      //         },
      //         {
      //           label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
      //           items: [
      //             { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
      //           ]
      //         },
      //       ]
      //     },
      //     {
      //       label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
      //       items: [
      //         {
      //           label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
      //           items: [
      //             { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
      //             { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
      //           ]
      //         },
      //         {
      //           label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
      //           items: [
      //             { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
      //           ]
      //         },
      //       ]
      //     }
      //   ]
      // },
      // {
      //   label: 'Get Started',
      //   items: [
      //     {
      //       label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
      //     },
      //     {
      //       label: 'View Source', icon: 'pi pi-fw pi-search', target: '_blank'
      //     }
      //   ]
      // }
    ];
  }
}
