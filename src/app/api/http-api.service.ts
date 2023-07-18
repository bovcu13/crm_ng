import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'; //http協定
import {Contract} from "../shared/models/contract";
import {Quote} from '../shared/models/quote';
import {Observable} from 'rxjs';
import {environment} from "../../environments/environment.development";

const BaseUrl: string = environment.API_URL;

@Injectable({
  providedIn: 'root'
})

export class HttpApiService {

  constructor(
    private http: HttpClient,
  ) {
  }

  //--使用者-------------------------------------------------------------------------------------------------

  getAllUserRequest(page: number): Observable<any> {
    const url = `${BaseUrl}/users?page=${page}&limit=10`;
    return this.http.get<any>(url);
  }

  //--帳戶---------------------------------------------------------------------------------------------------

  getAllAccountRequest(search: string, status = 1, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        name: search ? search : null,
        phone_number: search ? search : null,
        type: search ? search : null,
        salesperson_name: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
      if (event.sortOrder === 1) {
        direction = "asc";
      } else {
        direction = "desc";
      }
      // 判斷是否有用全域搜尋欄
      let keyword: string = event.globalFilter;
      if (!event.globalFilter) {
        keyword = event.data
      }
      if (keyword) {
        obj = {
          sort: {field: event.sortField || null, direction: direction},
          field: status,
          filter: {
            name: keyword,
            phone_number: keyword,
            type: keyword.split(','),
            salesperson_name: keyword,
          },
        };
      }
    }
    const url = `${BaseUrl}/accounts/list?page=${page}&limit=20`;
    return this.http.post<any>(url, obj);
  }

  // getAllAccountRequest(page: number): Observable<any> {
  //   const url = `${BaseUrl}/accounts/list?page=${page}&limit=10`;
  //   return this.http.get<any>(url);
  // }

  // getAllAccountDetailRequest(page: number): Observable<any> {
  //   const url = `${BaseUrl}/accounts/contacts?page=${page}&limit=10`;
  //   return this.http.get<any>(url);
  // }

  getOneAccountRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/accounts/${id}`;
    return this.http.get<any>(url);
  }

  postAccountRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/accounts`;
    return this.http.post<any>(url, body);
  }

  patchAccountRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/accounts/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteAccountRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/accounts/${id}`;
    return this.http.delete<any>(url);
  }

  //--聯絡人---------------------------------------------------------------------------------------------------
  getAllContactRequest(search: string, status = 1, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        cell_phone: search ? search : null,
        email: search ? search : null,
        name: search ? search : null,
        salesperson_name: search ? search : null,
        account_name: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
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
        sort: {field: event.sortField || null, direction: direction},
        field: status,
        filter: {
          cell_phone: keyword,
          email: keyword,
          name: keyword,
          salesperson_name: keyword,
          account_name: keyword,
        },
      };
    }
    const url = `${BaseUrl}/contacts/list?page=${page}&limit=10`;
    return this.http.post<any>(url, obj);
  }

  // getAllContactRequest(page: number): Observable<any> {
  //   const url = `${BaseUrl}/contacts/list?page=${page}&limit=10`;
  //   return this.http.get<any>(url);
  // }

  getOneContactRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/contacts/${id}`;
    return this.http.get<any>(url);
  }

  postContactRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/contacts`;
    return this.http.post<any>(url, body);
  }

  patchContactRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/contacts/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteContactRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/contacts/${id}`;
    return this.http.delete<any>(url);
  }

  //--線索---------------------------------------------------------------------------------------------------

  getAllLeadRequest(search: string, status = 1, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        description: search ? search : null,
        account_name: search ? search : null,
        rating: search ? search : null,
        source: search ? search : null,
        salesperson_name: search ? search : null,
        status: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
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
        sort: {field: event.sortField || null, direction: direction},
        field: status,
        filter: {
          description: keyword,
          account_name: keyword,
          rating: keyword,
          source: keyword,
          salesperson_name: keyword,
          status: keyword,
        },
      };
    }
    const url = `${BaseUrl}/leads/list?page=${page}&limit=10`;
    return this.http.post<any>(url, obj);
  }

  // getAllLeadRequest(page: number): Observable<any> {
  //   const url = `${BaseUrl}/leads/list?page=${page}&limit=10`;
  //   return this.http.get<any>(url);
  // }

  getOneLeadRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/leads/${id}`;
    return this.http.get<any>(url);
  }

  postLeadRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/leads`;
    return this.http.post<any>(url, body);
  }

  patchLeadRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/leads/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteLeadRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/leads/${id}`;
    return this.http.delete<any>(url);
  }

  //--商機---------------------------------------------------------------------------------------------------

  getAllOpportunityRequest(search: string, status = 1, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        name: search ? search : null,
        account_name: search ? search : null,
        salesperson_name: search ? search : null,
        stage: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
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
        sort: {field: event.sortField || null, direction: direction},
        field: status,
        filter: {
          name: keyword,
          account_name: keyword,
          salesperson_name: keyword,
          stage: keyword
        },
      };
    }
    const url = `${BaseUrl}/opportunities/list?page=${page}&limit=10`;
    return this.http.post<any>(url, obj);
  }

  // getAllOpportunityRequest(page: number): Observable<any> {
  //   const url = `${BaseUrl}/opportunities/list?page=${page}&limit=10`;
  //   return this.http.get<any>(url);
  // }

  getOneOpportunityRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/opportunities/${id}`;
    return this.http.get<any>(url);
  }

  postOpportunityRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/opportunities`;
    return this.http.post<any>(url, body);
  }

  patchOpportunityRequest(id: any, body: any): Observable<any> {
    const url = `${BaseUrl}/opportunities/${id}`;
    return this.http.patch<any>(url, body);
  }

  deleteOpportunityRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/opportunities/${id}`;
    return this.http.delete<any>(url);
  }

  //--商品/服務---------------------------------------------------------------------------------------------------

  //取得all  商品/服務資料
  // getAllProductRequest(limit = 20, page = 1): Observable<any> {
  //   const url = BaseUrl + '/products/list' + '?page=' + page + '&limit=' + limit;
  //   return this.http.get<any>(url);
  // }

  getAllProductRequest(search: string, status = 1, limit = 20, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        name: search ? search : null,
        code: search ? search : null,
        description: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
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
        sort: {field: event.sortField || null, direction: direction},
        field: status,
        filter: {
          name: keyword,
          code: keyword,
          description: keyword,
        },
      };
    }
    const url = `${BaseUrl}/products/list?page=${page}&limit=${limit}`;
    return this.http.post<any>(url, obj);
  }

  //取得one  商品/服務資料 get one
  // getOneProductRequest(sid: any): Observable<any> {
  //   const url = `${BaseUrl}/products/${sid}`;
  //   return this.http.get(url);
  // }

  //新增 商品/服務資料 post
  postProductRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/products`;
    return this.http.post<any>(url, body);
  }

  //修改 商品/服務資料 patch
  patchProductRequest(sid: string, body: any): Observable<any> {
    const url = `${BaseUrl}/products/${sid}`;
    return this.http.patch<any>(url, body);
  }

  //刪除 商品/服務資料 delete
  deleteProductRequest(sid: string): Observable<any> {
    const url = `${BaseUrl}/products/${sid}`;
    return this.http.delete<any>(url);
  }

  //取得依訂單獲得的所有商品含報價
  getAllOrderProdcutRequest(search: string, sid: string, status = 1, limit = 20, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        code: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
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
        sort: {field: event.sortField || null, direction: direction},
        field: status,
        filter: {
          code: keyword,
        },
      };
    }
    const url = `${BaseUrl}/products/get-by-order/${sid}?page=${page}&limit=${limit}`;
    return this.http.post<any>(url, obj);
  }

  //--契約---------------------------------------------------------------------------------------------------

//取得所有契約
  getAllContractRequest(search: string, status = 1, limit = 20, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        code: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
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
        sort: {field: event.sortField || null, direction: direction},
        field: status,
        filter: {
          code: keyword,
        },
      };
    }
    const url = `${BaseUrl}/contracts/list?page=${page}&limit=${limit}`;
    return this.http.post<any>(url, obj);
  }

  // getAllContractRequest(limit = 20, page = 1): Observable<any> {
  //   let url = BaseUrl + '/contracts/list' + '?page=' + page + '&limit=' + limit;
  //   return this.http.get<any>(url);
  // }

  getOneContractRequest(sid: any): Observable<any> {
    const url = `${BaseUrl}/contracts/${sid}`;
    return this.http.get(url);
  }

  //新增 契約 post
  postContractRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/contracts`;
    return this.http.post<any>(url, body);
  }

  //修改 契約 patch
  patchContractRequest(sid: string, body: any): Observable<Contract> {
    const url = `${BaseUrl}/contracts/${sid}`;
    return this.http.patch<Contract>(url, body);
  }

  deleteContractRequest(sid: string): Observable<any> {
    const url = `${BaseUrl}/contracts/${sid}`;
    return this.http.delete<any>(url);
  }

  //--歷程紀錄---------------------------------------------------------------------------------------------------

