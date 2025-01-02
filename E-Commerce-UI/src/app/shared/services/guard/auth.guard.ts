import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {KeycloakService} from "../keycloak/keycloak.service";

export const authGuard: CanActivateFn = (route, state) => {
  const keycloakService = inject(KeycloakService);
  const router = inject(Router);
  if (keycloakService.keycloak.isTokenExpired()) {
    router.navigate(['login']);
    return false;
  }

  // Check the user's roles
  const roles = keycloakService.keycloak.tokenParsed?.realm_access?.roles || [];
  const requiredRole = route.data['role'];

  if (requiredRole && !roles.includes(requiredRole)) {
    router.navigate(['unauthorized']); // Or redirect to a specific unauthorized page
    return false;
  }
  return true;
};
