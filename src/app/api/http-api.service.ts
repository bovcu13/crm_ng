import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http'; //http協定
import {Contract} from "../shared/models/contract";
import {Quote} from '../shared/models/quote';
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
    const url = `${this.BaseUrl}/accounts/list?page=${page}&limit=10`;
    return this.http.get<any>(url);
  }

  getAllAccountDetailRequest(page: number): Observable<any> {
    const url = `${this.BaseUrl}/accounts/contacts?page=${page}&limit=10`;
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

  //--聯絡人---------------------------------------------------------------------------------------------------
  getAllContactRequest(page: number): Observable<any> {
    const url = `${this.BaseUrl}/contacts/list?page=${page}&limit=10`;
    return this.http.get<any>(url);
  }

  getOneContactRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/contacts/${id}`;
    return this.http.get<any>(url);
  }

  postContactRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/contacts`;
    return this.http.post<any>(url, body);
  }

  patchContactRequest(id: any, body: any): Observable<any> {
    const url = `${this.BaseUrl}/contacts/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteContactRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/contacts/${id}`;
    return this.http.delete<any>(url);
  }

  //--線索---------------------------------------------------------------------------------------------------

  getAllLeadRequest(search: string, status = 1, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        description: search ? search : null,
        rating: search ? search : null,
        source: search ? search : null,
      },
    };
    if (event) {
      let direction = null;
      if (event.sortOrder === 1) {
        direction = "asc";
      } else {
        direction = "desc";
      }
      // 判斷是否有用全域搜尋欄
      let keyword = event.globalFilter;
      if (!event.globalFilter) {
        keyword = event.data
      }
      obj = {
        sort: { field: event.sortField || null, direction: direction },
        field: status,
        filter: {
          description: keyword,
          rating: keyword,
          source: keyword,
        },
      };
    }
    const url = `${this.BaseUrl}/leads/list?page=${page}&limit=10`;
    return this.http.post<any>(url, obj);
  }
  // getAllLeadRequest(page: number): Observable<any> {
  //   const url = `${this.BaseUrl}/leads/list?page=${page}&limit=10`;
  //   return this.http.get<any>(url);
  // }

  getOneLeadRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/leads/${id}`;
    return this.http.get<any>(url);
  }

  postLeadRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/leads`;
    return this.http.post<any>(url, body);
  }

  patchLeadRequest(id: any, body: any): Observable<any> {
    const url = `${this.BaseUrl}/leads/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteLeadRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/leads/${id}`;
    return this.http.delete<any>(url);
  }

  //--商機---------------------------------------------------------------------------------------------------

  getAllOpportunityRequest(search: string, status = 1, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        name: search ? search : null
      },
    };
    if (event) {
      let direction = null;
      if (event.sortOrder === 1) {
        direction = "asc";
      } else {
        direction = "desc";
      }
      // 判斷是否有用全域搜尋欄
      let keyword = event.globalFilter;
      if (!event.globalFilter) {
        keyword = event.data
      }
      obj = {
        sort: { field: event.sortField || null, direction: direction },
        field: status,
        filter: {
          name: keyword,
        },
      };
    }
    const url = `${this.BaseUrl}/opportunities/list?page=${page}&limit=10`;
    return this.http.post<any>(url, obj);
  }
  // getAllOpportunityRequest(page: number): Observable<any> {
  //   const url = `${this.BaseUrl}/opportunities/list?page=${page}&limit=10`;
  //   return this.http.get<any>(url);
  // }

  getOneOpportunityRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/opportunities/${id}`;
    return this.http.get<any>(url);
  }

  postOpportunityRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/opportunities`;
    return this.http.post<any>(url, body);
  }

  patchOpportunityRequest(id: any, body: any): Observable<any> {
    const url = `${this.BaseUrl}/opportunities/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteOpportunityRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/opportunities/${id}`;
    return this.http.delete<any>(url);
  }

  //--商品/服務---------------------------------------------------------------------------------------------------

  //取得all  商品/服務資料
  // getAllProductRequest(limit = 20, page = 1): Observable<any> {
  //   const url = this.BaseUrl + '/products/list' + '?page=' + page + '&limit=' + limit;
  //   return this.http.get<any>(url);
  // }

  getAllProductRequest(search: string,status=1,limit = 20, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        name: search ? search : null,
        code: search ? search : null,
        description: search ? search : null,
      },
    };
    if (event) {
      let direction = null;
      if (event.sortOrder === 1) {
        direction = "asc";
      } else {
        direction = "desc";
      }
      // 判斷是否有用全域搜尋欄
      let keyword = event.globalFilter;
      if (!event.globalFilter) {
        keyword = event.data
      }
      obj = {
        sort: { field: event.sortField || null, direction: direction },
        field: status,
        filter: {
          name: keyword,
          code: keyword,
          description: keyword,
        },
      };
    }
    const url = `${this.BaseUrl}/products/list?page=${page}&limit=${limit}`;
    return this.http.post<any>(url, obj);
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
  patchProductRequest(sid: string, body: any): Observable<any> {
    const url = `${this.BaseUrl}/products/${sid}`;
    return this.http.patch<any>(url, body);
  }

  //刪除 商品/服務資料 delete
  deleteProductRequest(sid: string): Observable<any> {
    const url = `${this.BaseUrl}/products/${sid}`;
    return this.http.delete<any>(url);
  }

  //--契約---------------------------------------------------------------------------------------------------
  status: any;
  start_date: any;
  end_date: any;
  term: any;

