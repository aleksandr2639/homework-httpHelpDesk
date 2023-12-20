/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/js/Ticket.js

class Ticket {
  constructor(obj) {
    this.id = obj.id;
    this._name = obj.name;
    this.status = obj.status;
    this._description = obj.description;
    this._created = obj.created;
    this.element = null;
    this.checkbox = null;
    this.nameWrapper = null;
    this.nameTicket = null;
    this.createdEl = null;
    this.descriptionElement = null;
    this.descriptionIsOpen = false;
    this.init();
  }
  init() {
    this.drawUI();
    this.onChangeStatus();
    this.onClickNameTicket();
    this.onClickButtonModify();
    this.onClickButtonDelete();
  }
  drawUI() {
    const date = new Date(this.created);
    this.element = document.createElement('div');
    this.element.classList.add('ticket');
    this.element.innerHTML = `
    <div class='checkbox-container'>
      <label class='checkbox-label'>
        <input type="checkbox" class="checkbox">
      </label>
    </div>
    <div class='ticket-name-wrapper'>
      <div class='ticket-name'></div>
      <div class='ticket-description'></div>
    </div>
    <div class='date'>${date.toLocaleDateString()} ${date.toLocaleTimeString()}</div>
    <button class='ticket-button ticket-button-modify'></button>
    <button class='ticket-button ticket-button-delete'></button>`;
    this.checkbox = this.element.querySelector('.checkbox');
    this.checkbox.checked = this.status;
    this.nameWrapper = this.element.querySelector('.ticket-name-wrapper');
    this.nameTicket = this.element.querySelector('.ticket-name');
    this.descriptionElement = this.nameWrapper.querySelector('.ticket-description');
    this.nameTicket.textContent = this.name;
  }
  onClickButtonModify() {
    this.element.querySelector('.ticket-button-modify').addEventListener('click', e => {
      e.preventDefault();
      this.editHandler(this);
    });
  }
  onClickButtonDelete() {
    this.element.querySelector('.ticket-button-delete').addEventListener('click', e => {
      e.preventDefault();
      this.removeHandler(this);
    });
  }
  onChangeStatus() {
    this.checkbox.addEventListener('change', e => {
      e.preventDefault();
      if (!this.status) {
        this.status = true;
        this.checkbox.checked = true;
      } else {
        this.status = false;
        this.checkbox.checked = false;
      }
      this.changeStatusHandler({
        id: this.id,
        name: this.name,
        status: this.status,
        description: this.description,
        created: this.created
      });
    });
  }
  onClickNameTicket() {
    this.nameWrapper.addEventListener('click', () => {
      if (!this.id) {
        return;
      }
      if (!this.descriptionIsOpen) {
        TicketService.getDescription(this.id, fullDescription => {
          this.fullDescription = fullDescription.trim();
          this.renderDescription();
          this.descriptionIsOpen = true;
        });
      } else {
        this.deleteDescription();
        this.descriptionIsOpen = false;
      }
    });
  }
  renderDescription() {
    if (!this.fullDescription) {
      return;
    }
    this.descriptionElement.classList.add('open-description');
    this.descriptionElement.textContent = this.fullDescription;
  }
  deleteDescription() {
    if (this.descriptionElement) {
      this.descriptionElement.classList.remove('open-description');
    }
  }
  set name(value) {
    this._name = value;
    this.nameTicket.textContent = value;
  }
  get name() {
    return this._name;
  }
  set description(value) {
    this._description = value;
  }
  get description() {
    return this._description;
  }
  set created(value) {
    this._created = value;
    this.createdEl.textContent = value;
  }
  get created() {
    return this._created;
  }
}
;// CONCATENATED MODULE: ./src/js/createRequest.js

