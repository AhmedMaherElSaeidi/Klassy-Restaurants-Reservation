import Person from './person.model';

export default class Customer extends Person {
  constructor(
    pid?: string,
    name?: string,
    email?: string,
    gender?: string,
    role?: string
  ) {
    super(pid, name, email, gender, role);
  }

  constructObject(
    pid: string,
    name: string,
    email: string,
    gender: string,
    role: string
  ): void {
    this.pid = pid;
    this.name = name;
    this.email = email;
    this.gender = gender;
    this.role = role;
  }
}
