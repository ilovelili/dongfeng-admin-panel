import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { User, Role } from '../../models';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';
import { Router } from '@angular/router';
import { environment } from 'environments/environment';
import { UserClient } from 'app/clients/user.client';

@Component({  
  templateUrl: 'user-profile.component.html',
  styleUrls: [
    '../../../scss/vendors/toastr/toastr.scss',
    'user-profile.component.scss',
  ],
  // https://stackoverflow.com/questions/37689673/angular2-styling-issues-caused-by-dom-attributes-ngcontent-vs-nghost
  encapsulation: ViewEncapsulation.None,
})
export class UserProfileComponent implements OnInit {    
  allowedit: boolean = false;
  user: User = new User(0, "", "", "", Role.RoleUndefined);

  toasterconfig: ToasterConfig =
    new ToasterConfig({
      tapToDismiss: true,
      timeout: 5000,
    });

  constructor(    
    private userClient: UserClient,
    private toasterService: ToasterService,
    private router: Router,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.userClient.getUser().
      subscribe(
        d => {
          this.user = new User(d.id, d.email, d.name, d.photo, d.role)
        },
        e => {
          this.toasterService.pop('error', '', '获取用户信息失败，请重试');          
        },
        () => console.log("user profile component user loading completed")
      );
  }

  edit() {
    this.allowedit = true;    
  }

  home() {
    this.router.navigate(['班级信息']);
  }

  openImageUpload() {
    this.elementRef.nativeElement.querySelector('#image-upload').click();
  }

  setUser(uri: string[]) {
    this.user.photo = uri[0];    
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