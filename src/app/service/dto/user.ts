export class User {
  firstName: string;
  lastName: string | null;
  userName: string;
  email: string;
  address: string;
  password: string;

  constructor(data: any) {
    this.address = data.address;
    this.email = data.email;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.userName = data.userName;
    this.password = data.password;
  }
}
