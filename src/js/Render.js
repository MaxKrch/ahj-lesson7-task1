import moment from "moment";

export default class Render {
	constructor(container) {
		this.container = container;

		this.page = {}
		this.modalForm = {};
		this.modalMess = {};

		this.newTicket;
		this.tickets;

		this.newTicketListeners = {
			click: [],
		}

		this.ticketsListeners = {
			click: [],
		}

		this.modalFormListeners = {
			submit: [],
		}

		this.modalFormBtnsListeners = {
			click: [],
		}

		this.modalMessBtnsListeners = {
			click: [],
		}

		this.movingItems = {
			selected: null,
			moving: null,
			blank: null,
		}

		this.mouseListeners = {
			down: [],
			move: [],
			up: [],
		}

		this.touchListeners = {
			start: [],
			move: [],
			end: [],
		}

		this.init();
	}

	init() {
		this.renderPage();
		this.registerEvent();
	}

	renderPage() {
		const header = this.renderHeader();
		this.page.header = header;
		this.container.append(header);

		const main = this.renderMain();
		this.page.main = main;
		this.container.append(main);

		const modal = this.renderModal();
		this.page.modal = modal;
		this.container.append(modal);
	}

	registerEvent() {
		this.newTicket.addEventListener('click', event => {
			this.newTicketListeners.click.forEach(item => item(event));
		});

		this.tickets.addEventListener('click', event => {
			this.ticketsListeners.click.forEach(item => item(event));
		});

		this.modalForm.form.addEventListener('submit', event => {
			event.preventDefault();
			this.modalFormListeners.submit.forEach(item => item(event));
		});
	
		this.modalForm.btns.addEventListener('click', event => {
			event.preventDefault();
			this.modalFormBtnsListeners.click.forEach(item => item(event));
		});

		this.modalMess.btns.addEventListener('click', event => {
			event.preventDefault();
			this.modalMessBtnsListeners.click.forEach(item => item(event));
		});

		document.addEventListener('mousedown', event => {
			this.mouseListeners.down.forEach(item => item(event));
		});
		document.addEventListener('mousemove', event => {
			this.mouseListeners.move.forEach(item => item(event));
		});
		document.addEventListener('mouseup', event => {
			this.mouseListeners.up.forEach(item => item(event));
		});

		document.addEventListener('touchstart', event => {
			this.touchListeners.start.forEach(item => item(event));
		});
		document.addEventListener('touchmove', event => {
			this.touchListeners.move.forEach(item => item(event));
		});
		document.addEventListener('touchend', event => {
			this.touchListeners.end.forEach(item => item(event));
		});
	}

	updateTicketsList(tickets) {
		if(!tickets) {
			return;
		} 
		
		this.tickets.innerHTML = '';

		for(let ticket of tickets) {
			const newTicket = this.renderTicket(ticket);
			this.tickets.append(newTicket);
		}
	}

	addNewTicket(ticket) {
		const newTicket = this.renderTicket(ticket);
		this.tickets.prepend(newTicket);
	}

	updateTicket(ticket) {
		const { id, short, status } = ticket;
		const ticketLi = this.tickets.querySelector(`.ticket[data-id="${id}"]`);

		const statusCont = ticketLi.querySelector('.ticket__status-chek');
		const shortCont = ticketLi.querySelector('.ticket__text-short');

		statusCont.checked = status;
		shortCont.dataset.full = 'hide';
		shortCont.textContent = short;

	}

	renderHeader() {
		const header = document.createElement('header');
		header.classList.add('container', 'header');

		header.innerHTML = `
			<div class="button div-button add-ticket-button">
				New Ticket
			</div>
		`
		this.addHeaderEl(header);

		return header;
	}

	renderMain() {
		const main = document.createElement('main');
		main.classList.add('container', 'main');

		const ticketList = this.renderTicketList();
		main.append(ticketList);	
		
		this.addMainEl(main);

		return main;
	}

	addHeaderEl(header) {
		const newTicket = header.querySelector('.add-ticket-button');
		this.newTicket = newTicket;
	}

	renderTicketList() {
		const tickets = document.createElement('article');
		tickets.classList.add('tickets-all');
		tickets.innerHTML = `
			<ul class="tickets-list">
			</ul>
		`

		return tickets;
	}
	renderModal() {
		const modal = document.createElement('aside');
		modal.classList.add('modal', 'hidden-item');
		
		const modalForm = this.renderModalForm();
		const modalMessage = this.renderModalMessage();

		modal.append(modalForm);
		modal.append(modalMessage);

		this.addModalEl(modal);

		return modal;
	}