const createRequest = (options = {}) => {
  if (!options.method || !options.query || !options.host || !options.callback) {
    return;
  }
  const url = `${options.host}?${options.query}${options.id ? options.id : ''}`;
  const xhr = new XMLHttpRequest();
  xhr.addEventListener('load', () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      try {
        const data = xhr.response ? JSON.parse(xhr.response) : '';
        switch (options.query) {
          case 'method=allTickets':
          case 'method=updateById&id=':
            options.callback(createArrayTickets(data));
            break;
          case 'method=ticketById&id=':
            options.callback(data.description);
            break;
          case 'method=createTicket':
            options.callback(data);
            break;
          case 'method=deleteById&id=':
            if (xhr.status === 204) {
              options.callback(true);
            } else {
              options.callback(false);
            }
        }
      } catch (e) {
        console.error(e);
      }
    }
  });
  xhr.open(options.method, url);
  xhr.send(options.body ? JSON.stringify(options.body) : '');
};
const createArrayTickets = data => data.map(el => new Ticket(el));
/* harmony default export */ const js_createRequest = (createRequest);
;// CONCATENATED MODULE: ./src/js/TicketService.js

const URL = 'http://localhost:3000/';
class TicketService {
  static getAllTickets(callback) {
    js_createRequest({
      method: 'GET',
      query: 'method=allTickets',
      host: URL,
      callback
    });
  }
  static getDescription(id, callback) {
    js_createRequest({
      method: 'GET',
      query: 'method=ticketById&id=',
      host: URL,
      callback,
      id
    });
  }
  static deleteTicket(ticketId, callback) {
    js_createRequest({
      method: 'GET',
      query: 'method=deleteById&id=',
      host: URL,
      callback,
      id: ticketId
    });
  }
  static updateTicket(ticket, callback) {
    js_createRequest({
      method: 'POST',
      query: 'method=updateById&id=',
      host: URL,
      callback,
      id: ticket.id,
      body: ticket
    });
  }
  static createTicket(ticket, callback) {
    js_createRequest({
      method: 'POST',
      query: 'method=createTicket',
      host: URL,
      callback,
      body: ticket
    });
  }
}
;// CONCATENATED MODULE: ./src/js/TicketList.js

