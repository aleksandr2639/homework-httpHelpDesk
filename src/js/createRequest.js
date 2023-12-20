import Ticket from "./Ticket";

const createRequest = (options = {}) => {
  if (
    !options.method
    || !options.query
    || !options.host
    || !options.callback
  ) {
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

const createArrayTickets = (data) => data.map((el) => new Ticket(el));

export default createRequest;
