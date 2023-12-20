import createRequest from './createRequest';

const URL = 'http://localhost:3000/';

export default class TicketService {
  static getAllTickets(callback) {
    createRequest({
      method: 'GET',
      query: 'method=allTickets',
      host: URL,
      callback,
    });
  }

  static getDescription(id, callback) {
    createRequest({
      method: 'GET',
      query: 'method=ticketById&id=',
      host: URL,
      callback,
      id,
    });
  }

  static deleteTicket(ticketId, callback) {
    createRequest({
      method: 'GET',
      query: 'method=deleteById&id=',
      host: URL,
      callback,
      id: ticketId,
    });
  }

  static updateTicket(ticket, callback) {
    createRequest({
      method: 'POST',
      query: 'method=updateById&id=',
      host: URL,
      callback,
      id: ticket.id,
      body: ticket,
    });
  }

  static createTicket(ticket, callback) {
    createRequest({
      method: 'POST',
      query: 'method=createTicket',
      host: URL,
      callback,
      body: ticket,
    });
  }
}
