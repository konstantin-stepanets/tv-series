import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})

export class PaginatorComponent implements OnInit, OnChanges {
  @Input() amount: number;
  @Input() currentPage: number;
  @Input() resultsPerPage: number;
  @Output() updatedResultsPerPage: EventEmitter<number> = new EventEmitter();
  @Output() updateCurrentPage: EventEmitter<number> = new EventEmitter();
  pages: number[] = [];
  pagesRange: number[] = [5, 10, 25];

  constructor() {}

  createPageRange(): void {
    this.pages = [...Array(this.amount).keys()].map(x => ++x );
  }

  doUpdateCurrentPage(direction: string): void {
    if (direction === 'prev') {
      if (this.currentPage > 1) {
        this.updateCurrentPage.emit(this.currentPage - 1);
      }
    }
    if (direction === 'next') {
      if (this.currentPage < this.amount) {
        this.updateCurrentPage.emit(this.currentPage + 1);
      }
    }
  }

  ngOnInit(): void {
    this.createPageRange();
  }

  ngOnChanges(): void {
    this.createPageRange();
  }
}
