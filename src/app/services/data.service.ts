import { salarie } from './../models/salarie';
import {Injectable} from '@angular/core';
import { BehaviorSubject, Observable,throwError } from 'rxjs';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import CircularJSON from 'json-stringify-safe';
@Injectable()
export class DataService {
  private readonly API_URL = 'http://localhost:8080/test';

  constructor (private httpClient: HttpClient) {}

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }

  

   getList(): Observable<any> {
    return this.httpClient
      .get<salarie>(this.API_URL)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  getItem(id): Observable<salarie> {
    return this.httpClient
      .get<salarie>(this.API_URL + '/' + id)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  createSalarie(salarie): Observable<salarie> {
  
    return this.httpClient
      .post<any>(this.API_URL+'/addsalarie', JSON.stringify(salarie), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  updateSalarie(id, salarie): Observable<salarie> {
    debugger

    return this.httpClient
      .put<salarie>(this.API_URL + '/edit/' + id,JSON.stringify(salarie), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  // Delete item by id
  deleteSalarie(id) {
    return this.httpClient
      .delete<salarie>(this.API_URL + '/delete/' + id, this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }
  handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  };

  search(salarie: any): Observable<any> {
  let obj: any = {};
  for (let prop in salarie) {
    if (salarie[prop] !== undefined) {
      switch (typeof salarie[prop]) {
        case 'string':
          if (salarie[prop].trim().length) obj[prop] = salarie[prop];
          break;
        default:
          obj[prop] = salarie[prop] instanceof Date ? salarie[prop].getTime() : salarie[prop];
          break;
      }
    }
  }

  let query = '';
  let iteration = 0;
  if(Object.keys(obj).length > 0) {
    query = '?';
    for (var property in obj) {
      iteration++;
      if (obj.hasOwnProperty(property)) {
        // if(typeof(obj[property]) === 'string') {
        //   query += property + '=' + obj[property] + '&';
        // } else {
        //   query += property + '=' + obj[property] + '&';
        // }
        if(iteration === Object.keys(obj).length) {
          query += property + '=' + obj[property];
        } else {
          query += property + '=' + obj[property] + '&';
        }
      }
    }
  }
console.log(this.API_URL + query);

  return  this.httpClient.get(this.API_URL+query)
  
}
  
  
 
    
  

}