var Thinger;

(function() {
	
	
	
	Thinger = function(options) {
		this._queue = [];
		this._loaded = {};
		this._actions = {};
	};
	
	Thinger.prototype.enqueue = function(name, url, options) {
		this._queue.push({name: name, url: url, options: options});
	}; // enqueue()
	
	var loadResource = function(url, callback) {
		$.get(url, {}, function(d, s, x) {
			callback(d);
		});
	}; // loadResource()
	
	Thinger.prototype.load = function(callback) {
		var ctxt = this;
		if (this._queue.length > 0) {
			var nextLoad = function() {
				var toLoad = ctxt._queue.shift();
				loadResource(toLoad.url, function(d) {
					d = toLoad.url.indexOf('.mst') > 0 ? new Template(d) : d;
					
					ctxt._loaded[toLoad.name] = d;
					if (ctxt._queue.length > 0) {
						nextLoad();
					} else {
						callback();
					}
				});
			};
			
			nextLoad();
		} else {
			callback();
		}
	}; // load()
	
	Thinger.prototype.on = function(actions, callback) {
		actions = $.isArray(actions) ? actions : [actions];
		for (var i = 0, l = actions.length; i < l; i++) {
			var a = actions[i];
			if (typeof this._actions[a] === 'undefined') {
				this._actions[a] = [];
			}
			
			this._actions[a].push(callback);
		}
	};
	
	Thinger.prototype.getObj = function() {
		var obj = {};
		for (var i = 0, l = this.fields.length; i < l; i++) {
			var fld = this.fields[i];
			obj[fld.name] = fld.$e.val();
		}
		
		return obj;
	};
	
	Thinger.prototype.trigger = function(action, e) {
		if (typeof this._actions[action] !== 'undefined') {
			var acts = this._actions[action];
			var obj = this.getObj();
			for (var i = 0, l = acts.length; i < l; i++) {
				acts[i](obj, e);
			}
		}
	};
	
	Thinger.prototype.bind = function(form) {
		var ctxt = this;
		this.$form = $(form);
		this.$bound = $(this.$form.data('bind'));
		this.$bound.data('template', this._loaded[this.$bound.data('template')] || new Template('Missing Template!'));
		
		this.$fields = this.$form.find('input, select, textarea');
		this.fields = [];
		this.$fields.each(function(i, e) {
			var $e = $(e);
			var n = $e.attr('name') || $e.attr('id') || $e.data('name');
			var fld = {
				$e: $e,
				name: n
			};
			
			if ($e.data('action')) {
				$e.on({
					click: function(e) {
						ctxt.trigger($e.data('action'), e)
					}
				});
			}
			
			ctxt.fields.push(fld);
			//console.log('Binding ' + ctxt.name + '.' + n + ' to ' + ctxt.bound + '.' + n);
    });
	};
	
	Thinger.prototype.append = function(obj) {
		var t = this.$bound.data('template');
		this.$bound.append(t.render(obj));
	};
	
})();