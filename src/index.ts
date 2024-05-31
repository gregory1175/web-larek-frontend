import { BasketItemView, BasketView } from './components/BasketItem';
import { BasketModel } from './components/BasketModel';
import { CatalogModel } from './components/CatalogModel';
import { ShopApi } from './components/ShopApi';
import { EventEmitter } from './components/base/events';
import { API_URL, CDN_URL } from './utils/constants';
import './scss/styles.scss';


// инициализация 
const api = new ShopApi(CDN_URL, API_URL);
const events = new EventEmitter()
const basketView = new BasketView(document.querySelector('.basket'));
const basketModel = new BasketModel(events);
const catalogModel = new CatalogModel(events)

// Позволяет собирать в функции или классы отдельные экраны
function renderBasket(items: string[]) {
    const itemElements = items.map(id => {
      const itemView = new BasketItemView(document.createElement('div'), events);
      itemView.render(catalogModel.getProduct(id));
      return itemView.container;
    });
  
    basketView.render({ items: itemElements });
  }

// рендер при изменении 
events.on('basket:change', (event: { items: string[] }) => {
    renderBasket(event.items)
});

// Во время действий изменяем модель 
events.on('ui:basket-add', (event: {id: string}) => {
    basketModel.add(event.id)
});

events.on('ui:basket-remove', (event: {id: string}) => {
    basketModel.add(event.id)
});

// загружаем изначальные данные и запускаем процессы 
api.getCatalog()
    .then(catalogModel.setItems.bind(catalogModel))
    .catch((err: Error) => console.log(err.message))