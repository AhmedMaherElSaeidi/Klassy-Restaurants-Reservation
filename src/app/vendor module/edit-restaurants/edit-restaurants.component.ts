import { AuthService } from './../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Object } from 'src/app/interface/interface.interface';

@Component({
  selector: 'app-edit-restaurants',
  templateUrl: './edit-restaurants.component.html',
  styleUrls: ['./edit-restaurants.component.css'],
})
export class EditRestaurantsComponent implements OnInit {
  user?: Object;

  constructor(private router: Router, private Auth: AuthService) {}

  authenValidate() {
    if (
      !(
        this.user?.['person'] != undefined &&
        this.user?.['person'].role == 'vendor'
      )
    )
      this.router.navigate(['/', 'home']);
  }
  ngOnInit(): void {
    this.Auth.getUser().subscribe((user) => {
      this.user = user;
    });
  }
}
