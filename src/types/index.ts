// Изначальные карточки
export interface IProduct {
    id: string;
    title: string;
    description: string;
    price: number | null;
    category: string;
    image: string;
}

// Каталог карточек 
export interface ICatalogModel{
    items: IProduct[];
    basket: string[];
    preview: string;
    order?: IOrder;
    loading: boolean;
    total: string | number;
    setItems(items: IProduct[]): void;
    getProduct(id: string): IProduct | undefined;
}

// Карточка оплаты 
export interface IOrder {
    order?: string;
    phone?: string | number;
    mail?: string;
    total?: string | number;
    payment?: string;
    id?: string;
}

// результат оплаты 
export interface IResult {
    id: string;
}

// Интерфейс обработчика событий 
export interface IEventEmitter {
    emit(event: string, data?: unknown): void;
  }

// Интерфейс для вывода данных
export interface IViewConstructor {
    new (container: HTMLElement, events?: IEventEmitter): IView;
} 

// Данные которые возвращает контейнер
export interface IView {
    render(data?: object): HTMLElement;
}