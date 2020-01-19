/**
 * @jest-environment node
 */

import server from './server.js';
import axios from 'axios';

jest.mock('../firebase-admin/config.js');

describe('Create Account', () => {
	it('should return valid', async () => {
		const account = {
			email: 'sample.email.com',
			password: 'sample.password',
			username: 'sample.username'
		};

		const res = await axios.post('http://127.0.0.1:5500/api/create/account', account);
		expect(res.data.valid).toBe(true);
	});
});