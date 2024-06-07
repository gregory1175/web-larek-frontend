# Проектная работа "Веб-ларек"

Ссылка на проект: https://github.com/gregory1175/web-larek-frontend

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Данные и типы данных, используемые в проекте 

Описывает список заказа:
```
export interface IOrder {
	items: string[];
	payment: string;
	total: number;
	address: string;
	email: string;
	phone: string;
  }
```

Описывает результат оплаты: 
```
  export interface IOrderResult {
	id: string;
	total: number;
}
```

Описывает карточку товара в магазине:
```
export interface IProduct {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
```

Описывает состояние приложения:
```
export interface IAppState {
	catalog: IProduct[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder | null;
	loading: boolean;
}
```

Описывает ошибки валидации форм:
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;

```

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения 

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных,
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api 
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов. 
Методы: 
- 'get' - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер 
- post' - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется 'POST' запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 
Основные методы, реализуемые классом описаны интерфейсом 'IEvents':
- 'on' - подписка на событие 
- 'emit' - инициализация события 
- 'trigger' - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие 

### Модели данных 

 Базовая модель:
 ```
 abstract class Model<T> {

  constructor(data: Partial<T>, protected events: IEvents) {}

  emitChanges(event: string, payload?: object) {}
}
 ```

 ### Классы представления

 Базовый компонент: 
 ``` 
 abstract class Component<T> {
  protected constructor(protected readonly container: HTMLElement);

  toggleClass(element: HTMLElement, className: string, force?: boolean): void;

  protected setText(element: HTMLElement, value: string): void;

  setDisabled(element: HTMLElement, state: boolean): void;

  protected setHidden(element: HTMLElement): void;

  protected setVisible(element: HTMLElement): void;

  protected setImage(el: HTMLImageElement, src: string, alt?: string): void;

  render(data?: Partial<T>): HTMLElement;
}
 ```

 Класс, описывающий главную страницу:
 ```
 class Page extends Component<IPage> {
  protected _counter: HTMLElement;
  protected _store: HTMLElement;
  protected _wrapper: HTMLElement;
  protected _basket: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents);

  set counter(value: number);

  set store(items: HTMLElement[]);

  set locked(value: boolean);
}
 ```

 Класс, описывающий карточку товара:
 ```
 class Card extends Component<ICard> {

  protected _title: HTMLElement;
  protected _image: HTMLImageElement;
  protected _category: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions);

  set id(value: string);
  get id(): string;

  set title(value: string);
  get title(): string;

  set image(value: string);

  set selected(value: boolean);

  set price(value: number | null);

  set category(value: CategoryType);
}

 ```
 Класс, описывающий корзину товаров:
 ```
 export class Basket extends Component<IBasket> {

  protected _list: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLElement, protected events: IEvents);

  set price(price: number);

  set list(items: HTMLElement[]);

  disableButton(): void;

  refreshIndices(): void;
}
 ```

 Класс, описывающий окошко заказа товара:
 ```
 export class Order extends Form<IOrder> {
  protected _card: HTMLButtonElement;
  protected _cash: HTMLButtonElement;

  constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents);

  disableButtons(): void;
}
 ```

 Класс, описывающий окошко контакты:
 ```
 export class Contacts extends Form<IContacts> {
  constructor(container: HTMLFormElement, events: IEvents);
}
 ```