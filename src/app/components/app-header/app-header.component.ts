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
        e => {
          console.error(e);
          // this.authService.logout();
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
          // this.authService.logout();
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
}
