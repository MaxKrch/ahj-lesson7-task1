const connection = async (dataReq) => {
	const { method, req, body = null, id = null } = dataReq; 
	const optionReq = {
		method,
	};
	
	// let url = 'http://localhost:7070/';
	let url = 'https://ahj-lesson7-task1-backend-production.up.railway.app/';
	let queryString = `?req=${req}`;
	let bodyReq;

	if(method === 'GET') {
		if(id !== null) {
			queryString += `&id=${id}`
		}
	}

	if(method === 'POST') {
		optionReq.body = body;
	}
	
	url += queryString;
	

	try {
		const response = await fetch(url, optionReq);
		const data = await response.json();

		return data;
	} catch (err) {
		console.log(err)
	}
}

export { connection }