var assert = require('assert');

describe('katalon', function() {

	it('should do something', function() {
		browser.url('http://kajrisem.live/');
		$('#room-btn').click();
	});

});