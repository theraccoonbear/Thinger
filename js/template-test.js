$(function() {
	$.get('sample.mst.html', {}, function(tmpl) {
			
		var t = new Template(tmpl);
		console.log(t);
		
		var all = {
			people: [
				{
					id: 1,
					name: "John Doe <strong>!!!</strong>",
					age: 35,
					gender: 'M',
					city: 'Madison',
					state: 'WI',
					stuff: function() { return Math.round(Math.random() * 100); },
					numbers: [1, 5, 89, 3, 192],
					friends: [
						{id: 4, name: 'Sarah', age: 33, gender: 'F'},
						{id: 3, name: 'David', age: 36, gender: 'M'},
						{id: 2, name: "Laura", age: 18, gender: 'F'}
					],
					spouse: {
						name: "Jane",
						age: 38,
						gender: "F"
					}
				},
				{
					id: 2,
					name: "Laura Palmer",
					age: 18,
					gender: 'F',
					city: 'Twin Peaks',
					state: 'WA',
					stuff: 'LITERAL',
					spouse: undefined,
					friends: [
						{id: 5, name: 'James', age: 17, gender: 'M'},
						{id: 6, name: 'Donna', age: 18, gender: 'F'}
					]
				}
			]
		};
		
		console.log(drill(data1, ['spouse','name']));
	
		var Template_result;
		var started = (new Date()).getTime();
		for (var i = 0; i < 10000; i++) {
			Template_result = t.render(all);
		}
		
		var elapsed = (new Date()).getTime() - started;
		console.log('Completed with Template in ' + elapsed);
		
		var Mustache_result;
		started = (new Date()).getTime();
		for (var i = 0; i < 10000; i++) {
			Mustache_result = Mustache.render(tmpl, all);
		}
		
		var elapsed = (new Date()).getTime() - started;
		console.log('Completed with Mustache in ' + elapsed);
		console.log($(Mustache_result).html() == $(Template_result).html());
		$('#output')
			.append('<h4>Template.js</h4>')
			.append(Template_result)
			.append('<h4>Mustache.js</h4>')
			.append(Mustache_result);
		
		
		
		//$('#output').append(t.render(all, {
		//	partials: {
		//		'dummy': '<h1>DUMMY PARTIAL {{name}}</h1>'
		//	}
		//}));
		//	.append(t.render(data1))
		//	.append(t.render(data2));
	});
});