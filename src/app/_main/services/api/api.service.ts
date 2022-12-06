import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Service } from '@main/decorators/service/service.decorator';
import { environment } from 'src/environments/environment';
import { RequestOptions } from '../../interfaces/request-options.interface';
import { DataFilter, DataFilterType } from '@main/interfaces/filters.interface';

/**
 * Service to access the API
 */
@Service()
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /**
   * URL of the API. Provided in the environment configuration file.
   */
  private apiURL: string = environment.apiURL;

  /**
   * Default service constructor with `HttpClient` dependency
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Sends request to the API.
   * @param method HTTP method to use
   * @param url URL where to send request
   * @param options advanced options to configure request
   * @returns Request observable, which completes when request is finished
   */
  public request<T = any>(method: string, url: string, options?: RequestOptions) {
    let params = this.getParamsFromFilters(options?.filters) || new HttpParams();

    if (options?.params instanceof HttpParams) {
      for (const param of options.params.keys()) {
        params = params.append(param, options.params.get(param)!);
      }
    } else if (options?.params) {
      params = params.appendAll(options.params);
    }

    return this.httpClient.request<T>(method, this.apiURL + url, {
      responseType: 'json' as any,
      withCredentials: true,
      ...options,
      params,
    });
  }

  /**
   * Sends GET request to the API.
   * @param url URL where to send request
   * @param options advanced options to configure request
   * @returns Request observable, which completes when request is finished
   */
  public get<T = any>(url: string, options?: RequestOptions) {
    return this.request<T>('GET', url, options);
  }

  /**
   * Sends POST request to the API.
   * @param url URL where to send request
   * @param options advanced options to configure request
   * @returns Request observable, which completes when request is finished
   */
  public post<T = any>(url: string, options?: RequestOptions) {
    return this.request<T>('POST', url, options);
  }

  /**
   * Sends DELETE request to the API.
   * @param url URL where to send request
   * @param options advanced options to configure request
   * @returns Request observable, which completes when request is finished
   */
  public delete<T = any>(url: string, options?: RequestOptions) {
    return this.request<T>('DELETE', url, options);
  }

  /**
   * Sends PUT request to the API.
   * @param url URL where to send request
   * @param options advanced options to configure request
   * @returns Request observable, which completes when request is finished
   */
  public put<T = any>(url: string, options?: RequestOptions) {
    return this.request<T>('PUT', url, options);
  }

  /**
   * Sends PATCH request to the API.
   * @param url URL where to send request
   * @param options advanced options to configure request
   * @returns Request observable, which completes when request is finished
   */
  public patch<T = any>(url: string, options?: RequestOptions) {
    return this.request<T>('PATCH', url, options);
  }

  private getParamsFromFilters<T, V extends string | boolean | number>(
    filters?: DataFilter<T, V>[] | DataFilter<T, V>,
  ) {
    if (!filters) {
      return;
    }

    let params: RequestOptions['params'] = new HttpParams();

    if (!Array.isArray(filters)) {
      filters = [filters];
    }
    for (const filter of filters) {
      if (filter.type == DataFilterType.BACKEND) {
        if (filter.value !== undefined) {
          params = params.append(filter.field, filter.value);
        }
      }
    }

    return params;
  }
}
