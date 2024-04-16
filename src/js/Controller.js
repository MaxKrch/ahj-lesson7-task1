import Render from './Render';
import { connection } from './connection'; 

export default class Controller {
	constructor(container) {
		this.container = document.querySelector(container);
		this.render = new Render(this.container);

		this.movingPositions = {
			startX: null,
			startY: null,
			startTop: null,
			startLeft: null,
		}

		this.init();
	}

	init() {
		this.addEventListeners();
		
		this.downloadListTickets()
	}

	addEventListeners() {
		this.render.addNewTicketListeners('click', this.byClickNewTicket.bind(this));
		this.render.addTicketsListeners('click', this.byClickTicketsList.bind(this));
		
		this.render.addModalMessBtnsListeners('click', this.byClickModalMessBtns.bind(this));

		this.render.addModalFormListeners('submit', this.bySubmitModalForm.bind(this));
		this.render.addModalFormBtnsListeners('click', this.byClickModalFormBtns.bind(this));
		
		this.render.addMouseListeners('down', this.byDownMouse.bind(this));
		this.render.addMouseListeners('move', this.byMoveMouse.bind(this));
		this.render.addMouseListeners('up',	this.byUpMouse.bind(this)); 

		this.render.addTouchListeners('start', this.byStartTouch.bind(this)); 
		this.render.addTouchListeners('move', this.byMoveTouch.bind(this)); 
		this.render.addTouchListeners('end', this.byEndTouch.bind(this)) 
	}

	async downloadListTickets() {
		const dataReq = {
			method: 'GET',
			req: 'allTickets'
		}
		
		const dataResp = await connection(dataReq);
		
		if(!dataResp?.success) {
			this.render.showMessage({
				title: "Что-то пошло не так!",
				text: "Обновить список тикетов?",
				type: "error",
				id: null,
				form: false
			})
			return;
		}

		this.render.updateTicketsList(dataResp.data);
		this.render.clearForm();
		this.render.hideForm();
	}

	async downloadTicket(id) {
		const dataReq = {
			method: 'GET',
			req: 'ticketById',
			id
		}

		const dataResp = await connection(dataReq);

		if(!dataResp?.success) {
			this.render.showMessage({
				title: "Что-то пошло не так!",
				text: "Обновить список тикетов?",
				type: 'error',
				id: null,
				form: false
			})
			return;
		}

		return dataResp.data;
	}

	async uploadTicket() {
		const form = this.render.modalForm.form;
		const body = new FormData(form);
		const type = form.dataset.type;
		let req;
	
		if(type === "newTicket") {
			req = 'createTicket';
		}

		if(type === "updTicket") {
			req = 'updateTicket';
			body.append('id', form.dataset.id);
			body.append('status', this.render.modalForm.statusInp.checked)
		}
	
		const dataReq = {
			method: 'POST',
			req,
			body
		}

		const dataResp = await connection(dataReq);
	
		if(!dataResp?.success) {
			this.render.hideForm();
			this.render.showMessage({
				title: "Что-то пошло не так!",
				text: "Обновить список тикетов?",
				type: "error",
				id: null,
				form: true
			})
			return;
		}

		if(type === "newTicket") {
			this.render.addNewTicket(dataResp.data);
		}

		if(type === "updTicket") {
			this.render.updateTicket(dataResp.data)
		}
	
		this.render.clearForm();
		this.render.hideForm();
	}
	confirmDeleteTicket(target) {
		const messageConfRemove = this.render.createMessConfRemove(target);
		this.render.showMessage(messageConfRemove)
	}

	async deleteTicket(id) {
		const dataReq = {
			method: 'GET',
			req: 'deleteTicket',
			id
		}

		const dataResp = await connection(dataReq);
		if(!dataResp?.success) {
			this.render.showMessage({
				title: "Что-то пошло не так!",
				text: "Обновить список тикетов?",
				type: 'error',
				id: null,
				form: false
			})
			return;
		}

		return true;
	}

	chekTitleTicket() {
		if(this.render.modalForm.short.value.trim().length < 5) {
			this.render.showErrorForm('Описание тикета меньше 5 символов');
			return false;
		}
		return true;
	}

	byClickNewTicket(event) {
		this.render.modalForm.form.dataset.type = "newTicket";
		this.render.showForm();
	}

	byClickTicketsList(event) {
		const classes = event.target.classList;
		
		if(classes.contains('ticket__text-short')) {
			this.toggleFullTicket(event.target);
			return;
		}

		if(classes.contains('ticket__edit')) {
			this.loadTicketForEdit(event.target);
			return;
		}

		if(classes.contains('ticket__remove')) {
			this.confirmDeleteTicket(event.target);
			return;
		}
	}
	
	bySubmitModalForm() {
		if(!this.chekTitleTicket()) {
			return;
		}
		this.uploadTicket();
	}

	byClickModalFormBtns(event) {
		if(event.target.classList.contains('button__save')) {
			if(!this.chekTitleTicket()) {
				return;
			}
			this.uploadTicket();	
		}

		if(event.target.classList.contains('button__cancel')) {
			this.render.clearForm();
			this.render.hideForm();
		}
	}

