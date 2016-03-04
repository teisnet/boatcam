"use strict";

var MasterDetail = (function($) {

	var masterDetail = function (cfg) {
        var self = this;
		var config = self.config = $.extend({}, self.defaults, cfg);
		expand(config);

        // List 'click' handler
		config.listContainer.on('click', config.selectLinks.selector, function (event) {
			var id = $(this).data('id');
			self._request('GET', id, null)
            .done(function(data) {
				self._onSelect(data);
			});
			event.preventDefault();
		});

        // List 'delete' handler
		config.listContainer.on('click', config.deleteLinks.selector, function (event) {
			var id = $(this).data('id');
			self._request('DELETE', id, null)
            .done(function(data) {
				self._doResetAndReload();
			});
			event.preventDefault();
		});

        // Form 'submit' handler
		config.detailForm.submit(function (event) {
			var form = $(this);
			var data = form.serialize();
			var id = $('#'+config.detailIdField).val();

            var type = id ? 'PUT' : 'POST';

            self._request(type, id || null, data)
            .done(function(data) {
                self._doResetAndReload();
            });

			event.preventDefault();
		});

        // Form 'reset' handler
		config.detailForm.bind('reset', function (event) {
			self._onSelect(null);
			event.preventDefault();
		});

		self._doResetAndReload();
	};


    masterDetail.prototype.select = function(data) {
        useTemplate(this.config.detailTemplate, data, this.config.detailContainer);
    }

	masterDetail.prototype._doResetAndReload = function() {
		this._onSelect(null);
		this._loadList();
	}

	masterDetail.prototype._loadList = function() {
        var self = this;
		self._request('GET', null, null)
        .done(function(data) {
			self._onReload(data);
		});
	};

	masterDetail.prototype._onReload = function(data) {
        var config = this.config;
		useTemplate(config.listTemplate, data, config.listContainer);
		config.onReload(data);
	}

	masterDetail.prototype._onSelect = function(data) {
        var config = this.config;
		useTemplate(config.detailTemplate, data, config.detailContainer);
		config.onSelect(data);
	}

	masterDetail.prototype._request = function(type, path, data) {
        var self = this;
        var url = path ? self.config.url + path : self.config.url;
		return $.ajax({
			type: type,
			url: url,
			dataType: data ? "json" : null,
			data: data,
            // TODO: Only set to 'false' in 'dumb' browers that don't invalidate cache on PUT requests
            cache: false
		})
        .fail(function(err){
            self.config.onError(err);
        });
	}



	function useTemplate(template, data, container) {
		if (template) {
			container.empty();
			template.tmpl(data).appendTo(container);
		}
	}

	function expand(config) {
		for (var field in config) {
			var val = config[field];
			if ($.type(val) == 'string') {
				while (val.match(/{([^{}]*)}/)) {
					val = val.replace(/{([^{}]*)}/, function (key, group) {
						return config[group];
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
				config[field] = val;
			}
		}
	}


	masterDetail.prototype.defaults = {
			plural: '{name}s',

			baseUrl: 'api',
			url: '{baseUrl}/{plural}/',

			listTemplate: '#{name}ListTemplate',
			listContainer: '#{plural}Container',

			detailTemplate: '#{name}DetailTemplate',
			detailContainer: '#{name}DetailContainer',
			detailForm: '#{name}Form',
			detailIdField: 'idField',

			selectLinks: '.{name}Select',
			deleteLinks: '.{name}Delete',

			onSelect: $.noop,
			onReload: $.noop,
			onError:  $.noop
		};


    return masterDetail;

})(jQuery);
