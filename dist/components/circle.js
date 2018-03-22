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
  center: {
    type: Object,
    twoWay: true,
    required: true
  },
  radius: {
    type: Number,
    default: 1000,
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
    delete options.bounds;
    this.createCircle(options);
  },


  methods: {
    createCircleObject: function createCircleObject(options) {
      return new google.maps.Circle(options);
    },
    createCircle: function createCircle(options) {
      var _this = this;

      this.$circleObject = this.createCircleObject(options);
      // we cant bind bounds because there is no `setBounds` method
      // on the Circle object
      var boundProps = (0, _clone2.default)(props);
      delete boundProps.bounds;
      (0, _propsBinder2.default)(this, this.$circleObject, boundProps);

      var updateBounds = function updateBounds() {
        _this.$emit('bounds_changed', _this.$circleObject.getBounds());
      };
      var radiusChange = function radiusChange() {
        _this.$emit('update:radius', _this.$circleObject.radius);
        updateBounds();
      };
      var centerChange = function centerChange() {
        _this.$emit('update:center', _this.center && (0, _isFunction2.default)(_this.center.lat) ? _this.$circleObject.center : {
          lat: _this.$circleObject.center.lat(),
          lng: _this.$circleObject.center.lng()
        });
        updateBounds();
      };
      this.$on('radius_changed', radiusChange);
      this.$on('center_changed', centerChange);

      (0, _eventsBinder2.default)(this, this.$circleObject, events);
    }
  },
  destroyed: function destroyed() {
    if (this.$circleObject) {
      this.$circleObject.setMap(null);
    }
  }
};