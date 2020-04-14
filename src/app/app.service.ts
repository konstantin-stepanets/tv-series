import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../shared/http.service';
import { IEpisode } from '../shared/models/model';


@Injectable()
export class AppService {
  constructor(
    private _httpService: HttpService
  ) {}

  public getSeries(): Observable<IEpisode[]> {
    return this._httpService.get('/api/getSeries');
  }
}
