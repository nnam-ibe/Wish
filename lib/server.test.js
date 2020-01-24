/**
 * @jest-environment node
 */

import axios from 'axios';
import { auth, firestore } from '../firebase-admin/config.js';
import server from './server.js';

jest.mock('../firebase-admin/config.js');
const hostname = 'http://localhost:5500/';

describe('Create Account', () => {
	it('should return valid', async () => {
		const account = {
			email: 'sample.email.com',
			password: 'sample.password',
			username: 'sample.username',
		};

		const res = await axios.post(`${hostname}api/create/account`, account);
		expect(res.data.valid).toBe(true);
	});
});

describe('Users Lists', () => {
	it('should create new list', async () => {
		const get = jest.fn().mockResolvedValueOnce({
			exists: true,
			data: jest.fn().mockReturnValue({
				activeLists: [],
			}),
		});
		const set = jest.fn().mockResolvedValueOnce();
		firestore.doc = jest.fn().mockReturnValue({ get, set });

		const res = await axios.post(`${hostname}api/create/new_list/uid`, { listName: 'Shopping' });
		expect(set.mock.calls.length).toBe(1);
	});

	it('should reject empty list name', async () => {
		const get = jest.fn().mockResolvedValueOnce({
			exists: true,
			data: jest.fn().mockReturnValue({
				activeLists: [],
			}),
		});
		const set = jest.fn().mockResolvedValueOnce();
		firestore.doc = jest.fn().mockReturnValue({ get, set });

		const res = await axios({
			method: 'post',
			url: `${hostname}api/create/new_list/uid`,
			data: { listName: '' },
			validateStatus(status) {
				return status === 400;
			},
		});
		expect(res.data.error).toBe('Name is invalid');
	});

	it('should reject already existing list', async () => {
		const get = jest.fn().mockResolvedValueOnce({
			exists: true,
			data: jest.fn().mockReturnValue({
				activeLists: ['Lists Exists'],
			}),
		});
		const set = jest.fn().mockResolvedValueOnce();
		firestore.doc = jest.fn().mockReturnValue({ get, set });

		const res = await axios({
			method: 'post',
			url: `${hostname}api/create/new_list/uid`,
			data: { listName: 'Lists Exists' },
			validateStatus(status) {
				return status === 400;
			},
		});
		expect(res.data.error).toBe('List already exists');
	});
});
