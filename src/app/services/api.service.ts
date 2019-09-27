import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {environment} from '../../environments/environment';
import {SearchResultItem} from '../models/SearchResultItem';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      Authorization: 'my-auth-token'
    })
  };

  constructor(private http: HttpClient) {}

  private getParamsStr(params) {
    const arr = [];
    Object.keys(params).forEach(key => {
      if (key && params[key]) {
        arr.push( key + '=' + params[key] );
      }
    });
    return arr.length ? ('?' + arr.join('&')) : '';
  }

  /**
   * Receive all data for filling options in search form
   *
   * @method GET
   */
  getDictionaryList() {
    return this.http.get(`${environment.apiUrl}/dictionary/list`, this.httpOptions);
  }

  /**
   * Make search request for by searching model
   *
   * @method POST
   * @param data - `searchModel` in SearchComponent
   */
  searchConcept(data) {
    return this.http.post<SearchResultItem[]>(`${environment.apiUrl}/dictionary/search`, data, this.httpOptions);
  }

  /**
   * Send create new concept request
   *
   * @method POST
   * @param data - `dataModel` in NewConceptComponent
   */
  addConcept(data) {
    return this.http.post<SearchResultItem>(`${environment.apiUrl}/dictionary/record/add`, data, this.httpOptions);
  }

  /**
   * Update concept by ID
   *
   * @method POST
   * @param id - concept real ID (in DB)
   * @param data - `SearchResultItem` in models
   */
  editConcept(id, data) {
    return this.http.post(`${environment.apiUrl}/dictionary/record/${id}`, data, this.httpOptions);
  }

  /**
   * Delete concept by ID
   *
   * @method DELETE
   * @param id - concept real ID (in DB)
   */
  deleteConcept(id) {
    return this.http.delete<SearchResultItem>(`${environment.apiUrl}/dictionary/record/${id}`, this.httpOptions);
  }

  /**
   * Get all diseases from DB
   *
   * @method GET
   */
  getDiseases() {
    return this.http.get<string[]>(`${environment.apiUrl}/dictionary/disease`, this.httpOptions);
  }

  /**
   * Get all dictionaries by disease
   *
   * @method GET
   */
  getDictionaries(params) {
    return this.http.get<string[]>(`${environment.apiUrl}/dictionary/name${this.getParamsStr(params)}`, this.httpOptions);
  }

  /**
   * Get all pages names by disease and dictionary
   *
   * @method GET
   */
  getPagesNames(params) {
    return this.http.get<string[]>(`${environment.apiUrl}/dictionary/page${this.getParamsStr(params)}`, this.httpOptions);
  }

  /**
   * Get all fields names by disease, dictionary and page name
   *
   * @method GET
   */
  getFieldsNames(params) {
    return this.http.get<string[]>(`${environment.apiUrl}/dictionary/field${this.getParamsStr(params)}`, this.httpOptions);
  }

  /**
   * Get all fields names by disease, dictionary and page name
   *
   * @method GET
   */
  uploadDictionaryFile(file) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    const httpOptions =  Object.assign({}, this.httpOptions);
    httpOptions.headers.append('Content-Type', 'multipart/form-data');
    httpOptions.headers.append('Accept', 'application/json');
    return this.http.post(`${environment.apiUrl}/dictionary/file/upload`, formData, httpOptions);
  }
}
