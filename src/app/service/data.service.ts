import { Injectable } from '@angular/core';
import { User } from './dto/user';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private userList: Array<User> = new Array();
  private isLoggedIn = false;
  constructor() {}

  userLoggedIn() {
    this.isLoggedIn = true;
  }

  getLoginStatus(): boolean {
    return this.isLoggedIn;
  }

  createUser(user: User): boolean {
    if (!this.userList.find((user) => user.userName === user.userName)) {
      this.userList.push(user);
      return true;
    }
    return false;
  }

  getUserList(): Array<User> {
    return this.userList;
  }

  checkUserAvailability(userName: string, password: string): boolean {
    return this.userList.find(
      (user) => user.userName == userName && user.password == password
    )
      ? true
      : false;
  }
}
