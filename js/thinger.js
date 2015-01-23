(function() {
	
	var leaf_tags = ['INPUT', 'SELECT', 'TEXTAREA'];
	
	TLD.Thinger = function(obj, opts) { //options) {   
		var ctxt = this;
		opts = typeof opts === 'undefined' ? {} : opts;
		this._actions = {};
		this._bits = [];
		this._inspecting = false;
		this._options = opts;
		this._event = typeof opts.event === 'function' ? opts.event : function() {};
		this._props = [];
		
		for (var p in obj) {
			if (obj.hasOwnProperty(p)) {
				(function() {
					var sp = '' + p;
					ctxt._props.push(sp);
					Object.defineProperty(ctxt, sp, {
						get: function () {
							return obj[sp] instanceof jQuery ? obj[sp].val() : obj[sp];
						},
						set: function(v) {
							console.log('changed: ' + sp + ' from ', obj[sp], ' to ', v);
							//ctxt.cb('change', {prop: sp, oldVal: obj[sp], newVal: v});
							ctxt._event('change', {prop: sp, oldVal: obj[sp], newVal: v});
							obj[sp] = v;
						}
					});
				})();
			}
		}
	};
	
	TLD.Thinger.from = function(s, opts) {
		var obj = {};
		
		var $root = s instanceof jQuery ? s : $(s);
		var thinger;
		
		$root.children().each(function(i, e) {
			var $e = $(e);
			
			var leaf = leaf_tags.indexOf(e.tagName) >= 0;
			var name = $e.attr('name') || $e.attr('id') || $e.attr('data-name');
			var tier = $e.data('tier') || false;
			
			
			if (leaf) {
				obj[name] = $e.val();
				$e.on('change', function(e) {
					thinger[name] = $e.val();
				})
			} else {
				var more = TLD.Thinger.from($e, opts);
				if (tier) {
					obj[tier] = more;
				} else {
					obj = $.extend({}, obj, more);
				}
			}
		});
		
		thinger = new TLD.Thinger(obj, opts);
		
		return thinger;
	};
	
	TLD.Thinger.prototype.getObject = function() {
		var obj = {};
		
		for (var p in this._props) {
			var fld = this._props[p];
			if (typeof fld === 'object') {
				if (typeof fld.length !== 'undefined') {
					obj[p] = [];
					for (var i in fld) {
						obj[p].push(fld[i].getObject);
					}
				} else {
					obj[p] = fld.getObject();
				}
			} else {
				obj[p] = fld;
			}
		}
	};
	
	//TLD.Thinger.prototype.enqueue = function(name, url, options) {
	//	this._queue.push({name: name, url: url, options: options});
	//}; // enqueue()
	
	//var loadResource = function(url, callback) {
	//	$.get(url, {}, function(d, s, x) {
	//		callback(d);
	//	});
	//}; // loadResource()
	
	//TLD.Thinger.prototype.load = function(callback) {
	//	var ctxt = this;
	//	if (this._queue.length > 0) {
	//		var nextLoad = function() {
	//			var toLoad = ctxt._queue.shift();
	//			loadResource(toLoad.url, function(d) {
	//				d = toLoad.url.indexOf('.mst') > 0 ? new TLD.Lookee(d) : d;
	//				
	//				ctxt._loaded[toLoad.name] = d;
	//				if (ctxt._queue.length > 0) {
	//					nextLoad();
	//				} else {
	//					callback();
	//				}
	//			});
	//		};
	//		
	//		nextLoad();
	//	} else {
	//		callback();
	//	}
	//}; // load()
	
	//TLD.Thinger.prototype.on = function(actions, callback) {
	//	actions = $.isArray(actions) ? actions : [actions];
	//	for (var i = 0, l = actions.length; i < l; i++) {
	//		var a = actions[i];
	//		if (typeof this._actions[a] === 'undefined') {
	//			this._actions[a] = [];
	//		}
	//		
	//		this._actions[a].push(callback);
	//	}
	//};
	
	
	
	
	//TLD.Thinger.prototype.getObj = function() {
	//	var obj = {};
	//	for (var i = 0, l = this.fields.length; i < l; i++) {
	//		var fld = this.fields[i];
	//		obj[fld.name] = fld.$e.val();
	//	}
	//	
	//	return obj;
	//};
	
	TLD.Thinger.prototype.trigger = function(action, e) {
		if (typeof this._actions[action] !== 'undefined') {
			var acts = this._actions[action];
			var obj = this.getObj();
			for (var i = 0, l = acts.length; i < l; i++) {
				acts[i](obj, e);
			}
		}
	};
	
	TLD.Thinger.prototype.bind = function(form) {
		var ctxt = this;
		this.$form = $(form);
		this.$bound = $(this.$form.data('bind'));
		this.$bound.data('template', this._loaded[this.$bound.data('template')] || new TLD.Lookee('Missing Template!'));
		
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
	
	TLD.Thinger.prototype.append = function(obj) {
		var t = this.$bound.data('template');
		this.$bound.append(t.render(obj));
	};
	
})();