	renderModalForm() {
		const modalForm = document.createElement('form');
		modalForm.classList.add('modal-body', 'fullticket__form', 'hidden-item')
		modalForm.dataset.id='';
		modalForm.dataset.type='';
				
		modalForm.innerHTML = `
			<label for="short" class="fullticket__label fullticket__label-short">
				<p class="fullticket__text fullticket__text-short">
					Краткое описание:
				</p>	 
				<input id="short" type="text" class="fullticket__input fullticket__input-short" name="short" placeholder="Short Description" required="true">
			</label>

			<div class="fullticket__error"></div>
			
			<label for="description" class="fullticket__label fullticket__label-description">
				<p class="fullticket__text fullticket__text-description">
						Подробное описание:
				</p>
				<textarea id="description" type="text" class="fullticket__input fullticket__input-description" name="description" placeholder="Detailed Description Ticket"></textarea>
			</label>

			<label for="status" class="fullticket__label fullticket__label-status">
				<p class="fullticket__text fullticket__status-description">Завершено: </p>
				<div class="fullticket__status-field">
					<p class="fullticket__status-icon">
						&#10004
					</p>
				</div>
				<input id="status" type="checkbox" class="fullticket__input fullticket__input-status hidden-item">
			</label>
			
			<div class="buttons form-buttons">
				<button class="button button-modal button__save">
					Save
				</button>
				<button class="button button-modal button__cancel">
					Cancel
				</button>
			</div>
		`
		return modalForm;
	}

	renderModalMessage() {
		const modalMessage = document.createElement('div');
		modalMessage.classList.add('modal-body', 'message-body', 'hidden-item');
		modalMessage.dataset.action;
		modalMessage.dataset.id;
		modalMessage.innerHTML = `
			<div class="message__text">
				<div class="message__text-title">
					Что-то пошло не так
				</div>
				<div class="message__text-descr">
					Обновить список тикетов?
				</div>
			</div>

			<div class="buttons message__buttons">
				<button data-action="" data-id="" class="button button-modal button__ok">
					Ok
				</button>
				<button data-action="" data-id="" class="button button-modal button__cancel">
					Cancel
				</button>
			</div>
		`
		return modalMessage
	}

	addMainEl(main) {
		const tickets = main.querySelector('ul.tickets-list');
		this.tickets = tickets;

	}

	addModalEl(modal) {
		const form = modal.querySelector('form.fullticket__form');
		const formShort = form.querySelector('input.fullticket__input-short');
		const formError = form.querySelector('.fullticket__error');
		const formDescr = form.querySelector('textarea.fullticket__input-description');
		const formStatus = form.querySelector('.fullticket__label-status');
		const formStatusInp = form.querySelector('.fullticket__input-status');
		const formBtns = form.querySelector('.form-buttons')
		
		this.modalForm.form = form;
		this.modalForm.short = formShort;
		this.modalForm.error = formError;
		this.modalForm.descr = formDescr;
		this.modalForm.status = formStatus;
		this.modalForm.statusInp = formStatusInp;
		this.modalForm.btns = formBtns;

		const mess = modal.querySelector('.message-body');
		const messTitle = mess.querySelector('.message__text-title')
		const messText = mess.querySelector('.message__text-descr')
		const messBtns = mess.querySelector('.message__buttons')

		this.modalMess.body = mess;
		this.modalMess.title = messTitle;
		this.modalMess.text = messText;
		this.modalMess.btns = messBtns;
	}

	renderTicket(ticket) {
		const ticketLi = document.createElement('li');
		ticketLi.classList.add('ticket');
		ticketLi.dataset.id = ticket.id;

		const timeCreated = moment(ticket.created).locale('ru').format('DD.MM.YY HH:mm');
		const id = ticket.id; 
		const isChecked = ticket.status ? "checked" : "";

		ticketLi.innerHTML = `
			<div class="ticket-main">
				<label class="ticket__block ticket__status"> 
					<div class="ticket__status-text" data-id="${id}">
						&#10004;
					</div>
					<input type="checkbox" class="ticket__status-chek hidden-item" ${isChecked}>
				</label>
				<div class="ticket__block ticket__text">
					<div class="ticket__text-short" data-id="${id}" data-full="hide">
						${ticket.short}
					</div>
				</div>
			
				<div class="ticket__block ticket__date"> 
					${timeCreated}
				</div>
			
				<div class="ticket__block ticket__buttons">
					<div class="ticket__button ticket__edit" data-id="${id}">
						&#9998;
					</div>
					<div class="ticket__button ticket__remove" data-id="${id}">
						&#10006;
					</div>
				</div>
			</div>
			
			<div class="ticket__text-description hidden-item" data-id="${id}">
			</div>
		`
		return ticketLi;
	}

	showMessage(message) {

		if(this.modalMess.body.dataset.modal === true) {
			this.hideForm();
		}
		this.modalMess.body.dataset.modal = message.form;
		this.modalMess.body.dataset.type = message.type;
		this.modalMess.body.dataset.id = message.id;
		this.modalMess.title.textContent = message.title;
		this.modalMess.text.textContent = message.text;

		document.body.classList.add('no-scroll');
		this.page.modal.classList.remove('hidden-item');
		this.modalMess.body.classList.remove('hidden-item');
	}

	clearMessage() {
		this.modalMess.body.dataset.modal = '';
		this.modalMess.body.dataset.type = '';
		this.modalMess.body.dataset.id = '';
		this.modalMess.title.textContent = '';
		this.modalMess.text.textContent = '';
	}

