import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'app/models';
import { environment } from 'environments/environment';

declare var Authing: any;

@Component({
  templateUrl: 'password.component.html',
  styleUrls: ['./login.component.scss'],
})
export class PasswordComponent {
  private email: string = "";
  private password: string = "";
  private repeatPassword: string = "";
  private verifyCode: string = "";
  private verifyCodeSent: boolean = false;
  private infomsg: string = "";
  private errormsg: string = "";

  constructor(private router: Router, private authService: AuthService) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(["班级信息"]);
    }
  }

  sendVerifyCode() {
    if (this.email == "") {
      this.setErrorMessage('邮箱不能为空白');
      return;
    }

    let me = this;
    (async function () {
      var auth = await new Authing({
        clientId: environment.auth.clientId,
        timestamp: Math.round((new Date()).getTime() / 1000),
        nonce: Math.ceil(Math.random() * Math.pow(10, 6)),
      });

      await auth.sendResetPasswordEmail({
        email: me.email,
      }).then(_ => {
        me.verifyCodeSent = true;
        me.setInfoMessage('验证邮件已经发送,请查看邮箱(如果长时间未收到请检查垃圾邮件)');
      }).catch(err => {
        if (err.message && err.message.message) {
          me.setErrorMessage(err.message.message);
        } else {
          me.setErrorMessage('验证邮件发送失败,请重试');
        }
      });
    })();
  }

  changePassword() {
    if (this.verifyCode == "") {
      this.setErrorMessage('验证码不能为空白');
      return;
    }

    if (this.password == "") {
      this.setErrorMessage('新密码不能为空白');
      return;
    }

    let me = this;
    (async function () {
      var auth = await new Authing({
        clientId: environment.auth.clientId,
        timestamp: Math.round((new Date()).getTime() / 1000),
        nonce: Math.ceil(Math.random() * Math.pow(10, 6)),
      });

      await auth.verifyResetPasswordVerifyCode({
        email: me.email,
        verifyCode: me.verifyCode,
      }).then(async _ => {
        await auth.changePassword({
          email: me.email,
          password: me.password,
          verifyCode: me.verifyCode,
        }).then(_ => {
          me.router.navigate(['/页面/登录']);
        }).catch(err => {
          if (err.message && err.message.message) {
            me.setErrorMessage(err.message.message);
          } else {
            me.setErrorMessage('密码重置失败,请重试');
          }
        });
      }).catch(err => {
        if (err.message && err.message.message) {
          me.setErrorMessage(err.message.message);
        } else {
          me.setErrorMessage('验证邮件发送失败,请重试');
        }
      });
    })();
  }

  setInfoMessage(msg: string) {
    this.infomsg = msg;
    window.setTimeout(() => {
      this.infomsg = '';
    }, 10000);
  }

  // toaster service is wierd on login page
  setErrorMessage(msg: string) {
    this.errormsg = msg;
    window.setTimeout(() => {
      this.errormsg = '';
    }, 5000);
  }

  checkPassword() {
    if (this.repeatPassword !== this.password) {
      this.errormsg = '密码不一致,请确认';
    } else {
      this.errormsg = '';
    }
  }
}
