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

## Об архитектуре

Взаимодействия внутри приложения происходят через события. 
Модели инициализируют события, чтобы сообщить о изменениях в данных. Например, когда пользователь добавляет товар в корзину, модель AppState инициализирует событие basket:changed, которое может быть перехвачено слушателями событий.
Слушатели событий в основном коде реагируют на эти события и выполняют необходимые действия, такие как передача данных компонентам отображения. Кроме того, слушатели событий могут выполнять вычисления между моментом перехвата события и передачей данных, например, для подготовки данных к отображению или для выполнения дополнительной логики приложения. Слушатели также могут менять значения в моделях, инициируя новые события в ответ на пользовательские действия или изменения в данных. Это создает цикл обратной связи, где действия пользователя приводят к изменениям в моделях, которые, в свою очередь, вызывают обновление интерфейса.
Таким образом, система событий служит мостом между моделями и представлениями, позволяя им взаимодействовать и обновляться в реальном времени.

## Архитектура приложения 

Код приложения разделен на слои согласно парадигме MVP:
- слой представления, отвечает за отображение данных на странице,
- слой данных, отвечает за хранение и изменение данных,
- презентер, отвечает за связь представления и данных.

### Базовый код

#### Класс Api 

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов. 

Конструктор принимает базовый URL и глобальные опции для всех запросов(опционально):
```
constructor(baseUrl: string, options: RequestInit = {})- 
```

Методы: 
- 'get' - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер 
- 'post' - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется 'POST' запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
-  'handleResponse' - метод предназначен для обработки ответа, полученного от HTTP-запроса. Обеспечивает удобную обработку ответов, позволяя легко различать успешные и неуспешные запросы и соответствующим образом реагировать на них в коде.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий. 

Конструктор инициализирует карту для хранения событий и их подписчиков:
```
constructor() {
  this._events = new Map<EventName, Set<Subscriber>>(); 
} 
```

Основные методы, реализуемые классом описаны интерфейсом 'IEvents':
- 'on' - подписка на событие 
- 'emit' - инициализация события 
- 'trigger' - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие 

#### Класс Component

Является абстрактным классом, который предоставляет базовую структуру и методы для компонентов пользовательского интерфейса. Может быть использован как основа для создания различных компонентов интерфейса, предоставляя общие методы для управления их поведением и отображением.

Конструктор класса принимает HTMLElement, который служит контейнером для компонента:
```
`protected constructor(protected readonly container: HTMLElement) {}` - 
```

Методы, реализуемые классом: 
- 'toggleClass' - Добавляет или удаляет класс у элемента
- 'setText' - Устанавливает текстовое содержимое элемента
- 'setDisabled' - Изменяет состояние доступности элемента
- 'setHidden' - Скрывает элемент
- 'setVisible' - Делает элемент видимым
- 'setImage' - Устанавливает изображение и его альтернативное описание
- 'render' - Обновляет компонент и возвращает его контейнер

#### Класс Model

Абстрактный класс, который служит шаблоном для создания моделей данных с возможностью инициирования событий.

Конструктор принимает два параметра: 'data' и 'events'. Параметр 'data' содержит частичные данные модели, которые могут быть использованы для инициализации экземпляра класса. Эти данные копируются в экземпляр класса с помощью 'Object.assign'. Параметр events должен быть объектом, который реализует интерфейс 'IEvents', предоставляющий метод emit для инициирования событий:
```
constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	} 
```
Метод реализуемый в классе: 
- 'emitChanges' - используется для инициирования событий. Он принимает имя события 'event' и необязательный параметр 'payload', который содержит данные, связанные с событием. Если 'payload' не предоставлен, по умолчанию используется пустой объект.

### Обобщенные классы 

#### Класс AppData 

Расширяет абстрактный класс Model и реализует интерфейс IAppState. Он представляет состояние приложения и управляет данными корзины, каталога, заказа и предпросмотра. Позволяет централизованно управлять данными приложения и взаимодействовать с пользователем, обеспечивая динамичное и отзывчивое поведение интерфейса.

