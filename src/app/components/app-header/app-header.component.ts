import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User, Notification, Notifications } from '../../models';
import { UserClient } from '../../clients/user.client';
import { NotificationClient } from '../../clients/notification.client';
import { environment } from 'environments/environment';

interface BranchInfo {
  name: string,
  link: string,
  branch_name: string,
  branch_link: string,
}

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  providers: [User, Notifications],
})
export class AppHeaderComponent implements OnInit {
  private broadcasts: Notification[];
  private notifications: Notification[];
  private user: User

  private current_name = "";
  private branch_name = "";
  private current_link = "";
  private branch_link = "";

  constructor(
    private authService: AuthService,
    private userClient: UserClient,
    private notificationClient: NotificationClient
  ) {
    this.user = new User();
    this.notifications = [];
    this.broadcasts = [];
    let branch = this.resolveBranchInfo();
    this.current_name = branch.name;
    this.current_link = branch.link;
    this.branch_name = branch.branch_name;
    this.branch_link = branch.branch_link;
  }

  ngOnInit() {
    this.userClient.getUser().
      subscribe(
        d => this.user = d.user,
        e => {
          console.error(e);
          this.authService.logout();
        },
        () => console.log("app header component user loading completed")
      );

    this.notificationClient.getNotifications().
      subscribe(
        // https://stackoverflow.com/questions/43367692/typescript-method-on-class-undefined
        d => {
          if (d.notifications && d.notifications.length) {
            d.notifications.forEach(n => {
              // agentsmith
              if (n.custom_code === 'N7001') {
                this.broadcasts.push(new Notification(n.id, n.user_id, n.custom_code, n.category, n.category_id, n.details, n.link, n.time));
              } else {
                this.notifications.push(new Notification(n.id, n.user_id, n.custom_code, n.category, n.category_id, n.details, n.link, n.time));
              }
            });
          }
        },
        e => {
          console.error(e);
          this.authService.logout();
        },
        () => console.log("app header component notification loading completed")
      );
  }

  logout(e: Event) {
    e.preventDefault();
    this.authService.logout();
  }

  updateNotification(ids: number[], agentsmith: boolean = false) {
    this.notificationClient.updateNotifications(ids).
      subscribe(
        _ => {
          if (agentsmith) {
            this.broadcasts = this.broadcasts.filter(b => !ids.includes(b.id));
          } else {
            this.notifications = this.notifications.filter(n => !ids.includes(n.id));
          }
        },
        e => console.error(e),
        () => console.log("app header component notification updating completed")
      );
  }

  get notificationids(): number[] {
    return this.notifications.map(n => n.id);
  }

  get broadcastids(): number[] {
    return this.broadcasts.map(b => b.id);
  }

  stopPropagation(e: Event) {
    e.stopPropagation();
  }

  resolveBranchInfo(): BranchInfo {
    let host = window.location.host
    if (environment.lincang.indexOf(host) > 0) {
      return {
        name: '临仓部',
        link: environment.lincang,
        branch_name: '钟楼部',
        branch_link: environment.zhonglou,
      }
    }

    return {
      name: '钟楼部',
      link: environment.zhonglou,
      branch_name: '临仓部',
      branch_link: environment.lincang,
    }
  }
}