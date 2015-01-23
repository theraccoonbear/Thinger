var TLD = function (ready) {
	TLD.ready = ready;

	TLD.load = function(url, cb) {
		$.get(url, {}, function(d, s, x) {
			if (typeof cb === 'function') {
				cb(d);
			}
		});
	};
	
	TLD.drill = function(obj, bits, def) {
		var def = typeof def === 'undefined' ? '' : def;
		bits = $.isArray(bits) ? bits : [bits];
		return bits.length == 0 ? obj : (typeof obj[bits[0]] === 'undefined' ? def : drill(obj[bits[0]], bits.slice(1), def));
	};
	
	require(["js/thinger"], function(t) {
		require(["js/lookee"], function(l) {
			require(["js/doodad"], function(t) {
				if (typeof TLD.ready === 'function') {
					TLD.ready();
				} else {
					console.log("No ready function defined.");
				}
			});		
		});
	});
};





