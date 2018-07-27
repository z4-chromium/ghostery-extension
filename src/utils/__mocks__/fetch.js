import 'whatwg-fetch';

const fetch = (url, opts) => new Promise((resolve) => {
	// console.log('url', url);
	// console.log('opts', opts);

	if (opts.headers['X-CSRF-Token'] && opts.headers['X-CSRF-Token'].length > 0) {
		let status;
		let body;
		if (opts.method === 'GET') {
			status = 200;
			switch (url) {
				case 'user':
					status = 200;
					body = {
						userData: 'TODO mock user data in file'
					}; // TODO mock user data in file
					break;
				default:
					status = 200;
					body = {
						data: 'default GET body data'
					};
			}
		} else if (opts.method === 'OPTIONS' || url.includes('login')) {
			status = 204;
			body = null;
		} else {
			status = 200;
			body = {
				data: 'default body data'
			};
		}
		const mockResponse = new Response(JSON.stringify(body), { status });
		resolve(mockResponse);
	} else {
		const status = 400;
		const body = {
			errors: [
				{
					title: 'request was invalid',
					status,
					code: '10000',
					links: {
						about: 'https://github.com/ghostery/auth/wiki/Errors#10000---request-was-invalid'
					}
				}
			]
		};
		const mockResponse = new Response(JSON.stringify(body), { status });
		resolve(mockResponse);
	}
});

export default fetch;
