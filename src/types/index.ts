export interface IOrder {
    items: string[];
    payment: string;
    total: number;
    address: string;
    email: string;
    phone: string;
  }

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  price: number | null;
  selected: boolean;
}

export interface ICard {
    id: string;
    title: string;
    category: string;
    description: string;
    image: string;
    price: number | null;
    selected: boolean;
  }

 export interface IAppState {
  basket: IProduct[];
  store: IProduct[];
  order: IOrder;
  formErrors: FormErrors;
  addToBasket(value: IProduct): void;
  deleteFromBasket(id: string): void;
  clearBasket(): void;
}

export interface IBasket {
  list: HTMLElement[];
  price: number;
}

export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
  }

type FormErrors = Partial<string>;