import { Injectable } from "@angular/core";
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot
} from "@angular/router";
import { TokenStorageService } from "./token-storage.service";
  
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private authService: TokenStorageService,
        private router: Router) { }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean | Promise<boolean> {
        var data = this.authService.getUser();
        var isAuthenticated = false
        if (data.id > 0){
            isAuthenticated = true
        }
        
        if (isAuthenticated == false) {
            this.router.navigate(['/login']);
        }
        return isAuthenticated;
    }
}
