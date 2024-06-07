import { IProduct } from '../types';
import { Component } from './Component';

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export interface ICard extends IProduct {
	price: null | number;
	id: string;
	basketId?: string;
	button: string;
}

export class Card extends Component<ICard> {
	protected _basketId: HTMLElement;
	protected _category: HTMLElement;
	protected _title: HTMLElement;
	protected _image: HTMLImageElement;
	protected _description: HTMLElement;
	protected _button: HTMLButtonElement;
	protected _price: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._basketId = container.querySelector('.basket__item-index');
		this._category = container.querySelector('.card__category');
		this._title = container.querySelector('.card__title');
		this._image = container.querySelector('.card__image');
		this._description = container.querySelector(`.card__text`);
		this._button = container.querySelector(`.card__button`);
		this._price = container.querySelector('.card__price');

		if (actions.onClick) {
			if (this._button) this._button.addEventListener('click', actions.onClick);
			else container.addEventListener('click', actions.onClick);
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set basketId(value: string) {
		this._basketId.textContent = value;
	}

	get basketId(): string {
		return this._basketId.textContent || '';
	}

	categoryColor(value: string): string {
		switch (value) {
			case 'софт-скил':
				return 'card__category_soft';
			case 'хард-скил':
				return 'card__category_hard';
			case 'кнопка':
				return 'card__category_button';
			case 'дополнительное':
				return 'card__category_additional';
			default:
				return 'card__category_other';
		}
	}

	set category(value: string) {
		this.setText(this._category, value);
		this.toggleClass(this._category, this.categoryColor(value));
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string | string[]) {
		if (Array.isArray(value)) {
			this._description.replaceWith(
				...value.map((str) => {
					const descTemplate = this._description.cloneNode() as HTMLElement;

					this.setText(descTemplate, str);

					return descTemplate;
				})
			);
		} else this.setText(this._description, value);
	}

	set button(value: string) {
		if (this._button) this._button.textContent = value;
	}

	set price(value: number | null) {
		if (value === null) this.setText(this._price, 'Бесценно');
		else this.setText(this._price, `${value.toString()} синапса(-ов)`);
	}

	get price(): number {
		return Number(this._price.textContent || '');
	}
}
