import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/timeout';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { headerOptions } from '../../app/main';
/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

    constructor(public http: Http, public localStorageProvider: LocalStorageProvider) {

    }

    postService(url, data): Observable<any> {
        let headers = new Headers();
        headers.append('Content-Type', headerOptions['Content-Type']);
        if (headerOptions['Authorization'] != null) {
            headers.append('Authorization', headerOptions['Authorization']);
        }
       /*  if (headerOptions['Content-Id'] != null) {
            headers.append('Content-Id', headerOptions['Content-Id']);
        } */
        let reqOptions = new RequestOptions({ headers: headers });
        let body = JSON.stringify(data);
        return this.http.post(url, body, reqOptions)
            .timeout(45000) // request timeout;
            .map(this.extractData)
            .catch(this.catchError);
    }
    private extractData(res: Response) {
        return res.json();
    }
    private catchError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const err = error || '';
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        return Observable.throw(errMsg);
    }
}
