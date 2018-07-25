import sinon from 'sinon';
import globals from '../../classes/Globals';
import Api from '../api';

const { CookiePlugin } = chrome.plugins;
const {
	GHOSTERY_DOMAIN, AUTH_SERVER, ACCOUNT_SERVER
} = globals;
const api = new Api();
const apiConfig = {
	AUTH_SERVER,
	ACCOUNT_SERVER,
	CSRF_DOMAIN: GHOSTERY_DOMAIN
};

chrome.registerPlugin(new CookiePlugin());
api.init(apiConfig, {});
jest.mock('../fetch');

describe('_sendReq', () => {
	beforeEach(() => {
	});

	it('should resolve with response status', async () => {
		sinon.spy(chrome.cookies, 'set');

		const csrfCookie = {
			url: 'http://localhost',
			name: 'csrf_token',
			value: 'test_csrf_token_val_123'
		}

		// add csrf cookie for this test
		chrome.cookies.set(csrfCookie);

		// make request with csrf cookie
		const response = await api._sendReq('GET', '/status', {});

		expect(chrome.cookies.set.calledWith(csrfCookie)).toBeTruthy();
		expect(response).toBeDefined();

	});

});
