export default class ModalDeleteTask {
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
    this.buttonCancel = this.modal.querySelector('.modal-delete-button-cancel').addEventListener('click', (e) => {
      e.preventDefault();
      this.modal.classList.remove('open');
    });
  }

  onClickButtonOkay() {
    this.modal.querySelector('.modal-delete-button-okay').addEventListener('click', (e) => {
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
