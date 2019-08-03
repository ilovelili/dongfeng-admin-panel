import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'app/models';
import { environment } from 'environments/environment';

declare var Authing: any;

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
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
    if (email == "" || password == "") {
      this.setMessage('登录信息不能为空白');
      return;
    }

    this.authService.clearSession();
    let me = this;
    (async function () {
      var auth = await new Authing({
        clientId: environment.auth.clientId,
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
      }).catch(err => {
        if (err.message && err.message.message) {
          me.setMessage(err.message.message);
        } else {
          me.setMessage('登录失败,请重试');
        }
      });
    })();
  }

  // toaster service is wierd on login page
  setMessage(msg: string) {
    this.errormsg = msg;
    window.setTimeout(()=> {
      this.errormsg = '';
    }, 5000);
  }
}