Методы предоставленные в классе: 
- 'addToBasket' - Добавляет товар в корзину и передает события изменения
- 'removeFromBasket' - Удаляет товар из корзины и передает события изменения
- 'clearBasket' - Очищает корзину и передает события изменения
- 'getTotal' - Возвращает общую стоимость товаров в корзине
- 'setCatalog' - Устанавливает каталог товаров
- 'setPreview' -  Устанавливает предпросмотр товара
- 'validateOrderForm' - Проверяет форму заказа на наличие ошибок 
- 'setOrderField' - Устанавливает значение поля заказа и, если форма заказа валидна, передает событие готовности заказа

#### Класс Form

Класс Form<T> является обобщенным компонентом формы, который расширяет класс Component<IFormState>. Он управляет элементами формы и обрабатывает события ввода и отправки. Предоставляя гибкий способ управления формой и её состоянием.

Конструктор инициализирует форму, находит и сохраняет ссылки на кнопку отправки и элемент ошибок, устанавливает обработчики событий. Конструктор вызывает конструктор базового класса 'Component<IFormState>', передавая ему контейнер формы. Используя функцию 'ensureElement', находит и сохраняет ссылки на кнопку отправки формы '(_submit)' и элемент для отображения ошибок '(_errors)'. Эти элементы затем используются в других методах класса. Добавляет обработчик события 'input' к контейнеру формы. Этот обработчик вызывается каждый раз, когда пользователь вводит данные в любое поле формы. Внутри обработчика, метод onInputChange вызывается с именем поля и его новым значением. Также добавляется обработчик события 'submit', который предотвращает стандартное поведение отправки формы:
```
constructor(protected container: HTMLFormElement, protected events: IEvents) {}  
```

Методы используемые классом: 
- 'onInputChange' - Вызывается при каждом изменении в полях ввода, инициирует событие изменения для конкретного поля
- 'set valid' - Сеттер, который активирует или деактивирует кнопку отправки в зависимости от валидности формы
- 'set errors' - Сеттер, который устанавливает текст ошибок в элемент ошибок формы
- 'render' - Обновляет состояние формы и рендерит её, возвращая контейнер формы

#### Класс LarekApi

Класс LarekAPI является расширением базового класса Api и реализует интерфейс ILarekAPI. Предоставляет специализированные методы для работы с API конкретного веб-сервиса, позволяя легко получать информацию о продуктах и размещать заказы.

Конструктор принимает три параметра: 'cdn', 'baseUrl', и 'options'. Параметр 'cdn' используется для инициализации свойства 'cdn'. Параметры 'baseUrl' и 'options' передаются в конструктор базового класса Api.
```
constructor(cdn: string, baseUrl: string, options?: RequestInit) {}
```

Методы описанные в классе: 
- 'getProductItem' - Возвращает промис, который разрешается массивом продуктов (IProduct[]). Он вызывает метод get базового класса Api для получения списка продуктов с сервера.
- 'order' -  Принимает объект заказа (IOrder) и возвращает промис, который разрешается результатом заказа (IOrderResult). Он вызывает метод 'post' базового класса 'Api' для отправки данных заказа на сервер.

#### Класс Modal

Расширяет базовый класс Component и предназначен для управления модальными окнами в пользовательском интерфейсе.

Конструктор инициализирует элементы '_closeButton' и '_content', а также устанавливает обработчики событий для закрытия модального окна и предотвращения всплытия событий внутри контента.
```
constructor(container: HTMLElement, protected events: IEvents) {}
```

Методы используемые в классе: 
- 'set content' - Сеттер, который позволяет заменить содержимое модального окна
- '_toggleModal' - Вспомогательный метод для активации или деактивации модального окна
- '_handleEscape' - Обработчик события нажатия клавиши Escape, который закрывает модальное окно
- 'open' - Открывает модальное окно и устанавливает обработчик для клавиши Escape
- 'close' - Закрывает модальное окно, удаляет обработчик для клавиши Escape и очищает содержимое
- 'render' - Рендерит модальное окно с данными и открывает его

