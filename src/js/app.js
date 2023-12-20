import TicketList from './TicketList';
import Popup from './Popup';
import ModalDeleteTask from './ModalDeleteTask';

const container = document.querySelector('.ticket-container');
const popup = new Popup();
popup.init();
const modal = new ModalDeleteTask();
modal.init();
const ticketList = new TicketList(container, popup, modal);
ticketList.init();
