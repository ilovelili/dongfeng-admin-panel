import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'app/models';

declare var Authing: any
const CLIENT_ID: string = '5d3d48476692ea2c7cf68ff7';

@Component({
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  private email: string = "";
  private password: string = "";
  private errormsg: string = "";

  constructor(private router: Router, private authService: AuthService) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["班级信息"]);
    }
  }

  login(email: string, password: string) {
    this.authService.clearSession();
    let me = this;
    (async function () {
      var auth = await new Authing({
        clientId: CLIENT_ID,
        timestamp: Math.round((new Date()).getTime() / 1000),
        nonce: Math.ceil(Math.random() * Math.pow(10, 6)),
        enableFetchPhone: true // 启用获取手机号
      });

      await auth.login({
        email: email,
        password: password,
      }).then((user: Auth) => {
        me.authService.setSession(user);
        me.router.navigate(['班级信息']);
      }).catch(err => me.errormsg = err);
    })();
  }
}
