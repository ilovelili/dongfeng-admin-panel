import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User, Role } from '../../models';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { UserClient } from 'app/clients/user.client';

@Component({  
  templateUrl: 'user-profile.component.html',
  styleUrls: ['../../../scss/vendors/toastr/toastr.scss'],
  // https://stackoverflow.com/questions/37689673/angular2-styling-issues-caused-by-dom-attributes-ngcontent-vs-nghost
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {  
  private showavatar: boolean = true;  
  private allowedit: boolean = false;
  private user: User = new User(0, "", "", "", Role.RoleUndefined);

  toasterconfig: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: true,
      timeout: 5000,
    });

  constructor(    
    private userClient: UserClient,
    private toasterService: ToasterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userClient.getUser().
      subscribe(
        d => {
          this.user = new User(d.id, d.email, d.name, d.photo, d.role)
        },
        e => {          
          console.error(e);
          this.toasterService.pop('error', '', '获取用户信息失败，请重试');
          // this.authService.logout();
        },
        () => console.log("user profile component user loading completed")
      );
  }

  edit() {
    this.allowedit = true;
    this.showavatar = false;
  }

  home() {
    this.router.navigate(['班级信息']);
  }  

  setUser(uri: string[]) {
    this.user.photo = uri[0];
    this.showavatar = true;
    this.allowedit = true;    
  }

  update(form: User) {
    this.user.name = form.name;
    this.userClient.updateUser(this.user).
      subscribe(
        _ => {          
          this.toasterService.pop('primary', '', '用户信息更新');
          window.location.replace(`${environment.host}/班级信息`);
        },
        e => {
          console.error(e);
        },
        () => console.log("user profile component user updating completed")
      );
  }  
}