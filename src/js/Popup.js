export default class Popup {
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
    this.popup.querySelector('.popup-button-item-save').addEventListener('click', (e) => {
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
    this.popup.querySelector('.popup-button-item-cancel').addEventListener('click', (e) => {
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
