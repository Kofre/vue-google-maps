'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _clone = require('lodash/clone');

var _clone2 = _interopRequireDefault(_clone);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _isObject = require('lodash/isObject');

var _isObject2 = _interopRequireDefault(_isObject);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

var _markerClustererPlus = require('marker-clusterer-plus');

var _markerClustererPlus2 = _interopRequireDefault(_markerClustererPlus);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  maxZoom: {
    type: Number,
    twoWay: false
  },
  calculator: {
    type: Function,
    twoWay: false
  },
  gridSize: {
    type: Number,
    twoWay: false
  },
  minimumClusterSize: {
    type: Number,
    twoWay: false
  },
  styles: {
    type: Array,
    twoWay: false
  }
}; /* vim: set softtabstop=2 shiftwidth=2 expandtab : */

/**
 * @class Cluster
 * @prop $clusterObject -- Exposes the marker clusterer to
 descendent Marker classes. Override this if you area
 extending the class
 **/

var events = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  props: props,

  render: function render(h) {
    // <div><slot></slot></div>
    return h('div', this.$slots.default);
  },
  created: function created() {
    this.$on('register-marker', this.registerMarker);
    this.$on('unregister-marker', this.unregisterMarker);
  },
  deferredReady: function deferredReady() {
    var _this = this;

    var options = (0, _clone2.default)(this.getPropsValues());
    this.$clusterObject = this.createMarkerClusterObject(this.$map, [], options);

    (0, _propsBinder2.default)(this, this.$clusterObject, props, {
      afterModelChanged: function afterModelChanged(a, v) {
        // eslint-disable-line no-unused-vars
        var oldMarkers = _this.$clusterObject.getMarkers();
        _this.$clusterObject.clearMarkers();
        _this.$clusterObject.addMarkers(oldMarkers);
      }
    });
    (0, _eventsBinder2.default)(this, this.$clusterObject, events);
  },
  beforeDestroy: function beforeDestroy() {
    var _this2 = this;

    /* Performance optimization when destroying a large number of markers */
    this.$children.forEach(function (marker) {
      if (marker.$clusterObject === _this2.$clusterObject) {
        marker.$clusterObject = null;
      }
    });
    if (this.$clusterObject) {
      this.$clusterObject.clearMarkers();
    }
  },

  methods: {
    createMarkerClusterObject: function createMarkerClusterObject(map, optMarkers, optOptions) {
      if (typeof _markerClustererPlus2.default === 'undefined') {
        var errorMessage = 'MarkerClusterer is not installed! require() it or include it from https://cdnjs.cloudflare.com/ajax/libs/js-marker-clusterer/1.0.0/markerclusterer.js';
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
      return new _markerClustererPlus2.default(map, optMarkers, optOptions);
    },
    repaint: function repaint() {
      this.$clusterObject.repaint();
    },
    registerMarker: function registerMarker(_ref) {
      var marker = _ref.object;

      if (!this.$clusterObject || !(0, _isObject2.default)(marker)) {
        return;
      }
      this.$clusterObject.addMarker(marker);
      marker.addListener('position_changed', this.repaint);
    },
    unregisterMarker: function unregisterMarker(_ref2) {
      var marker = _ref2.object;

      if (!this.$clusterObject || !(0, _isObject2.default)(marker)) {
        return;
      }
      this.$clusterObject.removeMarker(marker);
    }
  }
};