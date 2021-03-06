import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User, Notification, Role } from '../../models';
import { NotificationClient } from '../../clients/notification.client';
import { environment } from 'environments/environment';
import { SessionFactory, SessionConfig } from 'app/sessionstorage/sessionfactory.service';
import { ClassClient, UserClient } from 'app/clients';
import { Router } from '@angular/router';
import { DataSharingService } from 'app/services';

interface BranchInfo {
  name: string,
  link: string,
  branch_name: string,
  branch_link: string,
}

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent implements OnInit {
  broadcasts: Notification[];
  notifications: Notification[];
  user: User = new User(0, "", "", "", Role.RoleUndefined);

  current_name = "";
  branch_name = "";
  current_link = "";
  branch_link = "";
  years: string[] = [];
  current_year: string = "";
  key_year = "year";

  namespace: string = 'dongfeng';
  sessionFactory = new SessionFactory(new SessionConfig(this.namespace, SessionFactory.DRIVERS.LOCAL));

  constructor(
    private authService: AuthService,
    private userClient: UserClient,
    private notificationClient: NotificationClient,
    private classClient: ClassClient,
    private dataSharingService: DataSharingService,
  ) {
    this.notifications = [];
    this.broadcasts = [];
    let branch = this.resolveBranchInfo();
    this.current_name = branch.name;
    this.current_link = branch.link;
    this.branch_name = branch.branch_name;
    this.branch_link = branch.branch_link;
  }

  ngOnInit() {
    this.authService.checkLogin().then(
      d => {
        if (d.status) {          
          this.authService.getUser().
            subscribe(
              d => {
                this.user = new User(d.id, d.email, d.name, d.photo, d.role);
                this.dataSharingService.user = this.user;
              },
              e => console.error(e),
              () => console.log("app header component user loading completed")
            );          

          this.notificationClient.getNotifications().
            subscribe(
              // https://stackoverflow.com/questions/43367692/typescript-method-on-class-undefined
              d => {
                d.forEach(n => {
                  // agentsmith
                  if (n.custom_code === 'N5001') {
                    this.broadcasts.push(new Notification(n.id, n.user, n.custom_code, n.category, n.details, n.link, n.created_at));
                  } else {
                    this.notifications.push(new Notification(n.id, n.user, n.custom_code, n.category, n.details, n.link, n.created_at));
                  }
                });
              },
              e => console.error(e),
              () => console.log("app header component notification loading completed")
            );

          this.classClient.getClasses().
            subscribe(
              d => {
                d.map(c => {
                  if (!this.years.includes(c.year)) {
                    this.years.push(c.year)
                  }
                });

                this.years.forEach(y => {
                  if (this.current_year < y) {
                    this.current_year = y;
                  }
                })

                this.setYear(this.current_year);
              },
              e => {
                console.error(e);
                this.authService.logout();
              },
              () => console.log("app header component notification loading completed")
            );
        }
      }
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

  setYear(year: string, e?: Event) {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.sessionFactory.set(this.key_year, year);
  }
}