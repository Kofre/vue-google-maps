'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _omit = require('lodash/omit');

var _omit2 = _interopRequireDefault(_omit);

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _isFunction = require('lodash/isFunction');

var _isFunction2 = _interopRequireDefault(_isFunction);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  options: {
    type: Object,
    required: false,
    default: function _default() {
      return {};
    }
  },
  opened: {
    type: Boolean,
    default: true,
    twoWay: true
  },
  position: {
    type: Object,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  }
};

var events = ['domready', 'closeclick', 'content_changed'];

exports.default = {
  mixins: [_mapElementMixin2.default],
  props: props,

  mounted: function mounted() {
    var el = this.$refs.flyaway;
    el.parentNode.removeChild(el);
  },
  beforeCreate: function beforeCreate() {
    this.$markerObject = null;
  },
  deferredReady: function deferredReady() {
    this.createInfoWindow();
  },
  destroyed: function destroyed() {
    this.$parent && this.$parent.$emit('unregister-info-window', { component: this, object: this.$infoWindow });
    if (this.disconnect) {
      this.disconnect();
    }
    if (this.$infoWindow) {
      this.$infoWindow.setMap(null);
    }
  },


  methods: {
    openInfoWindow: function openInfoWindow() {
      if (this.opened) {
        if (this.$markerObject !== null) {
          this.$infoWindow.open(this.$map, this.$markerObject);
        } else {
          this.$infoWindow.open(this.$map);
        }
      } else {
        this.$infoWindow.close();
      }
    },
    createInfoWindowObject: function createInfoWindowObject(options) {
      return new google.maps.InfoWindow(options);
    },
    createInfoWindow: function createInfoWindow(map) {
      var _this = this;

      // setting options
      var options = (0, _clone2.default)(this.options);
      options.content = this.$refs.flyaway;

      // only set the position if the info window is not bound to a marker
      if (this.$markerObject === null) {
        options.position = this.position;
      }

      this.$infoWindow = this.createInfoWindowObject(options);

      // Binding
      (0, _propsBinder2.default)(this, this.$infoWindow, (0, _omit2.default)(props, ['opened']));

      this.$on('position_changed', function () {
        _this.$emit('update:position', !_this.position || _this.position && (0, _isFunction2.default)(_this.position.lat) ? _this.$infoWindow.position : {
          lat: _this.$infoWindow.position.lat(),
          lng: _this.$infoWindow.position.lng()
        });
      });
      this.$on('zindex_changed', function () {
        _this.$emit('update:zIndex', _this.$infoWindow.zIndex);
      });

      (0, _eventsBinder2.default)(this, this.$infoWindow, events);

      this.$on('closeclick', function () {
        _this.$emit('update:opened', false);
      });

      this.$parent && this.$parent.$emit('register-info-window', { component: this, object: this.$infoWindow });

      this.openInfoWindow();
      this.$watch('opened', function () {
        _this.openInfoWindow();
      });
    }
  }
};