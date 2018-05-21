module.exports = {
	put: (url, data) => {
		const options = {
			method: 'POST',
			headers: new Headers({ 'Content-Type': 'application/json' }),
			body: JSON.stringify(data)
		};

		return new Promise((resolve, reject) => {
			fetch(url, options)
				.then((response) => {
					resolve(response)
				})
				.catch((err) => {
					reject(err)
				});
		});
	}
}