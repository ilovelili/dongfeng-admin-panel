import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';
import { UserClient } from '../../clients/user.client';
import { Empty } from '../../models/empty';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  providers: [User],
})
export class AppHeaderComponent implements OnInit {
  constructor(private user: User, private authService: AuthService, private userClient: UserClient) {
  }

  ngOnInit() {
    this.userClient.getUser().
      subscribe(
        d => this.user = d.user,
        e => console.error(e),
        () => console.log("app header component loading completed")
      );
  }

  logout() {
    this.authService.logout();
  }
}
