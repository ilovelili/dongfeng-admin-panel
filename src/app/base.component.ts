import { Router } from "@angular/router";
import { AuthService } from "./services/auth.service";

// BaseComponent base abstract component class
export abstract class BaseComponent {
  constructor(protected router: Router, protected authService: AuthService, protected omitAuth: boolean = false) {
    if (!omitAuth && !authService.isLoggedIn) {
      this.router.navigate(["页面/登录"]);
      return;
    }

    if (!omitAuth) {
      this.authService.validateAccessible();        
    }
  }  
}