import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { IEpisode, SortDirection } from '../shared/models/model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { takeUntil, distinctUntilChanged, debounceTime } from 'rxjs/internal/operators';
import { componentDestroyed } from '@w11k/ngx-componentdestroyed';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
  seriesForm: FormGroup;
  series: IEpisode[] = [];
  seriesSeparated: IEpisode[][] | IEpisode[] = [];
  originalSeries: IEpisode[] = [];
  sortDirection: SortDirection = {
    name: null,
    released: null
  };
  uniqueGenres: string[] = [];
  uniqueYears: string[] = [];
  resultsPerPage: number = 5;
  currentPage: number = 1;

  constructor(
    private _appService: AppService,
    private _fb: FormBuilder
  ) {}

  getSeries(): void {
    this._appService.getSeries()
      .subscribe(data => {
        if (data.length) {
          this.originalSeries = Object.assign([], data);
          this.updatePages(data);
          let genres: string[] = [];
          let releasedYears: string[] = [];
          data.forEach(row => {
            genres = [...genres, ...row.genres];
            releasedYears.push(row.released.split('.')[2]);
          });
          this.uniqueGenres = [...new Set([...genres])];
          this.uniqueYears = [...new Set([...releasedYears])].sort((a, b) => a > b ? 1 : -1);
        }
      });
  }

  updatePages(data: IEpisode[]): void {
    if (data.length) {
      this.seriesSeparated = data.map((_, i, all) => all.slice(this.resultsPerPage * i, this.resultsPerPage * i + this.resultsPerPage)).filter( x => x.length);
      this.series = this.seriesSeparated[this.currentPage - 1];
    }
  }

  trackByFn(item) {
    return item.id;
  }

  sort(type: string): void {
    this.sortDirection[type] = (!this.sortDirection[type] || this.sortDirection[type] === 'desc') ? 'asc' : 'desc';
    this.applyFilters();
    switch (type) {
      case 'name':
        this.sortDirection.released = null;
        this.seriesSeparated = this.seriesSeparated.flat(1).sort((a, b) => a.name > b.name ? (this.sortDirection.name === 'asc' ? 1 : -1) : (this.sortDirection.name === 'desc' ? 1 : -1));
        this.updatePages(this.seriesSeparated.flat(1));
        break;
      case 'released':
        this.sortDirection.name = null;
        this.seriesSeparated = this.seriesSeparated.flat(1).sort((a, b) => {
          let dateA: number = new Date(`${a.released.split('.')[1]}.${a.released.split('.')[0]}.${a.released.split('.')[2]}`).getTime();
          let dateB: number = new Date(`${b.released.split('.')[1]}.${b.released.split('.')[0]}.${b.released.split('.')[2]}`).getTime();
          return dateA > dateB ? (this.sortDirection.released === 'asc' ? 1 : -1) : (this.sortDirection.released === 'desc' ? 1 : -1);
        });
        this.updatePages(this.seriesSeparated.flat(1));
        break;
    }
  }

  applyFilters(): void {
    let form = this.seriesForm.value;
    if (form.nameControl !== '' && form.genreControl === '' && form.yearControl === '') {
      this.series = this.originalSeries.filter(episode => episode.name.toLowerCase().indexOf(form.nameControl) !== -1);
    } else {
      this.series = this.originalSeries;
    }
    if (form.genreControl !== '' && form.nameControl === '' && form.yearControl === '') {
      this.series = this.originalSeries.filter(episode => episode.genres.includes(form.genreControl));
    }
    if (form.yearControl !== '' && form.genreControl === '' && form.nameControl === '') {
      this.series = this.originalSeries.filter(episode => episode.released.includes(form.yearControl));
    }
    if (form.nameControl !== '' && form.genreControl !== '' && form.yearControl === '') {
      this.series = this.originalSeries.filter(episode => episode.name.toLowerCase().indexOf(form.nameControl) !== -1 && episode.genres.includes(form.genreControl));
    }
    if (form.nameControl !== '' && form.genreControl === '' && form.yearControl !== '') {
      this.series = this.originalSeries.filter(episode => episode.name.toLowerCase().indexOf(form.nameControl) !== -1 && episode.released.includes(form.yearControl));
    }
    if (form.nameControl === '' && form.genreControl !== '' && form.yearControl !== '') {
      this.series = this.originalSeries.filter(episode => episode.genres.includes(form.genreControl) && episode.released.includes(form.yearControl));
    }
    if (form.nameControl !== '' && form.genreControl !== '' && form.yearControl !== '') {
      this.series = this.originalSeries.filter(episode =>
        episode.name.toLowerCase().indexOf(form.nameControl) !== -1 &&
        episode.genres.includes(form.genreControl) &&
        episode.released.includes(form.yearControl)
      );
    }
    this.updatePages(this.series);
  }

  updatedResultsPerPage(amount: number): void {
    this.resultsPerPage = amount;
    this.updatePages(this.seriesSeparated.flat(1));
  }

  updateCurrentPage(currentPage: number): void {
    this.currentPage = currentPage;
    this.updatePages(this.seriesSeparated.flat(1));
  }

  ngOnInit(): void {
    this.seriesForm = this._fb.group({
      'nameControl': new FormControl(''),
      'genreControl': new FormControl(''),
      'yearControl': new FormControl('')
    });

    this.seriesForm.valueChanges
      .pipe(
        debounceTime(300),
        takeUntil(componentDestroyed(this)),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.applyFilters();
      });

    this.getSeries();
  }

  ngOnDestroy(): void {}
}
