import {Injectable, PipeTransform, Inject} from '@angular/core';

import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import {debounceTime, delay, switchMap, tap} from 'rxjs/operators';
import {SortColumn, SortDirection} from './sortable.directive';
import { AppService } from 'src/app/app.service';
import { AppStore } from 'src/app/store/app.store';
import { Store } from 'redux';
import { AppState, IvrServiceDto } from 'src/app/store/app.state';

interface SearchResult {
  users: string[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(users: string[], column: SortColumn, direction: string): string[] {
  if (direction === '' || column === '') {
    return users;
  } else {
    return [].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(serviceid: string, term: string, _pipe: PipeTransform) {
  return serviceid.toLowerCase().includes(term.toLowerCase());  
   
}

@Injectable()
export class UploadivrcontentsService {
  private users = [];
 
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _users$ = new BehaviorSubject<string[]>([]);
  private _total$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 5,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private appservice : AppService, @Inject(AppStore) public store : Store<AppState>) {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._users$.next(result.users);
      this._total$.next(result.total);
    });

    this._search$.next();

    
    try {
      this.store.subscribe(() => this.updateState());

      this.appservice.getAllServiceId();
      
    } catch (error) {
      throw new Error("Authguard::contructor Exception :" + error);
      
    }
  }

updateState()
{
  try {
    this.users = this.store.getState().ivrservices;
    this._search$.next();

  } catch (error) {
   throw new Error("ManagecpuserComponent::updateState Exception :" + error);
  }
}

  get users$() { 
    return this._users$.asObservable(); 
  }
  get total$() { return this._total$.asObservable(); }
  get loading$() { return this._loading$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    // 1. sort
    let lusers = sort(this.users, sortColumn, sortDirection);

    // 2. filter
    lusers = lusers.filter(user => matches(user, searchTerm, this.pipe));
    const total = lusers.length;

    // 3. paginate
    lusers = lusers.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({users: lusers, total});
  }
}

