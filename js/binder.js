var Binder = function(obj) {
    var ctxt = this;
    this.$obj = $($(obj)[0]);
    this.model = this.$obj.data('model');
    this.name = this.$obj.data('name');
    
    this.$model = $('[data-name="' + this.bound + '"]');
    
    this.$fields = this.$obj.find('input, select, textarea');
    this.fields = [];
    this.$fields.each(function(i, e) {
        var $e = $(e);
        var n = $e.data('name');
        var fld = {
            $e: $e,
            name: n,
            $to: ctxt.$model.find('[data-name="' + n + '"]'),
            handler: function(e) {
                var m = fld.$to.data('massage');
                var val = typeof scope[ctxt.bound] !== 'undefined' && typeof scope[ctxt.bound][m] === 'function' ? scope[ctxt.bound][m](fld.$e) : $e.val();
                fld.$to.html(val);
            }
        };
        
        fld.$e.on('change keydown keyup keypress click select', fld.handler);
        fld.handler();
        ctxt.fields.push(fld);
        console.log('Binding ' + ctxt.name + '.' + n + ' to ' + ctxt.bound + '.' + n);
    });       
};