class TicketList {
  constructor(container, popup, modal) {
    this.container = container;
    this.popup = popup;
    this.modal = modal;
    this.btnAddElement = null;
    this.containerElement = null;
    this.drawUI();
    this.updateTicket = this.updateTicket.bind(this);
    this.popup.onSubmitHandler = this.updateTicket;
    this.editTicket = this.editTicket.bind(this);
    this.deleteTicket = this.deleteTicket.bind(this);
  }
  init() {
    this.onClickButtonAdd();
    TicketService.getAllTickets(tickets => {
      this.tickets = tickets;
      this.tickets.forEach(ticket => this.initTicket(ticket));
      this.renderTickets();
    });
  }
  drawUI() {
    const btnADD = document.createElement('button');
    btnADD.classList.add('new-ticket-btn-add');
    btnADD.textContent = 'Добавить тикет';
    const listTickets = document.createElement('div');
    listTickets.classList.add('list-tickets');
    this.container.append(btnADD);
    this.container.append(listTickets);
    this.containerElement = this.container.querySelector('.list-tickets');
    this.btnAddElement = this.container.querySelector('.new-ticket-btn-add');
  }
  onClickButtonAdd() {
    this.btnAddElement.addEventListener('click', e => {
      e.preventDefault();
      this.popup.show();
    });
  }
  initTicket(ticket) {
    ticket.changeStatusHandler = this.updateTicket;
    ticket.removeHandler = this.deleteTicket;
    ticket.editHandler = this.editTicket;
  }
  renderTicket(ticket) {
    this.containerElement.appendChild(ticket.element);
  }
  deleteTicket(ticket) {
    this.modal.show(() => {
      TicketService.deleteTicket(ticket.id, res => {
        if (res) {
          this.init();
        }
      });
    });
  }
  renderTickets() {
    this.clear();
    this.tickets.forEach(ticket => {
      this.renderTicket(ticket);
    });
  }
  clear() {
    [...this.containerElement.children].forEach(el => el.remove());
  }
  editTicket(ticket) {
    this.popup.show(ticket);
  }
  updateTicket(ticket) {
    if (ticket.id) {
      TicketService.updateTicket(ticket, tickets => {
        this.tickets = tickets;
        this.tickets.forEach(ticket => this.initTicket(ticket));
        this.renderTickets();
      });
    } else {
      TicketService.createTicket(ticket, newTicket => {
        if (newTicket) {
          this.init();
        }
      });
    }
  }
}
;// CONCATENATED MODULE: ./src/js/Popup.js
class Popup {
  constructor() {
    this.popup = null;
    this.name = null;
    this.description = null;
    this.title = null;
  }
  init() {
    this.drawUI();
    this.onClickSave();
    this.onClickCancel();
  }
  drawUI() {
    this.popup = document.createElement('form');
    this.popup.classList.add('popup-container');
    this.popup.innerHTML = `<h3 class="popup-container-title">Изменить тикет</h3>
    <label for="name">Краткое описание</label>
    <input type="text" id="name" name="name" class="input popup-name" required>
    <label for="description">Подробное описание</label>
    <textarea id="description" name="description" class="input popup-description"></textarea>
    </div>
    <div class="popup-buttons">
      <button  class="popup-button-item popup-button-item-cancel">Отмена</button>
      <button  class="popup-button-item popup-button-item-save">Сохранить</button>
    </div>`;
    document.querySelector('body').append(this.popup);
    this.name = this.popup.querySelector('.popup-name');
    this.description = this.popup.querySelector('.popup-description');
    this.title = this.popup.querySelector('.popup-container-title');
  }
  onClickSave() {
    this.popup.querySelector('.popup-button-item-save').addEventListener('click', e => {
      e.preventDefault();
      if (!this.ticket) {
        this.ticket = {};
        this.ticket.id = null;
        this.ticket.status = false;
      }
      this.ticket.name = this.name.value;
      this.ticket.description = this.description.value;
      this.ticket.created = Date.now();
      this.onSubmitHandler(this.ticket);
      this.hide();
    });
  }
  onClickCancel() {
    this.popup.querySelector('.popup-button-item-cancel').addEventListener('click', e => {
      e.preventDefault();
      this.hide();
    });
  }
  show(ticket = null) {
    this.ticket = {};
    if (ticket) {
      this.ticket.id = ticket.id;
      this.ticket.name = ticket.name;
      this.ticket.status = ticket.status;
      this.ticket.description = ticket.description;
      this.ticket.created = ticket.created;
      this.title.textContent = 'Изменить тикет';
    } else {
      this.ticket = ticket;
      this.title.textContent = 'Добавить тикет';
    }
    this.name.value = ticket ? ticket.name : '';
    this.description.value = ticket ? ticket.description : '';
    this.popup.classList.add('open');
  }
  hide() {
    this.ticket = null;
    this.name.value = '';
    this.description.value = '';
    this.popup.classList.remove('open');
  }
}
;// CONCATENATED MODULE: ./src/js/ModalDeleteTask.js
class ModalDeleteTask {
  constructor() {
    this.modal = null;
  }
  init() {
    this.drawUI();
    this.onClickButtonCancel();
    this.onClickButtonOkay();
  }
  drawUI() {
    this.modal = document.createElement('div');
    this.modal.classList.add('modal-delete-container');
    this.modal.innerHTML = `
    <h3 class="modal-delete-title">Удалить тикет</h3>
    <p class="modal-delete-text">Вы уверены, что хотите удалить тикет? Это действие не обратимо.</p>
    <div class="modal-delete-buttons">
      <button class="modal-button modal-delete-button-cancel">Отмена</button>
      <button class="modal-button modal-delete-button-okay">Ок</button>
    </div>`;
    document.querySelector('body').append(this.modal);
  }
  onClickButtonCancel() {
    this.buttonCancel = this.modal.querySelector('.modal-delete-button-cancel').addEventListener('click', e => {
      e.preventDefault();
      this.modal.classList.remove('open');
    });
  }
  onClickButtonOkay() {
    this.modal.querySelector('.modal-delete-button-okay').addEventListener('click', e => {
      e.preventDefault();
      this.modal.classList.remove('open');
      this.callback();
    });
  }
  show(callback) {
    this.callback = callback;
    this.modal.classList.add('open');
  }
}
;// CONCATENATED MODULE: ./src/js/app.js



const container = document.querySelector('.ticket-container');
const popup = new Popup();
popup.init();
const modal = new ModalDeleteTask();
modal.init();
const ticketList = new TicketList(container, popup, modal);
ticketList.init();
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;