//取得所有歷程紀錄
  getAllHistoricalRecordsRequest(limit = 20, page = 1, sid: string): Observable<any> {
    const url = `${BaseUrl}/historical-records/list/${sid}?page=${page}&limit=${limit}`;
    return this.http.post<any>(url, sid);
  }

  //--訂單---------------------------------------------------------------------------------------------------
  //取得所有訂單 getall
  getAllOrderRequest(search: string, status = 1, limit = 20, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        code: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
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
        sort: {field: event.sortField || null, direction: direction},
        field: status,
        filter: {
          code: keyword,
        },
      };
    }
    const url = `${BaseUrl}/orders/list?page=${page}&limit=${limit}`;
    return this.http.post<any>(url, obj);
  }

  getOneOrderRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/orders/${id}`;
    return this.http.get<any>(url);
  }

  //新增 訂單 post
  postOrderRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/orders`;
    return this.http.post<any>(url, body);
  }

  //修改 訂單 patch
  patchOrderRequest(sid: string, body: any): Observable<any> {
    const url = `${BaseUrl}/orders/${sid}`;
    return this.http.patch<any>(url, body);
  }

  //刪除 訂單 delete
  deleteOrderRequest(sid: string): Observable<any> {
    const url = `${BaseUrl}/orders/${sid}`;
    return this.http.delete<any>(url);
  }

  //取得一筆 訂單含訂單產品 getone
  getOrderProductRequest(sid: any): Observable<any> {
    const url = `${BaseUrl}/orders/products/${sid}`;
    return this.http.get<any>(url);
  }

