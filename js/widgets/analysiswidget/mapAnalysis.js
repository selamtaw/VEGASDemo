define([
		//modules for class declartion
		"dojo/_base/declare",

		//Modules for loading templated Widgets
		"dijit/_TemplatedMixin",

		//Module for a base class for our widgets
		"dijit/_WidgetBase",
		//MOdule for handling user interaction with the widget
		"dijit/_OnDijitClickMixin",
		//Load the html template
		"dojo/text!appWidgets/analysiswidget/template/analysis.html",

		"dojo/domReady!"
	],
	function(declare, _TemplatedMixin, _WidgetBase, _OnDijitClickMixin, dijitTemplate) {
		return declare([_TemplatedMixin, _WidgetBase, _OnDijitClickMixin], {
			//assigning html template to template string
			templateString: dijitTemplate,

			constructor: function(options, srcRefNode) {
				console.log("I'm your new module.");
				this.domNode = srcRefNode;
			},
			postCreate: function() {
				this.inherited(arguments);
			},
			startup: function() {

			},
			destroy: function() {

			}
		});
	});
