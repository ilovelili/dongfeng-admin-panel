import { Router } from "@angular/router";
import { AuthService } from "./auth/auth.service";

// BaseComponent base abstract component class
export abstract class BaseComponent {
  constructor(protected router: Router, protected authService: AuthService, protected omitAuth: boolean = false) {
    if (!omitAuth && !authService.isLoggedIn) {
      this.router.navigate(['pages/login']);
    }
  }
}