#### Класс Success

Является расширением базового класса Component и используется для управления элементами пользовательского интерфейса, связанными с успешным выполнением действий.

Конструктор принимает два параметра: 'container' и 'actions'. 'container' - это элемент, в котором будет размещаться компонент. 'actions' - это объект, который может содержать различные действия, такие как обработчики событий. В конструкторе происходит инициализация элементов '_total' и '_close', а также установка обработчика события клика, если он предоставлен:
```
constructor(container: HTMLElement, actions: ISuccessActions) {} 
```

Метод используемый в классе: 
- 'set total' - Сеттер, который позволяет установить текстовое содержимое элемента '_total', используемого для отображения общей суммы или итога.

### Модели данных 

#### Класс Model<T>

Абстрактный класс - базовая модель, чтобы можно было отличить ее от простых объектов с данными.

Конструктор принимает данные для хранения, эвент эмиттер
 ```
constructor(data: Partial<T>, protected events: IEvents) {}
 ```
 
#### Класс AppState

Класс AppState расширяет абстрактный класс 'Model<IAppState>'. 
Предоставляет конкретную реализацию модели состояния приложения. А именно, корзину покупок, каталог товаров, информацию о заказе и предпросмотр товаров. Класс использует систему событий для оповещения о изменениях в состоянии, что позволяет другим частям приложения реагировать на эти изменения.

Предоставляет следующие методы: 
- 'addToBasket' - Добавляет товар в корзину, если он еще не добавлен и имеет цену. Инициирует события изменения количества и состояния корзины
- 'removeFromBasket' - Удаляет товар из корзины.  Инициирует события изменения количества и состояния корзины
- 'clearBasket' - Очищает корзину. Инициирует события изменения количества и состояния корзины
- 'getTotal' - Возвращает общую стоимость товаров в корзине
- 'setCatalog' - Устанавливает каталог товаров. Инициирует событие изменения каталога товаров 
- 'setPreview' - Устанавливает предпросмотр товара.Инициирует событие изменения предпросмотра
- 'validateOrderForm' -  Проверяет поля формы заказа на наличие ошибок. Инициирует событие изменения ошибок формы. Возвращает true, если ошибок нет
- 'setOrderField' - Устанавливает значение поля заказа. Проверяет форму заказа и инициирует событие готовности заказа, если форма валидна

### Классы представления

#### Класс Component<T>

 Абстрактный класс, базовый компонент. Является основой для создания компонентов пользовательского интерфейса. Он предоставляет общие методы и свойства, которые могут быть использованы в производных классах. 

Конструктор принимает 'container', который является элементом DOM, где будет размещаться компонент. Этот параметр доступен только для чтения и защищён, что означает, что он может использоваться только внутри класса Component и его наследников:
 ``` 
protected constructor(protected readonly container: HTMLElement) 
 ```

Основные методы: 
- 'toggleClass' - Переключает класс у указанного элемента. Параметр 'force' может быть использован для принудительного добавления или удаления класса
- 'setText' - Устанавливает текст для указанного элемента
- 'setDisabled' - Устанавливает или снимает состояние 'disabled' у указанного элемента
- 'render' - абстрактный метод, который должен быть реализован в производных классах для отрисовки компонента с использованием предоставленных данных

#### Класс Page

Класс Page расширяет абстрактный класс Component и реализует интерфейс IPage. Он предназначен для управления элементами страницы веб-приложения

Конструктор принимает 'container' и 'events'. 'container' - это элемент DOM, в котором будет размещаться компонент. 'events' - это объект событий, который используется для взаимодействия с другими компонентами:
 ```
constructor(container: HTMLElement, protected events: IEvents)
 ```

 Основные методы предоставленные интерфейсом IPage:
- 'set counter' - Устанавливает количество элементов в '_counter'
- 'set catalog' -  Заменяет текущие элементы каталога новыми
- 'set locked' - Блокирует или разблокирует интерфейс пользователя, изменяя класс '_wrapper'

