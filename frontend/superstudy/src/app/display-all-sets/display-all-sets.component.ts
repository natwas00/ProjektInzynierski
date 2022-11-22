import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FlashcardsService } from '../_services/flashcards.service';

@Component({
  selector: 'app-display-all-sets',
  templateUrl: './display-all-sets.component.html',
  styleUrls: ['./display-all-sets.component.scss'],
})
export class DisplayAllSetsComponent implements OnInit, OnDestroy {
  public allSets = [];
  public filteredSets = [];
  public filterOption = '';
  public isFiltered = false;
  currentIndex = -1;
  title = '';

  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];

  public getAllSetsSubscription;

  constructor(
    private flashcardsService: FlashcardsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.retrieveSets();
  }

  ngOnDestroy(): void {
    this.getAllSetsSubscription?.unsubscribe();
  }

  getAllSets() {
    this.isFiltered = false;
    this.getAllSetsSubscription = this.flashcardsService
      .getAllSets()
      .subscribe((response) => {
        console.log(response);
        this.allSets = response.sets;
      });
  }

  navigateToSet(id) {
    this.router.navigate([`set-menu/${id}`]);
  }

  moveToEdit(id) {
    this.router.navigate([`set/${id}`]);
  }

  isSuperStudySet(points: number) {
    if (points == 0) {
      return false;
    } else {
      return true;
    }
  }

  displaySuperStudy() {
    const result = this.allSets.filter((obj) => {
      return obj.points !== 0;
    });
    console.log(result);
    this.allSets = result;
  }

  displayClassSets() {
    const result = this.allSets.filter((obj) => {
      return obj.classId !== null;
    });
    console.log(result);
    this.allSets = result;
  }

  displayMySets() {
    const result = this.allSets.filter((obj) => {
      return obj.points === 0;
    });
    console.log(result);
    this.allSets = result;
  }

  filterSets(option: String) {
    this.isFiltered = true;
    if (option === 'SuperStudy') {
      this.displaySuperStudy();
    }
    if (option === 'Zestawy klasy') {
      this.displayClassSets();
    }
    if (option === 'Moje zestawy') {
      this.displayMySets();
    }
  }

  getRequestParams(searchTitle: string, page: number, pageSize: number): any {
    // tslint:disable-next-line:prefer-const
    let params: any = {};

    if (searchTitle) {
      params[`title`] = searchTitle;
    }

    if (page) {
      params[`page`] = page - 1;
    }

    if (pageSize) {
      params[`size`] = pageSize;
    }

    return params;
  }

  retrieveSets(): void {
    const params = this.getRequestParams(this.title, this.page, this.pageSize);

    this.flashcardsService.getAllSets(params).subscribe(
      (response) => {
        const { sets, totalItems } = response;
        this.allSets = sets;
        this.count = totalItems;
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.retrieveSets();
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.retrieveSets();
  }
}
