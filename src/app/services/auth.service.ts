import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@firebase/auth';
import Person from '../models/person.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { Object } from '../interface/interface.interface';

@Injectable()
export class AuthService {
  private user: Object = {
    person: undefined,
    loggedIn: false,
  };

  private userData = new BehaviorSubject<Object>(this.user);

  constructor(private auth: Auth) {}

  login(email: string, password: string) {
    this.user['loggedIn'] = true;
    this.userData.next(this.user);
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  register(email: string, password: string) {
    this.user['loggedIn'] = true;
    this.userData.next(this.user);
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  getUser(): Observable<Object> {
    return this.userData.asObservable();
  }

  setUser(person: Person) {
    this.user['person'] = person;
    this.userData.next(this.user);
  }

  logout() {
    this.user['person'] = undefined;
    this.user['loggedIn'] = false;
    this.userData.next(this.user);
    return signOut(this.auth);
  }
}
