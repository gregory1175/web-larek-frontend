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
  email?: string;
  phone: string;
}
```

Описывает карточку товара в магазине:
```
interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  price: number | null;
  selected: boolean;
}
```

Описывает карточку товара:
```
interface ICard {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  price: number | null;
  selected: boolean;
}
```

Описывает состояние приложения:
```
 export interface IAppState {
  basket: IProduct[];
  store: IProduct[];
  order: IOrder;
  formErrors: FormErrors;
  addToBasket(value: IProduct): void;
  deleteFromBasket(id: string): void;
  clearBasket(): void;
}
```

Описывает корзину товаров:
```
interface IBasket {
  list: HTMLElement[];
  price: number;
}
```

Описывает способ оплаты: 
```
export interface IOrderForm {
    payment: string;
    address: string;
    email: string;
    phone: string;
  }
```

Описывает ошибки валидации форм:
```
type FormErrors = Partial<string>;
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