import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { go, highlight } from 'fuzzysort';
import {
  debounceTime as rxDebounceTime,
  filter as rxFilter,
  fromEvent,
  map as rxMap,
  Subject,
  switchMap as rxSwitchMap,
  tap as rxTap,
  takeUntil as rxTakeUntil,
} from 'rxjs';
import { ProductService } from '../../services';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
  selector: 'app-fuzzy-search',
  templateUrl: './fuzzy-search.component.html',
  styleUrls: ['./fuzzy-search.component.scss'],
})
export class FuzzySearchComponent implements OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  @ViewChild('search', { static: false }) searchInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  closeAutocomplete() {
    this.autocompleteTrigger.closePanel();
  }
  public readonly options: Observable<any> = this.initProductData();
  public loading: boolean = false;
  public showError: boolean = false;
  public productSelected: boolean = false;
  filteredOptions: Observable<string[]>;

  constructor(private productService: ProductService) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    fromEvent<InputEvent>(this.searchInput.nativeElement, 'input')
      .pipe(
        rxTakeUntil(this.destroy$),
        rxMap((event: InputEvent) => (event.target as HTMLInputElement).value),
        rxFilter((searchTerm: string) => {
          this.showError = false;
          if (searchTerm.trim().length >= 1) {
            return true;
          }
          this.closeAutocomplete();
          return false;
        }),
        rxDebounceTime(500),
        rxTap(() => (this.loading = true)),
        rxSwitchMap((value) => (this.productService.searchString = value)),
      )
      .subscribe();
  }

  private initProductData(): Observable<any> {
    return this.productService.searchResults().pipe(
      rxMap((searchResults) => {
        var products = go(this.searchInput.nativeElement.value, searchResults.products, { key: 'title' }).map((r) => ({
          title: r.obj['title'],
          html: highlight(r),
          brand: r.obj['brand'],
          price: r.obj['price'],
          image: r.obj['thumbnail'],
          rating: r.obj['rating'],
        }));

        this.loading = false;
        this.showError = products.length === 0;
        return products;
      }),
    );
  }

  public clearInput() {
    this.productSelected = false;
    this.searchInput.nativeElement.value = '';
  }

  public selectProduct() {
    this.productSelected = true;
  }
}
