import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { Role } from "./models";

// BaseComponent base abstract component class
export abstract class BaseComponent {
  protected myRole = Role.RoleUndefined;

  get isAdmin(): boolean {
    return this.myRole == Role.RoleAdmin || this.myRole == Role.RoleAgentSmith;
  }
  
  constructor(protected router: Router, protected authService: AuthService, protected omitAuth: boolean = false) {
    // set const
    this.authService.setConst();

    // set role
    this.authService.getRole().subscribe(
      d => {
        this.myRole = d.role;        
      });


    if (!omitAuth && !authService.isLoggedIn) {
      this.router.navigate(["页面/登录"]);
      return;
    }

    if (!omitAuth) {
      this.authService.validateAccessible();        
    }
  }  
}