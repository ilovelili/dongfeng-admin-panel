import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'app/models';
import { environment } from 'environments/environment';
import { UserClient } from 'app/clients';
import { ConstService } from 'app/services';

declare var Authing: any;

@Component({
  templateUrl: 'login.component.html',
  styleUrls: [
    './login.component.scss',
  ],
})
export class LoginComponent {
  email: string = "";
  password: string = "";
  errormsg: string = "";

  constructor(private router: Router, public authService: AuthService, private userClient: UserClient, private constService: ConstService) {
    this.authService.checkLogin().then(
      d => {
        if (d.status) {
          this.router.navigate(["班级信息"]);
        }
      }
    );
  }

  tryLogin(event: KeyboardEvent) {
    if(event.keyCode == 13) {
      this.login();
    }
  }

  clicked = false;
  login() {
    this.clicked = true;
    if (this.email == "") {
      this.setMessage('邮件不能为空白');
      this.clicked = false;
      return;
    }

    if (this.password == "") {
      this.setMessage('密码不能为空白');
      this.clicked = false;
      return;
    }

    this.authService.clearSession();
    let me = this;
    (async function () {
      var auth = await new Authing({
        clientId: environment.auth.clientId,
        timestamp: Math.round((new Date()).getTime() / 1000),
        nonce: Math.ceil(Math.random() * Math.pow(10, 6)),
      });

      await auth.login({
        email: me.email,
        password: me.password,
      }).then((user: Auth) => {
        me.constService.getConsts();
        me.authService.setToken(user);        
        me.userClient.getUser().
          subscribe(
            d => {
              me.router.navigate(["班级信息"]);
            },
            e => {
              console.error(e);
              me.authService.logout();
            },
            () => console.log("login succeeded")
          );
      }).catch(err => {
        if (err.message && err.message.message) {
          me.setMessage(err.message.message);
        } else {
          me.setMessage('登录失败,请重试');
          console.log(err);
        }
        this.clicked = false;
      });
    })();
  }

  setMessage(msg: string) {
    this.errormsg = msg;
    window.setTimeout(() => {
      this.errormsg = '';
    }, 5000);
  }
}