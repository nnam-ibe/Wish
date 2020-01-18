const FetchWrapper = {
	post(url, data) {
		const options = {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			body: JSON.stringify(data)
		};

		return fetch(url, options);
	}
}

export default FetchWrapper;