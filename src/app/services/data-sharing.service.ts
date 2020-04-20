import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
// share data between different components
export class DataSharingService extends BaseService {
  private _user: User;
  get user(): User {
    return this._user;
  }
  set user(value: User) {
    this._user = value;
  }
}