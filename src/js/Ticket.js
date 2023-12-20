import TicketService from './TicketService';

export default class Ticket {
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
    this.element.querySelector('.ticket-button-modify').addEventListener('click', (e) => {
      e.preventDefault();
      this.editHandler(this);
    });
  }

  onClickButtonDelete() {
    this.element.querySelector('.ticket-button-delete').addEventListener('click', (e) => {
      e.preventDefault();
      this.removeHandler(this);
    });
  }

  onChangeStatus() {
    this.checkbox.addEventListener('change', (e) => {
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
        created: this.created,
      });
    });
  }

  onClickNameTicket() {
    this.nameWrapper.addEventListener('click', () => {
      if (!this.id) {
        return;
      }
      if (!this.descriptionIsOpen) {
        TicketService.getDescription(this.id, (fullDescription) => {
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
