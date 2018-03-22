'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  bounds: {
    type: Object,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object,
    twoWay: false
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,

  render: function render() {
    return '';
  },
  deferredReady: function deferredReady() {
    var options = (0, _clone2.default)(this.getPropsValues());
    options.map = this.$map;
    this.createRectangle(options);
  },


  methods: {
    createRectangleObject: function createRectangleObject(options) {
      return new google.maps.Rectangle(options);
    },
    createRectangle: function createRectangle(options) {
      var _this = this;

      this.$rectangleObject = this.createRectangleObject(options);
      (0, _propsBinder2.default)(this, this.$rectangleObject, props);

      this.bounds && this.$rectangleObject.setBounds(this.bounds);

      this.$on('bounds_changed', function () {
        _this.$emit('update:bounds', _this.bounds && (0, _isFunction2.default)(_this.bounds.getNorthEast) ? _this.$rectangleObject.bounds : {
          north: _this.$rectangleObject.bounds.getNorthEast().lat(),
          east: _this.$rectangleObject.bounds.getNorthEast().lng(),
          south: _this.$rectangleObject.bounds.getSouthWest().lat(),
          west: _this.$rectangleObject.bounds.getSouthWest().lng()
        });
      });

      (0, _eventsBinder2.default)(this, this.$rectangleObject, events);
    }
  },

  destroyed: function destroyed() {
    if (this.$rectangleObject) {
      this.$rectangleObject.setMap(null);
    }
  }
};