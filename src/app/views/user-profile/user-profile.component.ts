import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '../../models';
import { UserClient } from '../../clients/user.client';
import { ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';
import { Router } from '@angular/router';

@Component({
  providers: [User],
  templateUrl: 'user-profile.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
  // https://stackoverflow.com/questions/37689673/angular2-styling-issues-caused-by-dom-attributes-ngcontent-vs-nghost
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {
  private toggled: boolean = false;

  public toasterconfig : ToasterConfig =
    new ToasterConfig({
      tapToDismiss: true,
      timeout: 5000,
    });

  constructor(
    private user: User,    
    private userClient: UserClient,
    private toasterService: ToasterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userClient.getUser().
      subscribe(
        d => this.user = d.user,
        e => {
          console.error(e);
          this.toasterService.pop('error', '', '获取用户信息失败，请重试');
          // this.authService.logout();
        },
        () => console.log("user profile component user loading completed")
      );
  }

  toggle() {
    this.toggled = !this.toggled;
  }

  resolveRole(role: string) {
    if (role == 'sudo') {
      return '超级管理员';
    }    
    if (role == 'admin') {
      return '管理员';
    }
    return '一般用户';
  }

  setUser(uri: string) {
    this.user.avatar = uri;
  }

  update(form: User) {
    this.user.name = form.name;
    this.userClient.updateUser(this.user).
      subscribe(
        _ => {
          this.toggle();
          this.toasterService.pop('primary', '', '用户信息更新');
          this.router.navigate(['/growth-profile']);
        },
        e => {
          console.error(e);          
        },
        () => console.log("user profile component user updating completed")
      );
  }
}
