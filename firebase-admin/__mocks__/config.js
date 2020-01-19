exports.auth = () => {
	return {
		createUser: jest.fn().mockResolvedValueOnce({ uid: 'sampleuid' })
	};
};

exports.firestore = {
	doc() {
		return {
			get: jest.fn(),
			set: jest.fn().mockResolvedValueOnce({})
		};
	}
};