#### Класс Card

 Класс предназначен для представления карточки товара или услуги в веб-приложении. Расширяет абстрактный класс Component и реализует интерфейс ICard.
 
 Конструктор принимает 'container', который является элементом DOM, где будет размещаться карточка, и 'actions', который может содержать обработчики событий для карточки:
 ```
constructor(protected blockName: string, container: HTMLElement, actions?: ICardActions) 
 ```

Методы класса Card:
- 'set id' - Сеттер для установки идентификатора карточки. Значение 'value' присваивается атрибуту 'data-id' контейнера карточки.
- 'get id' - Геттер для получения идентификатора карточки. Возвращает значение атрибута 'data-id' контейнера карточки.
- 'set basketId' - Сеттер для установки идентификатора корзины.
- 'get basketId' - Геттер для получения идентификатора корзины. Возвращает текстовое содержимое элемента, отвечающего за индекс элемента в корзине.
- 'categoryColor' - Метод для определения класса цвета категории в зависимости
- 'set category' - Сеттер для установки категории карточки
- 'get category' - Геттер для получения категории карточки. Возвращает текстовое содержимое элемента категории.
- 'set title' -  Сеттер для установки названия карточки
- 'get title' - Геттер для получения названия карточки
- 'set image' - Сеттер для установки изображения карточки
- 'set description' - Сеттер для установки описания карточки
- 'set button' -  Сеттер для установки текста кнопки карточки
- 'set price' - Сеттер для установки цены карточки
- 'get price' - Геттер для получения цены карточки

#### Класс Basket

Наследует функциональность от абстрактного класса Component и предназначен для управления корзиной покупок в веб-приложении

Конструктор принимает 'container' (HTML-элемент, который будет содержать корзину) и 'events' (экземпляр EventEmitter для управления событиями). В конструкторе инициализируются основные элементы корзины: список товаров, общая стоимость и кнопка заказа:
 ```
constructor(protected blockName: string, container: HTMLElement, protected events: IEvents)
 ```

Методы реализуемые в классе: 
- 'set items' - Сеттер для установки элементов списка товаров. Если массив 'items' не пуст, то заменяет содержимое '_list' на новые элементы. Если массив пуст, отображает сообщение о том, что корзина пуста
- 'set selected' - Сеттер для управления доступностью кнопки заказа. Если массив 'items' не пуст, кнопка становится активной. Если массив пуст, кнопка становится неактивной
- 'set total' - Сеттер для установки общей стоимости товаров в корзине

#### Класс Order

Расширяет абстрактный класс Form и реализует интерфейс IOrder. Он управляет формой заказа в веб-приложении

Конструктор принимает 'container' (HTML-элемент формы) и events (экземпляр IEvents для управления событиями). В конструкторе инициализируются кнопки оплаты и устанавливаются обработчики событий для них:
 ```
constructor(protected blockName: string, container: HTMLFormElement, protected events: IEvents) 
 ```

Методы реализуемы в классе:
- 'set address' - Сеттер для установки адреса в соответствующем поле формы
- 'set email' - Сеттер для установки электронной почты в соответствующем поле формы
- 'set phone' - Сеттер для установки телефонного номера в соответствующем поле формы
- 'selected' - Метод для обработки выбора способа оплаты. Подсвечивает выбранную кнопку и генерирует событие 'order:change' с именем выбранного способа оплаты.

 ### Описание событий

Изменяет список товаров на странице:
```
'items:changed'
```

Закрывает модальное окно:
```
'modal:close'
```

Сообщает об успешной оплате:
```
'order:success'
```

Открывает модальное окно с описание товара: 
```
'card:select'
```

Добавляет товар в корзину и запрещает повторно выбирать товар (Отключая кнопку добавления товара):
```
'card:toBasket'
```

Открывает модальное окно с товарами в корзине:
```
'basket:open'
```

Удаляет товар из корзины:
```
'basket:delete'
```

Открывает модальное окно для оплаты: 
```
'basket:order'
```