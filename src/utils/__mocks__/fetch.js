const fs = require('fs')

const fetch = (url, opts) => new Promise((resolve, reject) => {
	// console.log('url', url);
	// console.log('opts', opts);
	// Get userID from supplied url string
	// const lastSlash = url.lastIndexOf('/');
	// console.log('lastSlash', lastSlash);
	return resolve({
		status: '200'
	});
});

export default fetch;
