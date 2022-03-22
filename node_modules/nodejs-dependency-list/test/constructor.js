'use strict';

const assert = require('assert');

describe('Constructor', () => {
    describe('#List', () => {
        it('It should is not undefined', () => {
            var List = require('nodejs-linked-list');

            assert.equal('function', typeof List);
        });
    });

    describe('#DependencyList', () => {
        it('It should is not undefined', () => {
            var DependencyList = require(process.cwd() + '/index');

            assert.equal('function', typeof DependencyList);
        });
    });

    describe('#new DependencyList()', () => {
        it('It should create a new DependencyList instance successful', () => {
            var DependencyList = require(process.cwd() + '/index'),
                depListInstance = new DependencyList();

            assert.equal(true, depListInstance instanceof DependencyList);
        });
    });

    describe('#Destroy DependencyList without error', () => {
        it('It should destroy DependencyList successful', () => {
            var DependencyList = require(process.cwd() + '/index'),
                depListInstance = new DependencyList();

            assert.doesNotThrow(function () {
                depListInstance.destroy();
            }, 'Error when destroy DependencyList');
        });
    });

    describe('#DependencyList methods', () => {
        var DependencyList = require(process.cwd() + '/index'),
            depListInstance = new DependencyList();
        
        it('It should create a new Dependency instance successful', () => {
            var dependencyObj = depListInstance.createDependency();

            assert.equal('object', typeof dependencyObj);
        });
    });
});