import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface IKeyValue {
    [key: string]: any;
};
interface IRestServiceAll {
    expand?: string[];
    order?: string;
    page?: number;
    pageSize?: number;
    query?: IKeyValue;
};
interface IRestServiceSearch {
    expand?: string[];
    order?: string;
    page?: number;
    pageSize?: number;
    conditions?: string[][];
};

@Injectable({
    providedIn: 'root'
})
export class RestService {
    constructor(private http: HttpClient) {
    }

    public all(table: string, params: IRestServiceAll = {}): Observable<any> {
        const qParams: any = {};

        qParams.page = params.page || 1;
        qParams.pageSize = params.pageSize || 25;

        if (params.query) {
            qParams.query = JSON.stringify(params.query);
        }
        if (params.order) {
            qParams.order = params.order;
        }
        if (params.expand) {
            qParams.expand = params.expand.join(',');
        }

        const queryParams: string[] = [];
        for (const k of Object.keys(qParams)) {
            queryParams.push(`${k}=${qParams[k]}`);
        }

        return this.http.get(`/rest/${table}?${queryParams.join('&')}`);
    }
    public create(table: string, data: IKeyValue): Observable<any> {
        return this.http.post(`/rest/${table}`, data);
    }
    public delete(table: string, id: number): Observable<any> {
        return this.http.delete(`/rest/${table}/${id}`);
    }
    public get(table: string, id: number, expand: string[] = []): Observable<any> {
        let str: string = '';

        if (expand) {
            str = `expand=${expand.join(',')}`;
        }

        return this.http.get(`/rest/${table}/${id}${str ? '?' : ''}${str}`);
    }
    public search(table: string, params: IRestServiceSearch = {}): Observable<any> {
        const qParams: any = {};

        qParams.page = params.page || 1;
        qParams.pageSize = params.pageSize || 25;

        if (params.order) {
            qParams.order = params.order;
        }
        if (params.expand) {
            qParams.expand = params.expand.join(',');
        }

        const queryParams: string[] = [];
        for (const k of Object.keys(qParams)) {
            queryParams.push(`${k}=${qParams[k]}`);
        }

        return this.http.post(`/rest/search/${table}?${queryParams.join('&')}`, params.conditions);
    }
    public update(table: string, id: number, data: IKeyValue): Observable<any> {
        return this.http.put(`/rest/${table}/${id}`, data);
    }
}