	async byClickModalMessBtns(event) {
		const classes = event.target.classList;
		const type = this.render.modalMess.body.dataset.type;
		const id = this.render.modalMess.body.dataset.id;

		if(classes.contains('button__ok')) {
			if(type === 'remove') {
				const chek = await this.deleteTicket(id);
				if(chek) {
					this.render.removeTicket(id);
					this.render.hideMessage();
				}
				return;
			}

			if(type === 'error') {
				this.render.hideMessage();
				this.render.clearForm();

				this.downloadListTickets();
				return;
			}
		}

		if(classes.contains('button__cancel')) {
			if(type === 'remove') {
				this.render.hideMessage();
				return
			};

			if(type === 'error') {
				this.render.hideMessage();
				return;
			}
		}
	}

	byDownMouse(event) {
		if(!event.target.classList.contains('ticket__date')) {
			return;
		}

		const ticketLi = event.target.closest('li.ticket');

		this.movingPositions.startX = event.pageX;
		this.movingPositions.startY = event.pageY;

		this.startMovingTicket(ticketLi);
	}
	byMoveMouse(event) {
		if(!this.render.movingItems.moving) {
			return;
		}
		this.calcNewCoort(event.pageX, event.pageY);
		this.render.movingItems.moving.style.display = "none";

		const elementUnderCursor = document.elementFromPoint(event.pageX, event.pageY);

		const isWindowArea = elementUnderCursor || false;

		if(!isWindowArea && event.pageY > 0) {
			this.render.tickets.append(this.render.movingItems.blank);
		}

		if(isWindowArea) {
			const isTicket = elementUnderCursor.closest('li.ticket');
			if(isTicket) {
				if(!isTicket.classList.contains('selected')) {
					this.checkBlankItem(isTicket);
				}
			}
		}

		this.render.movingItems.moving.style.removeProperty("display");
	}

	byUpMouse(event) {
		if (!this.render.movingItems.moving) {
			return;
		}

		if (this.render.movingItems.blank) {
			this.replaceSelectedAndBlank();
			this.render.movingItems.blank.remove();
		}

		this.render.endingMoving();
		this.clearMovingPosition();
	}

	byStartTouch(event) {
		// console.log(event)
	}
	byMoveTouch(event) {
		// console.log(event)
	}
	byEndTouch(event) {
		// console.log(event)
	}

	async toggleFullTicket(ticket) {
		const id = ticket.dataset.id;
		const full = ticket.dataset.full

		if(full === 'hide') {
			const fullTicket = await this.downloadTicket(id);
		
			if(!fullTicket) {
				return;
			}
			this.render.showFullTicket(fullTicket);
			ticket.dataset.full = 'show';	
		}
		
		if(full === "show") {
			this.render.hideFullTicket(id);
			ticket.dataset.full = 'hide';
		}
	}

	async loadTicketForEdit(target) {
		const id = target.dataset.id;
		const fullTicket = await this.downloadTicket(id)
		
		this.render.addTicketToForm(fullTicket);
		this.render.showStatusInp();
		this.render.showForm();
	}

	startMovingTicket(ticket) {
		const activeTicket = this.render.cloningTicket(ticket);
		this.calcStartCoort(ticket, this.render.movingItems.moving);
		this.render.selectingTicket(ticket);
	}	

	calcStartCoort(ticket, movingItem) {
		const coord = ticket.getBoundingClientRect();

		const height = coord.height;
		const width = coord.width;
		const top = coord.top + window.pageYOffset;
		const left = coord.left + window.pageXOffset;

		this.movingPositions.startTop = top;
		this.movingPositions.startLeft = left;

		movingItem.style.height = `${height}px`;
		movingItem.style.width = `${width}px`;
		movingItem.style.top = `${top}px`;
		movingItem.style.left = `${left}px`;
	}

	calcNewCoort(pageX, pageY) {
		const shiftY = pageY - this.movingPositions.startY;
		const shiftX = pageX - this.movingPositions.startX;

		const newTop = this.movingPositions.startTop + shiftY;
		const newLeft = this.movingPositions.startLeft + shiftX;

		this.render.moveTicket(newTop, newLeft)

	}

	checkBlankItem(ticket) {
		if(!this.render.movingItems.blank) {
			this.render.createBlankItem()
		}

		const previeTicket = ticket.previousSibling;
		const nexTicket = ticket.nextSibling;
	
		

		if(previeTicket && previeTicket.classList.contains('blank-ticket')) {
			return;
		}

		this.render.tickets.insertBefore(this.render.movingItems.blank, ticket)
	}

	replaceSelectedAndBlank() {
		const { blank, selected } = this.render.movingItems;
	
		this.render.tickets.replaceChild(selected, blank);
	}

	clearMovingPosition() {
		this.movingPositions = {
			startTop: null,
			startLeft: null,
			startY: null,
			startX: null,
		};
	}
} 