//取得所有契約
  getAllContractRequest(limit = 20, page = 1): Observable<any> {
    let url = this.BaseUrl + '/contracts/list' + '?page=' + page + '&limit=' + limit;
    return this.http.get<any>(url);
  }

  getOneContractRequest(sid: any): Observable<any> {
    const url = `${this.BaseUrl}/contracts/${sid}`;
    return this.http.get(url);
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

  deleteContractRequest(sid: string): Observable<any> {
    const url = `${this.BaseUrl}/contracts/${sid}`;
    return this.http.delete<any>(url);
  }

  //--訂單---------------------------------------------------------------------------------------------------
  account_id: any;
  account_name: any;
  accounts: any;
  contracts: any;
  amount: any;
  contract_id: any;
  contract_code: any;
  activated_by: any;
  activated_date: any;
  description: any;
  code: any;
  name: any;

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
    const url = this.BaseUrl + '/orders/list' + '?page=' + page + '&limit=' + limit;
    return this.http.get<any>(url);
  }

  // getAllOrderRequest(page : number): Observable<any> {
  //   const url = this.BaseUrl + '/orders' + '?page=' + page + '&limit=20';
  //   return this.http.get<any>(url);
  // }

  getOneOrderRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/orders/${id}`;
    return this.http.get<any>(url);
  }

  //新增 訂單 post
  postOrderRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/orders`;
    return this.http.post<any>(url, body);
  }

  //修改 訂單 patch
  patchOrderRequest(sid: string, body: any): Observable<any> {
    const url = `${this.BaseUrl}/orders/${sid}`;
    return this.http.patch<any>(url, body);
  }

  //刪除 訂單 delete
  deleteOrderRequest(sid: string): Observable<any> {
    const url = `${this.BaseUrl}/orders/${sid}`;
    return this.http.delete<any>(url);
  }

//----報價---------------------------------------------------------------------------------------------------

  //取得所有報價 getall
  getAllQuoteRequest(search: string,status=1,limit = 20, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        name: search ? search : null,
      },
    };
    if (event) {
      let direction = null;
      if (event.sortOrder === 1) {
        direction = "asc";
      } else {
        direction = "desc";
      }
      // 判斷是否有用全域搜尋欄
      let keyword = event.globalFilter;
      if (!event.globalFilter) {
        keyword = event.data
      }
      obj = {
        sort: { field: event.sortField || null, direction: direction },
        field: status,
        filter: {
          name: keyword,
        },
      };
    }
    const url = `${this.BaseUrl}/quotes/list?page=${page}&limit=${limit}`;
    return this.http.post<any>(url, obj);
  }
  // getAllQuoteRequest(limit = 20, page = 1): Observable<any> {
  //   let url = this.BaseUrl + '/quotes/list' + '?page=' + page + '&limit=' + limit;
  //   return this.http.get<any>(url);
  // }

  //取得一筆 報價 getone
  getOneQuotetRequest(id: any): Observable<Quote> {
    const url = `${this.BaseUrl}/quotes/${id}`;
    return this.http.get<Quote>(url);
  }

  //新增 報價 post
  postQuoteRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/quotes`;
    return this.http.post<any>(url, body);
  }

  //修改 報價 patch
  patchQuoteRequest(sid: string, body: any): Observable<any> {
    const url = `${this.BaseUrl}/quotes/${sid}`;
    return this.http.patch<any>(url, body);
  }

  //刪除 報價 delete
  deleteQuoteRequest(sid: string): Observable<any> {
    const url = `${this.BaseUrl}/quotes/${sid}`;
    return this.http.delete<any>(url);
  }

  //----------行銷活動------------------------------------------------------------------------------------------------
  is_enable: any;
  parent_campaign_id: any;
  type: any;
  owner: any;

  //取得所有行銷活動 getall
  getAllCampaignRequest(limit = 20, page = 1): Observable<any> {
    const url = this.BaseUrl + '/campaigns/list' + '?page=' + page + '&limit=' + limit;
    return this.http.get<any>(url);
  }

  getOneCampaignRequest(id: any): Observable<any> {
    const url = `${this.BaseUrl}/campaigns/${id}`;
    return this.http.get<any>(url);
  }

  //新增 行銷活動 post
  postCampaignRequest(body: any): Observable<any> {
    const url = `${this.BaseUrl}/campaigns`;
    return this.http.post<any>(url, body);
  }

  //修改 行銷活動 patch
  patchCampaignRequest(sid: string, body: any): Observable<any> {
    const url = `${this.BaseUrl}/campaigns/${sid}`;
    return this.http.patch<any>(url, body);
  }

  //刪除 行銷活動 delete
  deleteCampaignRequest(sid: string): Observable<any> {
    const url = `${this.BaseUrl}/campaigns/${sid}`;
    return this.http.delete<any>(url);
  }
}
