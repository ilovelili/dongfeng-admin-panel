import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'app/models';
import { environment } from 'environments/environment';

declare var Authing: any

@Component({
  templateUrl: 'register.component.html',
  styleUrls: ['./login.component.scss'],
})
export class RegisterComponent {
  private email: string = "";
  private password: string = "";
  private repeatPassword: string = "";
  private name: string = "";
  private errormsg: string = "";

  constructor(private router: Router, private authService: AuthService) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["班级信息"]);
    }
  }

  register(email: string, name: string, password: string) {
    if (email == "" || name == "" || password == "") {
      this.setMessage('注册信息不能为空白');
      return;
    }

    this.authService.clearSession();
    let me = this;
    (async function () {
      var auth = await new Authing({
        clientId: environment.auth.clientID,
        timestamp: Math.round((new Date()).getTime() / 1000),
        nonce: Math.ceil(Math.random() * Math.pow(10, 6)),
      });

      await auth.register({
        email: email,
        password: password,
        name: name,
      }).then((user: Auth) => {
        me.authService.setSession(user);
        me.router.navigate(['班级信息']);
      }).catch(err => {
        if (err.message && err.message.message) {
          me.setMessage(err.message.message);
        } else {
          me.setMessage('注册失败,请重试');
        }
      });
    })();
  }

  checkPassword() {
    if (this.repeatPassword !== this.password) {
      this.errormsg = '密码不一致,请确认';
    } else {
      this.errormsg = '';
    }
  }

  setMessage(msg: string) {
    this.errormsg = msg;
    window.setTimeout(()=> {
      this.errormsg = '';
    }, 5000);
  }
}

