import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable()
export class HttpService {
  serverUrl: string = 'http://localhost:4200';
  requestUrl: string;

  constructor(
    private _http: HttpClient
  ) {}

  get<T>(url: string, params?: any): Observable<any> {
    this.requestUrl = this.serverUrl + url;
    let getParams = {
      params: params
    };
    return this._http.get<T>(this.requestUrl, getParams);
  }
}
