import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'app/models';
import { environment } from 'environments/environment';

declare var Authing: any;

@Component({
  templateUrl: 'openid.component.html',
})
export class OpenIdDingTalkComponent {
  constructor(private router: Router, private authService: AuthService) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["班级信息"]);
    }
  }

  // TODO: verify redirect
  
}
