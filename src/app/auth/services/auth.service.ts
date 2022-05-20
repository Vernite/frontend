import { Injectable } from '@angular/core';
import { ApiService } from 'src/app/_main/services/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apiService: ApiService) {}

  public register({
    email,
    password,
    name,
    surname,
    username,
  }: {
    email: string;
    password: string;
    name: string;
    surname: string;
    username: string;
  }) {
    return this.apiService.post(`/auth/register`, {
      body: { email, password, name, surname, username },
    });
  }

  public login({
    email,
    password,
    remember,
  }: {
    email: string;
    password: string;
    remember: boolean;
  }) {
    return this.apiService.post(`/auth/login`, { body: { email, password, remember } });
  }

  public logout() {
    return this.apiService.post(`/auth/logout`, { body: {} });
  }

  public getMyself() {
    return this.apiService.post(`/auth/me`, { body: {} });
  }

  public resetPassword({ email }: { email: string }) {
    return this.apiService.post(`/auth/password-reset`, { body: { email } });
  }

  public setNewPassword({ email, password }: { email: string; password: string }) {
    return this.apiService.post(`/auth/set-new-password`, { body: { email, password } });
  }
}
