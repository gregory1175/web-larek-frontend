export interface IOrder {
	items: string[];
	payment: string;
	total: number;
	address: string;
	email: string;
	phone: string;
  }

  export interface IOrderResult {
	id: string;
	total: number;
}

export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;
