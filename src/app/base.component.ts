import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { Role } from "./models";

// BaseComponent base abstract component class
export abstract class BaseComponent {
  protected myRole = Role.RoleUndefined;

  get isAdmin(): boolean {
    return this.myRole == Role.RoleAdmin || this.myRole == Role.RoleAgentSmith;
  }

  constructor(protected router: Router, protected authService: AuthService) {
    // set const
    this.authService.setConst();

    this.authService.checkLogin().then(
      d => {
        if (!d.status) {
          this.router.navigate(["页面/登录"])
        } else {
          // set role
          this.authService.getRole().subscribe(
            d => {
              this.myRole = d.role;
              this.authService.validateAccessible();
            }
          );
        }
      },
      e => {
        this.router.navigate(["页面/登录"])
      });
  }
}