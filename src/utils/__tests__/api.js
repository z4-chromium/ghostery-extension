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
let csrfCookie;

describe('src/utils/api.js success', () => {
	beforeEach(() => {
		sinon.spy(chrome.cookies, 'get');
		csrfCookie = {
			url: `https://${apiConfig.CSRF_DOMAIN}.com`,
			name: 'csrf_token',
			value: `test_csrf_token_val_${Math.floor(Math.random() * 1000000000)}`
		};
		chrome.cookies.set(csrfCookie);
	});

	afterEach(() => {
		chrome.cookies.remove(csrfCookie, () => {});
		chrome.cookies.get.restore();
	});

	it('_getCsrfCookie should resolve with cookie token', async () => {
		const response = await api._getCsrfCookie();
		expect(response).toBeTruthy();
	});

	it('_sendReq should get cookie token and resolve with request response', async () => {
		// make request with csrf cookie
		const response = await api._sendReq('GET', '/', {});

		expect(chrome.cookies.get.called).toBeTruthy();
		expect(response).toBeDefined();
	});

	it('_sendAuthenticatedRequest resolve with request response', async () => {
		// make request with csrf cookie
		const response = await api._sendAuthenticatedRequest('GET', '/user', {});
		expect(chrome.cookies.get.called).toBeTruthy();
		expect(response).toBeDefined();
	});
});

describe('src/utils/api.js errors', () => {
	beforeEach(() => {
		sinon.spy(chrome.cookies, 'get');
	});

	afterEach(() => {
		chrome.cookies.remove(csrfCookie, () => {});
		chrome.cookies.get.restore();
	});

	it('_getCsrfCookie should resolve without cookie token', async () => {
		const response = await api._getCsrfCookie();
		expect(response).toBeFalsy();
	});

	it('_sendReq should resolve with response error status', async () => {
		// make request with csrf cookie
		const response = await api._sendReq('GET', '/', {});

		expect(chrome.cookies.get.called).toBeTruthy();
		expect(Number(response.status)).toBeGreaterThanOrEqual(400);
	});

	it('_sendAuthenticatedRequest should resolve with response error status', async () => {
		// make request with csrf cookie
		const response = await api._sendAuthenticatedRequest('GET', '/user', {});

		expect(chrome.cookies.get.called).toBeTruthy();
		expect(response.errors).toBeTruthy();
	});
});
