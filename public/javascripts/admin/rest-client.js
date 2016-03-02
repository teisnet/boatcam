(function( $, undefined ) {
	RestClient = function (options) {
		var opts = $.extend({}, RestClient.defaults, options);
		expand(opts);

		opts.selectLinks.live('click', function (event) {
			var id = $(this).data('id');
			doAjaxCall('GET', url(opts.url, id), null, function(data) {
				onSelect(opts, data);
			});
			event.preventDefault();
		});

		opts.deleteLinks.live('click', function (event) {
			var id = $(this).data('id');
			doAjaxCall('DELETE', url(opts.url, id), null, function(data) {
				doResetAndReload(opts);
			});
			event.preventDefault();
		});

		opts.entryForm.submit(function (event) {
			var form = $(this);
			var data = form.serialize();
			var id = $('#'+opts.entryIdField).val();
			if (id) {
				doAjaxCall('PUT', url(opts.url, id), data, function(data) {
					doResetAndReload(opts);
				});
			} else {
				doAjaxCall('POST', opts.url, data, function(data) {
					doResetAndReload(opts);
				});
			}
			event.preventDefault();
		});

		opts.entryForm.bind('reset', function (event) {
			onSelect(opts, null);
			event.preventDefault();
		});

		doResetAndReload(opts);
	};

	function doResetAndReload(options) {
		onSelect(options, null);
		loadList(options);
	}

	function loadList (options) {
		doAjaxCall('GET', options.url, null, function(data) {
			onReload(options, data);
		});
	};

	function onReload(options, data) {
		useTemplate(options.rowTemplate, data, options.rowsContainer);
		options.onReload(data);
	}

	function onSelect(options, data) {
		useTemplate(options.entryTemplate, data, options.entryContainer);
		options.onSelect(data);
	}

	function useTemplate(template, data, container) {
		if (template) {
			container.empty();
			template.tmpl(data).appendTo(container);
		}
	}

	function doAjaxCall(type, url, data, callback) {
		$.ajax({
			type: type,
			url: url,
			dataType: "json",
			data: data,
			success: callback
		});
	}

	function url(url, id) {
		return url + id + '/';
	}

	function expand(options) {
		for (var field in options) {
			var val = options[field];
			if ($.type(val) == 'string') {
				while (val.match(/{([^{}]*)}/)) {
					val = val.replace(/{([^{}]*)}/, function (key, group) {
						return options[group];
					});
				}
				if (val.charAt(0) == '#' || val.charAt(0) == '.') {
					var obj = $(val);
					if (val.charAt(0) == '#') {
						if (obj.length == 0) {
							obj = undefined;
						}
					}
					val = obj;
				}
				options[field] = val;
			}
		}
	}

	RestClient.defaults = {
			plural: '{name}s',

			baseUrl: 'services',
			url: '{baseUrl}/{plural}/',

			rowTemplate: '#{name}RowTemplate',
			rowsContainer: '#{plural}Container',

			entryTemplate: '#{name}EntryTemplate',
			entryContainer: '#{name}EntryContainer',
			entryForm: '#{name}Form',
			entryIdField: 'idField',

			selectLinks: '.{name}Select',
			deleteLinks: '.{name}Delete',

			onSelect: $.noop,
			onReload: $.noop
		};

})(jQuery);
