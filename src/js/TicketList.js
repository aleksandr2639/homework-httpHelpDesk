import TicketService from './TicketService';

export default class TicketList {
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
    TicketService.getAllTickets((tickets) => {
      this.tickets = tickets;
      this.tickets.forEach((ticket) => this.initTicket(ticket));
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
    this.btnAddElement.addEventListener('click', (e) => {
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
      TicketService.deleteTicket(ticket.id, (res) => {
        if (res) {
          this.init();
        }
      });
    });
  }

  renderTickets() {
    this.clear();
    this.tickets.forEach((ticket) => {
      this.renderTicket(ticket);
    });
  }

  clear() {
    [...this.containerElement.children].forEach((el) => el.remove());
  }

  editTicket(ticket) {
    this.popup.show(ticket);
  }

  updateTicket(ticket) {
    if (ticket.id) {
      TicketService.updateTicket(ticket, (tickets) => {
        this.tickets = tickets;
        this.tickets.forEach((ticket) => this.initTicket(ticket));
        this.renderTickets();
      });
    } else {
      TicketService.createTicket(ticket, (newTicket) => {
        if (newTicket) {
          this.init();
        }
      });
    }
  }
}
