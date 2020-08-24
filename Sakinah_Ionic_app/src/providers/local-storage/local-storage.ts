import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
const USER_ID = 'userId';
const ACCESS_TOKEN = 'accessToken';
const IS_LOGIN_WITH = 'isLoginWith';
const IS_LOGGED_IN = 'isLoggedIn';
const UUID = 'uuid';
@Injectable()
export class LocalStorageProvider {

  constructor(public storage: Storage) {

  }

  setUserID(userID) {
    return this.storage.set(USER_ID, userID);
  }

  getUserID() {
    return this.storage.get(USER_ID);
  }

  setIsLoggedIn(isLoggedIn) {
    return this.storage.set(IS_LOGGED_IN, isLoggedIn);
  }

  getIsLoggedIn() {
    return this.storage.get(IS_LOGGED_IN);
  }

  setAccessToken(token) {
    if (token == null || token == undefined) {
      token = null;
    }
    return this.storage.set(ACCESS_TOKEN, token);
  }

  getAccessToken() {
    return this.storage.get(ACCESS_TOKEN);
  }

  setLoginWith(data) {
    return this.storage.set(IS_LOGIN_WITH, data);
  }
  getLoginWith() {
    return this.storage.get(IS_LOGIN_WITH);
  }

  setUUID(uuid) {
    return this.storage.set(UUID, uuid);
  }
  getUUID() {
    return this.storage.get(UUID);
  }

  clearStorage() {
    this.storage.remove(USER_ID);
    this.storage.remove(ACCESS_TOKEN);
  }

}
