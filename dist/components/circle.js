'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _eventsBinder = require('../utils/eventsBinder.js');

var _eventsBinder2 = _interopRequireDefault(_eventsBinder);

var _propsBinder = require('../utils/propsBinder.js');

var _propsBinder2 = _interopRequireDefault(_propsBinder);

var _mapElementMixin = require('./mapElementMixin');

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _getPropsValuesMixin = require('../utils/getPropsValuesMixin.js');

var _getPropsValuesMixin2 = _interopRequireDefault(_getPropsValuesMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var circleProps = {
  center: {
    type: Object,
    twoWay: true
  },
  radius: {
    type: Number,
    twoWay: true
  },
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  options: {
    type: Object
  }
};

var props = {
  center: {
    type: Object,
    required: true
  },
  radius: {
    type: Number,
    default: 1000
  },
  bounds: {
    type: Object
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
    type: Object
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

exports.default = {
  mixins: [_mapElementMixin2.default, _getPropsValuesMixin2.default],
  render: function render(h) {
    return h( // So that infowindows can have a marker parent
    'div', this.$slots.default);
  },

  props: props,
  computed: {
    local_center: {
      get: function get() {
        return this.center;
      },
      set: function set(value) {
        this.$emit('center-changed', value);
      }
    },
    local_radius: {
      get: function get() {
        return this.radius;
      },
      set: function set(value) {
        this.$emit('radius-changed', value);
      }
    },
    local_bounds: {
      get: function get() {
        return this.bounds;
      },
      set: function set(value) {
        this.$emit('bounds-changed', value);
      }
    },
    local_draggable: function local_draggable() {
      return this.draggable;
    },
    local_editable: function local_editable() {
      return this.editable;
    },
    local_options: function local_options() {
      return this.options;
    }
  },
  created: function created() {
    this.$acceptInfoWindow = true;
    this.$on('register-info-window', this.registerInfoWindow);
    this.$on('unregister-info-window', this.unregisterInfoWindow);
  },
  deferredReady: function deferredReady() {
    var options = _lodash2.default.clone(this.getPropsValues());
    options.map = this.$map;
    delete options.bounds;
    this.createCircle(options, this.$map);
  },


  methods: {
    createCircleObject: function createCircleObject(options) {
      return new google.maps.Circle(options);
    },
    createCircle: function createCircle(options, map) {
      var _this = this;

      this.$circleObject = this.createCircleObject(options);

      (0, _propsBinder2.default)(this, this.$circleObject, circleProps);
      (0, _eventsBinder2.default)(this, this.$circleObject, events);

      var updateBounds = function updateBounds() {
        _this.local_bounds = _this.$circleObject.getBounds();
      };

      this.$watch('local_radius', updateBounds);
      // because center is an object and we need to be warned even if only the lat or lng change. not the whole reference
      this.$watch('local_center', updateBounds, { deep: true });
      updateBounds();
    },
    registerInfoWindow: function registerInfoWindow(infoWindow) {
      this.infoWindowClickEvent = function () {
        infoWindow.local_opened = !infoWindow.local_opened;
      };
      this.$on('click', this.infoWindowClickEvent);
      this.infoWindowCenterChangeWatch = this.$watch('local_center', function (newValue) {
        infoWindow.local_position = newValue;
      }, { deep: true });
    },
    unregisterInfoWindow: function unregisterInfoWindow(infoWindow) {
      if (this.infoWindowClickEvent) {
        this.$off('click', this.infoWindowClickEvent);
      }
      this.infoWindowClickEvent = null;
      if (this.infoWindowCenterChangeWatch) {
        this.infoWindowCenterChangeWatch();
      }
      this.infoWindowCenterChangeWatch = null;
    }
  },

  destroyed: function destroyed() {
    if (this.$circleObject) {
      this.$circleObject.setMap(null);
    }
  }
};