	hideMessage() {
		if(this.modalMess.body.dataset.modal === true) {
			this.showForm();
		}
		this.clearMessage()

		document.body.classList.remove('no-scroll');
		this.page.modal.classList.add('hidden-item');
		this.modalMess.body.classList.add('hidden-item');

	}

	showErrorForm(message) {
		if(this.modalForm.idError) {
			clearTimeout(this.modalForm.idError)
		};

		this.modalForm.error.textContent = message;
		this.modalForm.idError = setTimeout(() => {
			this.hideErrorForm();
		}, 3000);
	}

	hideErrorForm() {
		this.modalForm.error.textContent = '';
	}

	showForm(ticket = null) {
		if(ticket) {
			this.addTicketToForm(ticket);
		}

		document.body.classList.add('no-scroll');
		this.page.modal.classList.remove('hidden-item');
		this.modalForm.form.classList.remove('hidden-item');
	}

	addTicketToForm(ticket) {
		const { id, description } = ticket;
		const ticketLi = this.tickets.querySelector(`.ticket[data-id="${id}"]`);
		const short = ticketLi.querySelector('.ticket__text-short').textContent;
		const status = ticketLi.querySelector('.ticket__status-chek').checked;

		this.modalForm.form.dataset.type = "updTicket";
		this.modalForm.form.dataset.id = id;
		this.modalForm.short.value = short.trim();
		this.modalForm.statusInp.checked = status;
		this.modalForm.descr.value = description.trim();
	}

	clearForm() {
		this.modalForm.form.dataset.id = '';
		this.modalForm.form.dataset.type='';
		this.modalForm.short.value = '';
		this.modalForm.descr.value = '';
		this.hideStatusInp();
		this.modalForm.statusInp.checked = false;
	}

	showStatusInp() {
		this.modalForm.status.classList.remove('hidden-item');
	}

	hideStatusInp() {
		this.modalForm.status.classList.add('hidden-item');
	}

	hideForm() {
		document.body.classList.remove('no-scroll');
		this.page.modal.classList.add('hidden-item');
		this.modalForm.form.classList.add('hidden-item');
	}

	showFullTicket(ticket) {
		const id = ticket.id;
		const fullDescr = this.tickets.querySelector(`.ticket__text-description[data-id="${id}"]`);

		fullDescr.innerHTML = ticket.description;
		fullDescr.classList.remove('hidden-item');
	}

	hideFullTicket(id) {
		const fullDescr = this.tickets.querySelector(`.ticket__text-description[data-id="${id}"]`);

		fullDescr.classList.add('hidden-item');
	}

	createMessConfRemove(target) {
		const ticketLi = target.closest('li.ticket');
		const id = ticketLi.dataset.id;
		const text = ticketLi.querySelector('.ticket__text-short').textContent.trim();

		const mess = {
		 	title: "Удалить этот тикет для всех?",
		 	text,
		 	id,
		 	type: "remove",
		 	form: false
		}

		return mess;
	}

	removeTicket(id) {
		const ticketLi = this.tickets.querySelector(`.ticket[data-id="${id}"]`);

		ticketLi.remove();
	}

	cloningTicket(ticket) {
		const clone = ticket.cloneNode(true);
		clone.classList.add("moving");

		document.body.append(clone);
		this.movingItems.moving = clone;
		this.movingItems.selected = ticket;

		return clone;
	}
	selectingTicket(ticket) {
		ticket.classList.add("selected");
	}
	
	moveTicket(top, left) {
		this.movingItems.moving.style.top = `${top}px`;
		this.movingItems.moving.style.left = `${left}px`;
	}

	createBlankItem() {
		const blankTicket = document.createElement('li');
		blankTicket.classList.add('ticket', 'blank-ticket');

		const sizes = this.movingItems.selected.getBoundingClientRect();

		const height = sizes.height;
		const width = sizes.width;
		blankTicket.style.height = `${height}px`;
		blankTicket.style.width = `${width}px`
		
		this.movingItems.blank = blankTicket;	
		this.movingItems.selected.classList.add('hidden-item');
	}

	addMouseListeners(field, callback) {
		this.mouseListeners[field].push(callback);
	}
	addTouchListeners(field, callback) {
		this.touchListeners[field].push(callback);
	}
	addNewTicketListeners(field, callback) {
		this.newTicketListeners[field].push(callback);
	}
	addTicketsListeners(field, callback) {
		this.ticketsListeners[field].push(callback);
	}
	addModalFormListeners(field, callback) {
		this.modalFormListeners[field].push(callback);
	}
	addModalFormBtnsListeners(field, callback) {
		this.modalFormBtnsListeners[field].push(callback);
	}
	addModalMessBtnsListeners(field, callback) {
		this.modalMessBtnsListeners[field].push(callback);
	}

	endingMoving() {
		this.movingItems.moving.remove();
		this.movingItems.selected.classList.remove("selected", "hidden-item");

		this.movingItems = {
			selected: null,
			moving: null,
			blank: null,
		};
	}
}

