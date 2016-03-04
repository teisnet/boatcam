(function( $, undefined ) {
	RestClient = function (options) {
		var opts = $.extend({}, RestClient.defaults, options);
		expand(opts);

        this._options = opts;

		opts.rowsContainer.on('click', opts.selectLinks.selector, function (event) {
			var id = $(this).data('id');
			doAjaxCall('GET', url(opts.url, id), null, opts)
            .done(function(data) {
				onSelect(opts, data);
			});
			event.preventDefault();
		});

		opts.rowsContainer.on('click', opts.deleteLinks.selector, function (event) {
			var id = $(this).data('id');
			doAjaxCall('DELETE', url(opts.url, id), null, opts)
            .done(function(data) {
				doResetAndReload(opts);
			});
			event.preventDefault();
		});

		opts.entryForm.submit(function (event) {
			var form = $(this);
			var data = form.serialize();
			var id = $('#'+opts.entryIdField).val();

            var type = id ? 'PUT' : 'POST';
            var u =  id ? url(opts.url, id) : opts.url;

            doAjaxCall(type, u, data, opts)
            .done(function(data) {
                doResetAndReload(opts);
            });

			event.preventDefault();
		});

		opts.entryForm.bind('reset', function (event) {
			onSelect(opts, null);
			event.preventDefault();
		});

		doResetAndReload(opts);
	};

    RestClient.prototype.select = function(data) {
        useTemplate(this._options.entryTemplate, data, this._options.entryContainer);
    }

	function doResetAndReload(options) {
		onSelect(options, null);
		loadList(options);
	}

	function loadList (options) {
		doAjaxCall('GET', options.url, null, options)
        .done(function(data) {
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

	function doAjaxCall(type, url, data, options) {
		return $.ajax({
			type: type,
			url: url,
			dataType: data ? "json" : null,
			data: data,
            // TODO: Only set to 'false' in 'dumb' browers that don't invalidate cache on PUT requests
            cache: false
		})
        .fail(function(err){
            options.onError(err);
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

			baseUrl: 'api',
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
			onReload: $.noop,
			onError:  $.noop
		};

})(jQuery);
