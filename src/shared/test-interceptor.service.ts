import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { mergeMap } from 'rxjs/operators';
import * as data from '../assets/data.json';

@Injectable()
export class TestInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return of(null)
      .pipe(
        mergeMap(() => {
          /* getting data */
          if (request.url.endsWith('/api/getSeries') && request.method === 'GET') {
            return of(new HttpResponse({ status: 200, body: ((data) as any).default }));
          }
          return next.handle(request);
        })
      );
  }
}
