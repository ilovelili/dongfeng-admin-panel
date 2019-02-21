import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User, Notification, Notifications } from '../../models';
import { UserClient } from '../../clients/user.client';
import { NotificationClient } from '../../clients/notification.client';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  providers: [User, Notifications],
})
export class AppHeaderComponent implements OnInit {
  private broadcasts: Notification[];
  private notifications: Notification[];
  private user: User
  constructor(
    private authService: AuthService,
    private userClient: UserClient,
    private notificationClient: NotificationClient
  ) {
    this.user = new User();
    this.notifications = [];
    this.broadcasts = [];
  }

  ngOnInit() {
    this.userClient.getUser().
      subscribe(
        d => this.user = d.user,
        e => console.error(e),
        () => console.log("app header component user loading completed")
      );

    this.notificationClient.getNotifications().
      subscribe(
        // https://stackoverflow.com/questions/43367692/typescript-method-on-class-undefined
        d => {
          d.notifications.forEach(n => {
            // agentsmith
            if (n.custom_code === 'N7001') {
              this.broadcasts.push(new Notification(n.id, n.user_id, n.custom_code, n.category, n.category_id, n.details, n.link, n.time));
            } else {
              this.notifications.push(new Notification(n.id, n.user_id, n.custom_code, n.category, n.category_id, n.details, n.link, n.time));
            }
          });
        },
        e => console.error(e),
        () => console.log("app header component notification loading completed")
      );
  }

  logout() {
    this.authService.logout();
  }
}
