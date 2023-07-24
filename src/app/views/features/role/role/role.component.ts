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
  roleForm: UntypedFormGroup;
  constructor(
    private fb: UntypedFormBuilder,
  ) {
    this.roleForm = this.fb.group({
      company_id: [ '' ],
      role_id: [ '' ],
      role_name: [ '', [Validators.required] ],
      permissions: this.fb.group({
        examine: [ false ],
        suspension: [ false ],
        empowerment: [ false ],
        admin_create: [ false ],
        admin_read: [ false ],
        admin_update: [ false ],
        role_create: [ false ],
        role_read: [ false ],
        role_update: [ false ],
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
