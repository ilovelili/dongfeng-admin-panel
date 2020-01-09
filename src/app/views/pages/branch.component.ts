import { Component } from '@angular/core';
import { environment } from 'environments/environment';

@Component({
    templateUrl: 'branch.component.html'
})
export class BranchComponent {
    branch(branch: number) {
        window.location.replace(`${this.resolveBaseUrl(branch)}/班级信息`);
    }

    resolveBaseUrl(branch: number): string {
        let localhost = window.location.host.indexOf('localhost') > 0;
        if (localhost) {
            return window.location.host;
        }

        if (branch == 1) {
            return environment.zhonglou;
        }

        return environment.lincang;
    }

}