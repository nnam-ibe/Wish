/**
 * @jest-environment node
 */

import supertest from 'supertest';
import server from './server';

jest.mock('../firebase-admin/config.js');
const request = supertest('http://localhost:5500');

afterAll(() => {
	server.close();
});

describe('Create Account', () => {
	it('should return valid', () => {
		const account = {
			email: 'sample.email.com',
			password: 'sample.password',
			username: 'sample.username',
		};

		return request
			.post('/api/create/account')
			.send(account)
			.expect(200)
			.then((res) => {
				expect(res.body.valid).toBe(true);
			});
	});
});

describe('Users Lists', () => {
	it('should create new list', () => {
		const data = {
			uid: 'invalidListName',
			listName: 'Shopping',
		};
		return request
			.post('/api/create/new_list/uid')
			.send(data)
			.expect(200)
			.then((res) => {
				expect(res.body.valid).toBe(true);
			});
	});

	it('should reject empty list name', () => {
		const data = {
			uid: 'invalidListName',
			listName: '',
		};
		return request
			.post('/api/create/new_list/invalidListName')
			.send(data)
			.expect(400)
			.then((res) => {
				expect(res.body.error).toBe('Name is invalid');
			});
	});

	it('should reject already existing list', () => {
		const data = {
			uid: 'listExists',
			listName: 'List Exists',
		};
		return request
			.post('/api/create/new_list/listExists')
			.send(data)
			.expect(400)
			.then((res) => {
				expect(res.status).toBe(400);
				expect(res.body.error).toBe('List already exists');
			});
	});
});
