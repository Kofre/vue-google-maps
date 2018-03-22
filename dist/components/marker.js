'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapValues = require('lodash/mapValues');

var _mapValues2 = _interopRequireDefault(_mapValues);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object
  },
  clickable: {
    type: Boolean,
    twoWay: true,
    default: true
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true,
    default: false
  },
  icon: {
    twoWay: true
  },
  label: {},
  opacity: {
    type: Number,
    default: 1
  },
  options: {
    type: Object
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
    twoWay: true
  },
  shape: {
    type: Object,
    twoWay: true
  },
  title: {
    type: String,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  },
  visible: {
    twoWay: true,
    default: true
  }
};

var events = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

/**
 * @class Marker
 *
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,

  render: function render(h) {
    if (!this.$slots.default || this.$slots.default.length === 0) {
      return '';
    } else if (this.$slots.default.length === 1) {
      // So that infowindows can have a marker parent
      return this.$slots.default[0];
    } else {
      return h('div', this.$slots.default);
    }
  },
  created: function created() {
    this.$on('register-info-window', this.registerInfoWindow);
    this.$on('unregister-info-window', this.unregisterInfoWindow);
  },
  destroyed: function destroyed() {
    if (this.$markerObject) {
      this.$parent && this.$parent.$emit('unregister-marker', { component: this, object: this.$markerObject });
    }
    this.$markerObject.setMap(null);
  },
  deferredReady: function deferredReady() {
    var _this = this;

    var options = (0, _mapValues2.default)(props, function (value, prop) {
      return _this[prop];
    });
    options.map = this.$map;
    delete options.options;
    Object.assign(options, this.options);
    this.createMarker(options);
  },


  methods: {
    createMarkerObject: function createMarkerObject(options) {
      return new google.maps.Marker(options);
    },
    createMarker: function createMarker(options) {
      var _this2 = this;

      this.$markerObject = this.createMarkerObject(options);
      (0, _propsBinder2.default)(this, this.$markerObject, props);

      this.$on('animation_changed', function () {
        _this2.$emit('update:animation', _this2.$markerObject.animation);
      });
      this.$on('clickable_changed', function () {
        _this2.$emit('update:clickable', _this2.$markerObject.clickable);
      });
      this.$on('cursor_changed', function () {
        _this2.$emit('update:cursor', _this2.$markerObject.cursor);
      });
      this.$on('draggable_changed', function () {
        _this2.$emit('update:draggable', _this2.$markerObject.draggable);
      });
      this.$on('icon_changed', function () {
        _this2.$emit('update:icon', _this2.$markerObject.icon);
      });
      this.$on('position_changed', function () {
        _this2.$emit('update:position', _this2.position && (0, _isFunction2.default)(_this2.position.lat) ? _this2.$markerObject.getPosition() : {
          lat: _this2.$markerObject.getPosition().lat(),
          lng: _this2.$markerObject.getPosition().lng()
        });
      });
      this.$on('shape_changed', function () {
        _this2.$emit('update:shape', _this2.$markerObject.shape);
      });
      this.$on('visible_changed', function () {
        _this2.$emit('update:visible', _this2.$markerObject.visible);
      });
      this.$on('zindex_changed', function () {
        _this2.$emit('update:zIndex', _this2.$markerObject.zIndex);
      });

      (0, _eventsBinder2.default)(this, this.$markerObject, events);

      this.$parent && this.$parent.$emit('register-marker', { component: this, object: this.$markerObject });
    },
    registerInfoWindow: function registerInfoWindow(_ref) {
      var instance = _ref.component;

      if (!instance) {
        return;
      }
      instance.$markerObject = this.$markerObject;
    },
    unregisterInfoWindow: function unregisterInfoWindow(_ref2) {
      var instance = _ref2.component;

      if (!instance) {
        return;
      }
      instance.$markerObject = null;
    }
  }
};