//------------訂單商品---------------------------------------------
  getAllOrderProductsRequest(limit = 20, page = 1): Observable<any> {
    let url = BaseUrl + '/orders-products' + '?page=' + page + '&limit=' + limit;
    return this.http.get<any>(url);
  }

  //取得一筆 商品報價 getone
  getOneOrderProductRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/orders-products/${id}`;
    return this.http.get<any>(url);
  }

  //新增 商品報價 post
  postOrderProductRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/orders-products`;
    return this.http.post<any>(url, body);
  }

  //修改 商品報價 patch
  patchOrderProductRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/orders-products`;
    return this.http.patch<any>(url, body);
  }

  //刪除 商品報價 delete
  deleteOrderProductRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/orders-products`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {headers: headers, body: body};

    return this.http.delete<any>(url, options);
  }

//----報價---------------------------------------------------------------------------------------------------

  //取得所有報價 getall
  getAllQuoteRequest(search: string, status = 1, limit = 20, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        name: search ? search : null,
        status: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
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
        sort: {field: event.sortField || null, direction: direction},
        field: status,
        filter: {
          name: keyword,
          status: keyword
        },
      };
    }
    const url = `${BaseUrl}/quotes/list?page=${page}&limit=${limit}`;
    return this.http.post<any>(url, obj);
  }


  //取得一筆 報價 getone
  getOneQuoteRequest(id: any): Observable<Quote> {
    const url = `${BaseUrl}/quotes/${id}`;
    return this.http.get<Quote>(url);
  }

  //新增 報價 post
  postQuoteRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/quotes`;
    return this.http.post<any>(url, body);
  }

  //修改 報價 patch
  patchQuoteRequest(sid: string, body: any): Observable<any> {
    const url = `${BaseUrl}/quotes/${sid}`;
    return this.http.patch<any>(url, body);
  }

  //刪除 報價 delete
  deleteQuoteRequest(sid: string): Observable<any> {
    const url = `${BaseUrl}/quotes/${sid}`;
    return this.http.delete<any>(url);
  }

  //取得一筆 報價含報價產品 getone
  getQuoteProductRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/quotes/products/${id}`;
    return this.http.get<any>(url);
  }

  //------------商品報價---------------------------------------------
  getAllQuoteProductsRequest(limit = 20, page = 1): Observable<any> {
    let url = BaseUrl + '/quotes-products' + '?page=' + page + '&limit=' + limit;
    return this.http.get<any>(url);
  }

  //取得一筆 商品報價 getone
  getOneQuoteProductRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/quotes-products/${id}`;
    return this.http.get<any>(url);
  }

  //新增 商品報價 post
  postQuoteProductRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/quotes-products`;
    return this.http.post<any>(url, body);
  }

  //修改 商品報價 patch
  patchQuoteProductRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/quotes-products`;
    return this.http.patch<any>(url, body);
  }

  //刪除 商品報價 delete
  deleteQuoteProductRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/quotes-products`;
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const options = {headers: headers, body: body};
    return this.http.delete<any>(url, options);
  }

  //----------行銷活動------------------------------------------------------------------------------------------------
  //取得所有行銷活動 getall
  getAllCampaignRequest(search: string, status = 1, limit = 20, page = 1, event?: any): Observable<any> {
    let obj: any = {
      field: status,
      filter: {
        name: search ? search : null,
        type: search ? search : null,
      },
    };
    if (event) {
      let direction: any;
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
        sort: {field: event.sortField || null, direction: direction},
        field: status,
        filter: {
          name: keyword,
          type: keyword,
        },
      };
    }
    const url = `${BaseUrl}/campaigns/list?page=${page}&limit=${limit}`;
    return this.http.post<any>(url, obj);
  }

  // getAllCampaignRequest(limit = 20, page = 1): Observable<any> {
  //   const url = BaseUrl + '/campaigns/list' + '?page=' + page + '&limit=' + limit;
  //   return this.http.get<any>(url);
  // }

  getOneCampaignRequest(id: any): Observable<any> {
    const url = `${BaseUrl}/campaigns/${id}`;
    return this.http.get<any>(url);
  }

  //新增 行銷活動 post
  postCampaignRequest(body: any): Observable<any> {
    const url = `${BaseUrl}/campaigns`;
    return this.http.post<any>(url, body);
  }

  //修改 行銷活動 patch
  patchCampaignRequest(sid: string, body: any): Observable<any> {
    const url = `${BaseUrl}/campaigns/${sid}`;
    return this.http.patch<any>(url, body);
  }

  //刪除 行銷活動 delete
  deleteCampaignRequest(sid: string): Observable<any> {
    const url = `${BaseUrl}/campaigns/${sid}`;
    return this.http.delete<any>(url);
  }
}
