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
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-fuzzy-search',
  templateUrl: './fuzzy-search.component.html',
  styleUrls: ['./fuzzy-search.component.scss'],
})
export class FuzzySearchComponent implements OnDestroy {
  @ViewChild('search', { static: false }) searchInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;
  private destroy$: Subject<void> = new Subject<void>();

  public readonly options: Observable<any> = this.initProductData();
  public loading: boolean = false;
  public showError: boolean = false;
  public product: Product;

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

  private closeAutocomplete() {
    this.autocompleteTrigger.closePanel();
  }

  private initProductData(): Observable<any> {
    return this.productService.searchResults().pipe(
      rxMap((searchResults) => {
        var products = go(this.searchInput.nativeElement.value, searchResults.products, { key: 'title' }).map((r) => ({
          id: r.obj['id'],
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
    this.product = null;
    this.searchInput.nativeElement.value = '';
    this.closeAutocomplete();
  }

  public selectProduct(product:Product) {
    this.product = product;
  }
}
