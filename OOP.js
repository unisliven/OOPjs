/**
 * OOP.js v1.0
 * author: liven
 * license: MIT
 */
(function(global, factory) {
    typeof module !== 'undefined' && typeof exports === 'object'
        ? module.exports = factory()
        : typeof define === 'function' && define.amd
        ? define('OOP',[],factory)
        : (global.Class = factory());
}(this, function() {
    'use strict';

    var version = '1.0';

    var objProto = Object.prototype,
        hasOwn = objProto.hasOwnProperty,
        objToString = objProto.toString,
        isFunction = function (obj){
            return objToString.call(obj) === '[object Function]';
        },
        isPlainObject = function (obj){
            return objToString.call(obj) === '[object Object]';
        },
        isArray = function (obj){
            return objToString.call(obj) === '[object Array]';
        };

    function Class(obj) {
        function _class_() {
            isFunction(this._init) && this._init.apply(this, arguments);
        }

        _class_.prototype = isPlainObject(obj) ? obj : {};
        _class_.prototype.constructor = _class_;

        _class_.extend = class$extend;
        _class_.implement = class$implement;
        _class_.getOptions = class$getOptions;
        _class_.setOptions = class$setOptions;

        return _class_;
    }

    Class.$version = version;

    var superRegExp = /_super/;
    function class$extend(obj) {
        var _parent = this.prototype,
            tempProto = Object.create(_parent),
            thisProp;
        for(var key in obj) {
            if(hasOwn.call(obj, key)) {
                thisProp = obj[key];
                tempProto[key] = (typeof thisProp === 'function' && typeof _parent[key] === 'function' && superRegExp.test(thisProp.toString()))
                                ? (function (method, name) {
                                        return function () {
                                            this._super = _parent[name];
                                            var result = method.apply(this, arguments);
                                            delete this._super;
                                            return result;
                                        };
                                    })(thisProp, key)
                                : thisProp;
            }
        }
        thisProp = null;

        this.prototype = tempProto;
        this.prototype.constructor = this;

        return this;
    }

    function class$implement(obj) {
        if(!isArray(obj) && !isPlainObject(obj)){
            return;
        } else if(isPlainObject(obj)){
            obj = [obj];
        }
        return this.prototype = extend(this.prototype, implement(obj));
    }

    function class$getOptions() {
        return this.prototype._$options || {};
    }

    function class$setOptions(options) {
        if(!isPlainObject(options)){
            return;
        }
        return this.prototype._$options = extend(this.prototype._$options, options);
    }

    function extend(target, source, deep) {
        var name, src, copy, copyIsArray, clone;

        if(typeof deep !== 'boolean'){
            deep = false;
        }

        if ( typeof target !== "object" && !isFunction(target) ) {
            target = {};
        }

        for ( name in source ) {
            if (hasOwn.call(source, name)) {
                src = target[name];
                copy = source[name];

                if (target === copy) {
                    continue;
                }

                if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)) )) {
                    if (copyIsArray) {
                        copyIsArray = false;
                        clone = src && isArray(src) ? src : [];
                    } else {
                        clone = src && isPlainObject(src) ? src : {};
                    }
                    target[name] = extend(clone, copy, deep);

                } else if (copy !== undefined) {
                    target[name] = copy;
                }
            }
        }

        return target;
    }

    function safeRemove(obj, name){
        var safeObj = {};
        for(var key in obj) {
            if(key === name) {
                continue;
            }
            safeObj[key] = obj[key];
        }
        return safeObj;
    }

    function implement(array) {
        var collection = {};
        for(var i = 0; i < array.length; i++) {
            if(typeof(array[i]) === 'function') {
                array[i] = array[i].prototype;
            }
            var obj = safeRemove(array[i], '_init');
            collection = extend(collection, obj);
        }
        return collection;
    }

    return Class;
}));
