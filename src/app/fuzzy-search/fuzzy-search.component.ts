import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { go, highlight } from 'fuzzysort';
import { debounceTime as rxDebounceTime, filter as rxFilter, fromEvent, map as rxMap, switchMap as rxSwitchMap, tap } from 'rxjs';
import { ProductService } from '../product/product.service';
@Component({
  selector: 'app-fuzzy-search',
  templateUrl: './fuzzy-search.component.html',
  styleUrls: ['./fuzzy-search.component.scss'],
})
export class FuzzySearchComponent implements OnInit {
  // myControl = new FormControl();
  @ViewChild('search', { static: false }) searchInput!: ElementRef;
  // options: string[] = ['One', 'Two', 'Three'];
  public readonly options: Observable<any> = this.initProductData();
  filteredOptions: Observable<string[]>;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    //   this.filteredOptions = this.myControl.valueChanges.pipe(
    //     startWith(''),
    //     map((value: string) => this._filter(value)),
    //   );
  }

  ngAfterViewInit() {
    fromEvent<InputEvent>(this.searchInput.nativeElement, 'input')
      .pipe(
        rxMap((event: InputEvent) => (event.target as HTMLInputElement).value),
        rxFilter((searchTerm: string) => {
          return searchTerm.trim().length >= 1;
        }),
        rxDebounceTime(500),
        rxSwitchMap((value) => (this.productService.searchString = value)),
      )
      .subscribe();
  }

  // private _filter(value: string): string[] {
  //   const filterValue = value.toLowerCase();
  //   console.log('input val',value)
  //   return go(value, this.options).map((r) => highlight(r));
  // }
  private initProductData(): Observable<any> {
    return this.productService.searchResults().pipe(
      rxMap((searchResults) => {
        // console.log('search', searchResults);
        //band
        //price
        //thumbnail
        //rating
        //this.searchInput.nativeElement.value
        // const results = fuzzysort.go('mr', mystuff, {key:'file'})
        // return searchResults.products.map((product) => ({ title: product.title, brand: product.brand }));
        return searchResults.products;
      }),
      tap((values) => console.log('b4: ', values)),
      rxMap((values) => {
        return go('one', values, { key: 'title' }).map((r) => ({
          title: r.obj['title'],
          html: highlight(r),
          brand: r.obj['brand'],
          price: r.obj['price'],
          image: r.obj['thumbnail'],
          rating: r.obj['rating'],
        }));
      }),
      tap((values) => console.log('8ta: ', values)),
    );
  }
}
