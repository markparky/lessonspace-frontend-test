import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable, switchMap as rxSwitchMap } from 'rxjs';

const BASE_URL = 'https://dummyjson.com/products/';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly searchString$ = new Subject<string>();

  constructor(private httpClient: HttpClient) {}

  public set searchString(searchString: string) {
    this.searchString$.next(searchString);
  }

  public get getSearchString(): Observable<string> {
    return this.searchString$.asObservable();
  }

  searchResults(): Observable<any> {
    return this.getSearchString.pipe(rxSwitchMap((searchString) => this.httpClient.get(`${BASE_URL}search?q=${searchString}`)));
  }
}
