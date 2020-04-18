import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ViewComponent } from '../base/view.component';
import { UserClient } from 'app/clients';
import { ToasterService } from 'angular2-toaster';
import { AuthService } from 'app/services/auth.service';
import { User, Constant, Role } from 'app/models';

@Component({
  templateUrl: './user-admin.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    './user-admin.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class UserAdminComponent extends ViewComponent implements OnInit {
  users: User[];
  currentEditId: number;

  constructor(private userClient: UserClient, protected router: Router, protected authService: AuthService, protected activatedRoute: ActivatedRoute, protected toasterService: ToasterService) {
    super(router, authService, activatedRoute, toasterService);
  }

  ngOnInit(): void {
    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          this.getUsers();
        }
      },
      e => {
        this.router.navigate(["页面/登录"])
      });
  }

  getUsers() {
    this.loading = true;
    this.userClient.getUsers().
      subscribe(
        d => {
          this.loading = false;
          if (!d) {
            this.LogWarning("没有用户信息");
          } else {
            this.users = d;
            this.items = d.map(u => new User(
              u.id,
              u.email,
              u.name,
              u.photo,
              u.role
            ));
          }
        },
        e => this.LogError(e, '获取用户信息失败，请重试'),
        () => this.LogComplete('user admin component users loading completed')
      );
  }

  edit(user: User) {
    this.currentEditId = user.id;
  }

  get allRoles() {
    return Role.AllRoles;
  }

  resolveRole(role: number): string {
    return Constant.Instance().roles[role];
  }

  setRole(user: User, role: number, event: Event) {
    event.preventDefault();
    user.role = role;
    this.loading = true;
    this.userClient.updateUser(user).
      subscribe(
        d => {
          this.loading = false;
          if (!d) {
            this.LogSuccess("用户权限更新");
            this.currentEditId = 0;
          }
        },
        e => this.LogError(e, '用户权限更新失败，请重试'),
        () => this.LogComplete('user admin component role update completed')
      );
  }
}
