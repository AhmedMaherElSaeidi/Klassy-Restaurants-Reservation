import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { Object } from '../interface/interface.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  faPlay = faPlay;
  user?: Object;

  constructor(public Auth: AuthService) {}

  validAuth(rolename: string, del: boolean): boolean {
    let bool: boolean;
    try {
      if (del) {
        bool =
          this.user?.['loggedIn'] && this.user?.['person'].role === rolename;
      } else {
        bool = this.user?.['loggedIn'];
      }
    } catch (error) {
      // implementation
    }

    return bool!;
  }

  ngOnInit(): void {
    this.Auth.getUser().subscribe((user) => {
      this.user = user;
    });
  }
}
