import {Component, ViewChild} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {Table} from "primeng/table";
import Swal from "sweetalert2";

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent {
  @ViewChild('dt1') dt1!: Table;
//table的死值
  order: any[] = [
    {
      role_name: "大名",
      created_at: "2023-04-15",
    },
    {
      role_name: "小名",
      created_at: "2023-04-15",
    }
  ];
  data: any[] = [
    {
      name: "大名",
      created_at: "2023-04-15",
      data2: [
        {
          role: '權限管理',
          examine: true,
          suspension: false,
          empowerment: true,
        },
      ],
      data3: [
        {
          role: '後台帳號管理',
          read: true,
          create: true,
          update: true,
        },
        {
          role: '角色管理',
          read: true,
          create: false,
          update: false,
        },
      ]
    },
    {
      name: "小名",
      created_at: "2023-04-25",
      data2: [
        {
          role: '權限管理',
          examine: false,
          suspension: true,
          empowerment: false,
        },
      ],
      data3: [
        {
          role: '後台帳號管理',
          read: false,
          create: false,
          update: true,
        },
        {
          role: '角色管理',
          read: true,
          create: false,
          update: true,
        },
      ]
    },
  ]
  roleForm: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
  ) {
    this.roleForm = this.fb.group({
      company_id: [ '' ],
      role_id: [ '' ],
      role_name: [ '', [Validators.required] ],
      permissions: this.fb.group({
        create: [ false ],
        read: [ false ],
        update: [ false ],
      })
    });
  }

  showAlertCancel() {
    Swal.fire({
      title: '取消',
      text: "已取消您的變更！",
      icon: 'error',
      showCancelButton: false,
      showConfirmButton: false,
      reverseButtons: false,
      timer: 1000
    })
  }
}
