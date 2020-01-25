exports.auth = () => ({
	createUser: jest.fn().mockResolvedValueOnce({ uid: 'sampleuid' }),
});

exports.firestore = {
	doc(url) {
		const lastIndex = url.lastIndexOf('/');
		const uid = url.slice(lastIndex + 1);
		let activeLists = [];
		let exists = true;

		switch (uid) {
		case 'listExists':
			activeLists = ['List Exists'];
			break;
		default:
			break;
		}

		const res = {
			exists,
			data: jest.fn().mockReturnValue({ activeLists }),
		};
		return {
			get: jest.fn().mockResolvedValue(res),
			set: jest.fn().mockResolvedValueOnce({}),
		};
	},
};
