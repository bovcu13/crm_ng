import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'; //http協定
import {Product} from "../shared/models/product";
import {Contract} from "../shared/models/contract";
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  private BaseUrl: string = 'https://api.t.d2din.com/crm/v1.0';

  constructor(
    private http: HttpClient,
  ) {
  }

  //--帳戶---------------------------------------------------------------------------------------------------
  getAllAccountRequest(page: number): Observable<any> {
    const url = `${this.BaseUrl}/accounts?page=${page}&limit=10`;
    return this.http.get<any>(url);
  }

  getOneAccountRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/accounts/${id}`;
    return this.http.get<any>(url);
  }

  postAccountRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/accounts`;
    return this.http.post<any>(url, body);
  }

  patchAccountRequest(id: any, body: any): Observable<any> {
    const url = `${this.BaseUrl}/accounts/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteAccountRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/accounts/${id}`;
    return this.http.delete<any>(url);
  }

  //--使用者---------------------------------------------------------------------------------------------------
  getAllUserRequest(page: number): Observable<any> {
    const url = this.BaseUrl + '/users' + '?page=' + page + '&limit=20';
    return this.http.get<any>(url);
  }

  //--商品/服務---------------------------------------------------------------------------------------------------
  name: any;
  code: any;
  description: any;
  enable!: boolean;
  price!: number;

  //取得all  商品/服務資料
  getAllProductRequest(limit=20,page=1): Observable<any> {
    const url = this.BaseUrl + '/products' + '?page=' + page + '&limit=' + limit;
    return this.http.get<any>(url);
  }

  //取得one  商品/服務資料 get one
  getOneProductRequest(sid: any): Observable<any> {
    const url = `${this.BaseUrl}/products/${sid}`;
    return this.http.get(url);
  }

  //新增 商品/服務資料 post
  postProductRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/products`;
    return this.http.post<any>(url, body);
  }

  //修改 商品/服務資料 patch
  patchProductRequest(sid: string, body: any): Observable<Product> {
    const url = `${this.BaseUrl}/products/${sid}`;
    return this.http.patch<Product>(url, body);
  }

  //刪除 商品/服務資料 delete
  deleteProductRequest(sid: string): Observable<Product> {
    const url = `${this.BaseUrl}/products/${sid}`;
    return this.http.delete<Product>(url);
  }

  //--契約---------------------------------------------------------------------------------------------------
  status: any;
  start_date: any;
  end_date: any;
  term: any;

//取得所有契約
  getAllContractRequest(limit = 20, page = 1, sortField = '', sortOrder = 1): Observable<any> {
    let url = this.BaseUrl + '/contracts' + '?page=' + page + '&limit=' + limit;
    if (sortField !== '') {
      url += '&sortField=' + sortField + '&sortOrder=' + sortOrder;
    }
    return this.http.get<any>(url);
  }

  //新增 契約 post
  postContractRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/contracts`;
    return this.http.post<any>(url, body);
  }

  //修改 契約 patch
  patchContractRequest(sid: string, body: any): Observable<Contract> {
    const url = `${this.BaseUrl}/contracts/${sid}`;
    return this.http.patch<Contract>(url, body);
  }

  deleteContractRequest(sid: string): Observable<Product> {
    const url = `${this.BaseUrl}/contracts/${sid}`;
    return this.http.delete<Product>(url);
  }

  //--訂單---------------------------------------------------------------------------------------------------
  account_id: any;
  accounts: any;
  contracts: any;
  amount:any;
  contract_id : any;
  activated_by : any;
  activated_date : any;
  //取得所有訂單 getall
  getAllOrderRequest(limit = 20, page = 1): Observable<any> {
    // let obj: any = {
    //   filter: {
    //     code:search ? search : null,
    //     status: search ? search : null,
    //     start_date: search ? search : null,
    //     //accounts: search ? search : null,
    //     contracts: search ? search : null,
    //   },
    // };
    // if (event) {
    //   // 判斷是否有用全域搜尋欄
    //   let keyword = event.globalFilter;
    //   if (!event.globalFilter) {
    //     keyword = event.data
    //   }
    //   obj = {
    //     filter: {
    //       code: keyword,
    //       status: keyword,
    //       start_date: keyword,
    //       //accounts: keyword,
    //       contracts: keyword,
    //     },
    //   };
    // }
    const url = this.BaseUrl + '/orders' + '?page=' + page + '&limit=' + limit;
    return this.http.get<any>(url);
  }

  // getAllOrderRequest(page : number): Observable<any> {
  //   const url = this.BaseUrl + '/orders' + '?page=' + page + '&limit=20';
  //   return this.http.get<any>(url);
  // }

  //新增 訂單 post
  postOrderRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/orders`;
    return this.http.post<any>(url, body);
  }

  //修改 訂單 patch
  patchOrderRequest(sid: string, body: any): Observable<any>{
    const url = `${this.BaseUrl}/orders/${sid}`;
    return this.http.patch<any>(url, body);
  }

  //刪除 訂單 delete
  deleteOrderRequest(sid: string): Observable<any> {
    const url = `${this.BaseUrl}/orders/${sid}`;
    return this.http.delete<any>(url);
  }
}
