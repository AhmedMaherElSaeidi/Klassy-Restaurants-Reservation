import { ServerService } from './../services/server.service';
import { UserCredential } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  faUser,
  faLock,
  faMailBulk,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import Vendor from '../models/vendor.model';
import Customer from '../models/customer.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  faEye = faEye;
  faUser = faUser;
  faLock = faLock;
  faMailBulk = faMailBulk;

  registerform?: FormGroup;
  password_match: boolean = false;
  passorwd_hidden: boolean = true;
  formvalid: boolean = this.registerform?.valid! && this.password_match!;

  constructor(
    private Auth: AuthService,
    private db: ServerService,
    private route: Router
  ) {}

  showPassword() {
    this.passorwd_hidden = !this.passorwd_hidden;
  }

  passwordMatch() {
    this.password_match =
      this.registerform?.value.password === this.registerform?.value.repassword
        ? true
        : false;
  }

  not(boolean: boolean): boolean {
    return !boolean;
  }

  register() {
    this.Auth.register(
      this.registerform?.value.email,
      this.registerform?.value.password
    )
      .then((user: UserCredential) => {
        let person;
        if(this.registerform?.value.role === 'vendor'){
          person = new Vendor(
            user.user.uid,
            this.registerform?.value.name,
            this.registerform?.value.email,
            this.registerform?.value.gender,
            this.registerform?.value.role,
            0
          );
        }else{
          person = new Customer(
            user.user.uid,
            this.registerform?.value.name,
            this.registerform?.value.email,
            this.registerform?.value.gender,
            this.registerform?.value.role
          );
        }
        
        this.Auth.setUser(person);
        this.db.addNewRecordWithID(user.user.uid, person.personObject, 'users');
        this.route.navigate(['/', 'home']);
      })
      .catch((reason: any) => alert('Email already exists.'));
  }

  ngOnInit(): void {
    this.registerform = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      repassword: new FormControl(null, [Validators.required]),
      gender: new FormControl('male', []),
      role: new FormControl('customer', []),
    });
  }
}
