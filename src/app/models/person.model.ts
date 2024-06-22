import { Object } from "../interface/interface.interface";

export default class Person {
  pid?: string;
  name?: string;
  email?: string;
  gender?: string;
  role?: string;

  constructor(
    pid?: string,
    name?: string,
    email?: string,
    gender?: string,
    role?: string,
  ) {
    this.pid = pid;
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.role = role;
  }

  get personObject(): Object {
    let person: Object = {
      pid: this.pid,
      name: this.name,
      email: this.email,
      gender: this.gender,
      role: this.role,
    };

    return person;
  }
}
