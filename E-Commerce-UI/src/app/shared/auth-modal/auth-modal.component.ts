import {Component, inject} from '@angular/core';
import {KeycloakService} from "../services/keycloak/keycloak.service";

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent {

  oauth2Service = inject(KeycloakService);

  login() {
    this.oauth2Service.login();
  }

}
