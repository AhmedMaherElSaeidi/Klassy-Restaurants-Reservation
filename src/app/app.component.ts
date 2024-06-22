import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Component, OnInit } from '@angular/core';
import {
  faInstagramSquare,
  faFacebookSquare,
  faTwitterSquare,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { faHome, faCog, faSignOutAlt, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import { Object } from './interface/interface.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  faInstagramSquare = faInstagramSquare;
  faFacebookSquare = faFacebookSquare;
  faTwitterSquare = faTwitterSquare;
  faLinkedinIn = faLinkedinIn;
  faSignOutAlt = faSignOutAlt;
  faSignInAlt = faSignInAlt;
  faHome = faHome;
  faCog = faCog

  user?: Object;

  constructor(public Auth: AuthService, private route : Router) {}

  validAuth(rolename: string, del: boolean): boolean {
    let bool : boolean;    
    try {
      if (del) {
        bool = this.user?.['loggedIn'] && this.user?.['person'].role === rolename;
      } else {
        bool = this.user?.['loggedIn'];
      }
    } catch (error) {
      // implementation
    }

    return bool!;
  }

  logout() {
    this.Auth.logout();
    this.route.navigate(['/', 'login']);
  }

  ngOnInit(): void {
    this.Auth.getUser().subscribe((user) => {
      this.user = user;
    });
  }
}
