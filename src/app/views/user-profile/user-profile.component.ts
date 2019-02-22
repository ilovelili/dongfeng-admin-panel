import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from '../../models';
import { UserClient } from '../../clients/user.client';
import { AuthService } from '../../auth/auth.service';
import { ToasterService, ToasterConfig }  from 'angular2-toaster/angular2-toaster';

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
    private authService: AuthService,
    private userClient: UserClient,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.userClient.getUser().
      subscribe(
        d => this.user = d.user,
        e => {
          console.error(e);
          this.authService.logout();
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

  update(form: User) {
    this.user.name = form.name;
    this.userClient.updateUser(this.user).
      subscribe(
        _ => {
          this.toggle();
          this.toasterService.pop('primary', '', '用户信息更新');
        },
        e => {
          console.error(e);          
        },
        () => console.log("user profile component user updating completed")
      );
  }
}
