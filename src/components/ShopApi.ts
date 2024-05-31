import { IOrder, IResult, IProduct } from "../types";
import { Api, ApiListResponse} from "./base/api";

export class ShopApi extends Api {
    getCatalog(): Promise<ApiListResponse<IProduct>> {
        return this.get('/product')
            .then((data: ApiListResponse<IProduct>) => data);
    }
    container: string;
  
    constructor(container: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options); // Вызов конструктора родительского класса Api.
      this.container = container;
    }

    // Получение списка продуктов с сервера.
    getProductList(): Promise<IProduct[]> {
      return this.get('/product')
        .then((data: ApiListResponse<IProduct>) => {
          return data.items.map((item) => ({ ...item }));
        });
    }

    // Оформление заказа на продукты.
    orderProducts(order: IOrder): Promise<IResult> {
      return this.post('/order', order).then(
          (data: IResult) => data
      );
    }
}