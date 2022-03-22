'use strict';

var List = require('nodejs-linked-list');

function inherit(a, b) {
    a.prototype = Object.create(b.prototype, {
        'constructor': {
            value: a,
            enumerable: false,
            configurable: false,
            writable: false
        }
    });
}

function DependencyList() {
    List.call(this);
    this.unResolved = new List();
}

inherit(DependencyList, List);

DependencyList.prototype.destroy = function () {
    this.unResolved.destroy();
    this.unResolved = null;
    List.prototype.destroy.call(this);
};

DependencyList.dependencyConstructor = function () {
    return Dependency;
};

DependencyList.prototype.createDependency = function () {
    return new Dependency();
};

DependencyList.prototype.getDependencyProperty = function (dependency) {
    return dependency.name;
};

DependencyList.prototype.plainAddReverse = function (afterDependency, dependency) {
    this.plainAdd(dependency, afterDependency);
};

DependencyList.prototype.plainAdd = function (dependency, afterDependency) {
    var listForRemove = new List(),
        listForAdd = new List(),
        newDependencyContainer = List.prototype.add.call(this, dependency, afterDependency);

    this.unResolved.forEach(
        this.lateResolve.bind(
            this,
            listForRemove,
            listForAdd,
            newDependencyContainer,
            dependency
        )
    );
    listForRemove.forEach(this.unResolved.removeOne.bind(this.unResolved));
    listForAdd.forEach(this.plainAddReverse.bind(this, newDependencyContainer));
    listForRemove.destroy();
    listForAdd.destroy();
};

function depChecker(targetProFunc, targetDep, depFromList, depFromListContainer) {
    targetDep.resolve(targetProFunc(depFromList));

    if (targetDep.resolved()) {
        return depFromListContainer;
    }
}

DependencyList.prototype.add = function (dependency) {
    var depCheck = this.forEachWithCondition(
        depChecker.bind(null, this.getDependencyProperty.bind(this), dependency)
    );

    if (depCheck) {
        this.plainAdd(dependency, depCheck);
    } else if (dependency.resolved()) {
        this.plainAdd(dependency);
    } else {
        this.unResolved.add(dependency);
    }
};

DependencyList.prototype.lateResolve = function (
    listForRemove,
    listForAdd,
    newDependencyContainer,
    newDependency,
    unResolvedDependency,
    unResolvedContainer) {
    
    unResolvedDependency.resolve(newDependency.name);

    if (unResolvedDependency.resolved()) {
        listForRemove.add(unResolvedContainer);
        listForAdd.add(unResolvedDependency);
    }
};

function addToListOfUnResolved(lObj, unRes) {
    lObj.list.push(unRes.name);
}

DependencyList.prototype.listOfUnResolved = function () {
    var lObj = {
        list: []
    };

    this.unResolved.forEach(addToListOfUnResolved.bind(null, lObj));

    return lObj.list.join(',');
};

function Dependency() {
    this.dependencies = {};
    this.unResolved = {};
}

Dependency.prototype.destroy = function () {
    this.dependencies = null;
    this.unResolved = null;
};

Dependency.prototype.cloneDependencies = function (obj) {
    for (var i in obj) {
        this.dependencies[i] = obj[i];
        this.unResolved[i] = true;
    }
};

Dependency.prototype.resolve = function (depName) {
    delete this.unResolved[depName];
};

Dependency.prototype.resolved = function () {
    for (var i in this.unResolved) {
        return false;
    }

    return true;
};

module.exports = DependencyList;