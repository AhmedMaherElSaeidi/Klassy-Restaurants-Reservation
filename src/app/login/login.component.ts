import { Router } from '@angular/router';
import Customer from '../models/customer.model';
import Vendor from 'src/app/models/vendor.model';
import { Component, OnInit } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
import { AuthService } from './../services/auth.service';
import { DocumentSnapshot } from '@angular/fire/firestore';
import { ServerService } from './../services/server.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { faUser, faLock, faEye } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  faUser = faUser;
  faLock = faLock;
  faEye = faEye;
  loginform?: FormGroup;
  passorwd_hidden: boolean = true;

  constructor(
    private Auth: AuthService,
    private db: ServerService,
    private route: Router
  ) {}

  showPassword() {
    this.passorwd_hidden = !this.passorwd_hidden;
  }

  login() {
    this.Auth.login(this.loginform?.value.email, this.loginform?.value.password)
      .then((user: UserCredential) => {
        this.db
          .getRecord(user.user.uid, 'users')
          .then((data: DocumentSnapshot) => {
            let person;
            if (data?.data()?.['role'] === 'vendor') {
              person = new Vendor();
              person.constructObject(
                user.user.uid,
                data?.data()?.['name'],
                data?.data()?.['email'],
                data?.data()?.['gender'],
                data?.data()?.['role'],
                data?.data()?.['restaurants']
              );
            } else {
              person = new Customer();
              person.constructObject(
                user.user.uid,
                data?.data()?.['name'],
                data?.data()?.['email'],
                data?.data()?.['gender'],
                data?.data()?.['role']
              );
            }

            this.Auth.setUser(person);
          });
        this.route.navigate(['/', 'home']);
      })
      .catch(() => {
        alert("User credentials doesn't match.");
      });
  }

  ngOnInit(): void {
    this.loginform = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
    });
  }
}
