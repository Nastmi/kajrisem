var assert = require('assert');

describe('katalon', function() {

	it('should do something', function() {
		browser.url('http://kajrisem.live/');
		$('#inputName').click();
		$('#inputName').setValue('test');
		$('#room-btn').click();
		$('#start-game').click();
		$('(.//*[normalize-space(text()) and normalize-space(.)=\'V igri morata biti vsaj dva igralca, zaenkrat si tu le sam.\'])[1]/following::button[1]').click();
	});

});