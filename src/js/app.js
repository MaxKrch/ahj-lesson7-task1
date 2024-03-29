const form = document.querySelector('form');
const input = form.querySelector('input');
const message = document.querySelector('div');

form.addEventListener('submit', event => {
	event.preventDefault();
	testServer();
})

const testServer = async () => {
	const value = input.value.trim() || "Boo!";
	const text = JSON.stringify({
		message: value
	});
	const url = 'https://ahj-lesson7-task1-backend-production.up.railway.app/'
	
	const optionReq = {
		method: 'POST',
		headers: {'Content-Type': 'application/json'},
		body: text,
	}

	const response = await fetch(url, optionReq);
	const mes = await response.text();

	message.textContent = mes;
}
