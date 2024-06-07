import './scss/styles.scss';

import { EventEmitter } from './components/base/events';
import { Page } from './components/Page';
import { Order } from './components/Order';
import { Card, ICard } from './components/Card';
import { IOrder } from './types';
import { LarekAPI } from './components/LarekAPI';
import { Modal } from './components/Modal';
import { Basket } from './components/Basket';
import { API_URL, CDN_URL } from './utils/constants';
import { AppState, CatalogChangeEvent } from './components/AppData';
import { Success } from './components/Success';
import { ensureElement, cloneTemplate } from './utils/utils';

// Константы 
const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

// Шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog'),
	cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview'),
	cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket'),
	basketTemplate = ensureElement<HTMLTemplateElement>('#basket'),
	orderTemplate = ensureElement<HTMLTemplateElement>('#order'),
	contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts'),
	successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Модель данных приложения
const appData = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(document.body, events),
	modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

// Переиспользуемые части интерфейса
const basket = new Basket(cloneTemplate(basketTemplate), events),
	order = new Order(cloneTemplate(orderTemplate), events),
	contacts = new Order(cloneTemplate(contactsTemplate), events);

// Апи
api
	.getProductItem()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => console.log(error));

// Мониторинг событий
events.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

// Изменение элементов каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		});

		return card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			price: item.price,
		});
	});
});

// Открытие попапа карточки каталога
events.on('card:select', (item: ICard) => appData.setPreview(item));

// Изменение товара
events.on('preview:changed', (item: ICard) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('item:check', item);
			card.button =
				appData.basket.indexOf(item) === -1 ? 'В корзину' : 'Убрать из корзины';
		},
	});

	modal.render({
		content: card.render({
			category: item.category,
			title: item.title,
			image: item.image,
			description: item.description,
			button:
				appData.basket.indexOf(item) === -1 ? 'В корзину' : 'Убрать из корзины',
			price: item.price,
		}),
	});
});

// Блокировка скролла попапа
events.on('modal:open', () => {
	page.locked = true;
});

// Разблокировка скролла попапа
events.on('modal:close', () => {
	page.locked = false;
});

// Изменение товаров в корзине через попап
events.on('item:check', (item: ICard) => {
	if (appData.basket.indexOf(item) === -1) events.emit('item:add', item);
	else events.emit('item:remove', item);
});

// Добавление товара в корзину
events.on('item:add', (item: ICard) => {
	appData.addToBasket(item);
});

// Удаление товара из корзины
events.on('item:remove', (item: ICard) => {
	appData.removeFromBasket(item);
});

// Изменение счетчика товаров корзины
events.on('count:changed', () => (page.counter = appData.basket.length));

// Обновление корзины
events.on('basket:changed', (items: ICard[]) => {
	basket.items = items.map((item, basketId) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('item:remove', item);
			},
		});
		return card.render({
			basketId: (basketId + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});

	let total = items.reduce((total, item) => total + item.price, 0);

	basket.total = total;
	appData.order.total = total;
});

// Открытие корзины
events.on('basket:open', () => {
	basket.selected = appData.basket;

	modal.render({
		content: basket.render({}),
	});
});

// Открытие формы доставки
events.on('order:open', () => {
	appData.order.items = appData.basket.map((item) => item.id);

	modal.render({
		content: order.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Проверка выбора способа оплаты
events.on('order:change', ({ name }: { name: string }) => {
	appData.order.payment = name;
	appData.validateOrderForm();
});

// Открытие формы контактов
events.on('order:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Измененине состояния валидации формы
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;

	order.valid = !payment && !address;
	order.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	contacts.valid = !email && !phone;
	contacts.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Изменилось одно из полей
events.on(
	/^order\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IOrder; value: string }) => {
		appData.setOrderField(data.field, data.value);
	}
);

// Отправление формы заказа
events.on('contacts:submit', () => {
	api
		.order(appData.order)
		.then(() => {
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});

			success.total = `Списано ${appData.order.total} синапсов`;
			appData.clearBasket();

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => console.error(err));
});
