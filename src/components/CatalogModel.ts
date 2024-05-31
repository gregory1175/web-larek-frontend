import { ICatalogModel, IEventEmitter, IOrder, IProduct } from "../types";

export class CatalogModel implements ICatalogModel {
  public items: IProduct[] = [];

  constructor(private events: IEventEmitter) {}

  basket: string[];
  preview: string;
  order?: IOrder;
  loading: boolean;
  total: string | number;

  setItems(items: IProduct[]): void {
    this.items = items;
    this.events.emit('catalog:items-updated', this.items);
  }

  getProduct(id: string): IProduct | undefined {
    throw new Error('Method not implemented.');
  }
}