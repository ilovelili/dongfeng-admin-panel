import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Auth } from 'app/models';
import { UserClient } from 'app/clients';

export abstract class OpenIdComponent {
    protected openId: string;

    constructor(protected router: Router, protected authService: AuthService, protected userClient: UserClient) {
        if (this.authService.isLoggedIn) {
            this.router.navigate(["班级信息"]);
        }
    }

    protected openIdCallback() {
        const code = parseInt(this.getQueryString('code'));
        if (code !== 200) {
            // return error message
            console.error(this.getQueryString('message'));
            window.alert('登录失败,请重试');
            this.router.navigate(["/页面/登录"]);
        }

        const userInfo: Auth = JSON.parse(this.getQueryString('data'));
        if (!userInfo.token) {
            window.alert(`登录失败,请重试`);
            this.router.navigate(["/页面/登录"]);
        }

        if (!userInfo.email) {
            window.alert(`您的${this.openId}帐号没有绑定邮箱,系统将生成临时邮箱以完成登录`);
            userInfo.email = `${userInfo._id}@dongfeng.cn`;
        }

        this.authService.setSession(userInfo);
        this.userClient.getUser().
            subscribe(
                _ => {
                    this.router.navigate(["/班级信息"]);
                },
                e => console.error(e),
                () => console.log("login succeeded")
            );
    }

    getQueryString(name: string): string {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        }
        return "";
    }
}

@Component({
    templateUrl: 'openid.component.html',
})
export class OpenIdDingTalkComponent extends OpenIdComponent {
    constructor(protected router: Router, protected authService: AuthService, protected userClient: UserClient) {
        super(router, authService, userClient);
        this.openIdCallback();
    }

    openId: string = "钉钉";
}