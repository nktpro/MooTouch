(function(){

var NS = new Class({

    dependencyProperties: ['Implements', 'Extends', 'Requires'],

    initialize: function(namespace, options, fn) {
        var dependencies = this.getAllDependencies(options);

        NS.require(dependencies, function() {
            options = this.processOptions(options);

            var loadedClass = NS.getClass(namespace, options);

            if (typeOf(loadedClass) != "class")
                throw new Error("Class " + namespace + " does not exist or cannot be loaded properly");
            
            if (fn)
                fn(loadedClass);
        }.bind(this));
    },

    getAllDependencies: function(options) {
        var dependencies = [];

        // Iterate through each type of dependency (i.e. "Extends")
        this.dependencyProperties.each(function(param) {
            var resources = Array.from(options[param]);
            resources.each(function(resource, i) {
                // If the dependency isn't a class yet, try to load the class
                if (typeOf(resource) === 'string') {
                    dependencies.push(resource);
                }
            });
        });

        return dependencies;
    },

    processOptions: function(options) {
        this.dependencyProperties.each(function(param) {
            var resources = Array.from(options[param]);

            resources.each(function(resource, i) {
                if (typeOf(resource) === 'string') {
                    resource = NS.getClass(resource);

                    if (typeOf(options[param]) === 'array') {
                        options[param][i] = resource;
                    } else {
                        options[param] = resource;
                    }
                }
            });
        });

        return options;
    }
});

NS.extend({
    paths: {
        _base: "."
    },

    instances: {},

    fileLoaded: {},

    loadedClasses: [],

    dependencyQueue: [],

    // Traverses down the namespace path and returns the (newly instantiated if not existing) class
    getClass: function(namespace, options) {
        if (NS.instances.hasOwnProperty(namespace))
            return NS.instances[namespace];

        var root = window;

        // Iterate through each section of the namespace
        namespace.split('.').each(function(name, i, names) {
            // Up until the last leaf, create an object if undefined
            if (i < names.length - 1) {
                if (!root.hasOwnProperty(name)) {
                    root[name] = {};
                }
            } else {
                // If the last leaf doesn't exist & we're looking to instantiate, instantiate the class
                if (!root[name] && options) {
                    root[name] = new Class(options);

                    NS.loadedClasses.push(namespace);
                    NS.instances[namespace] = root[name];
                }
            }

            root = root[name];
        });

        // Return the requested namespaced class
        return root;
    },

    classExists: function(namespace) {
        if (NS.instances.hasOwnProperty(namespace))
            return true;

        var root = window;
        var chunks = namespace.split('.');

        for (var i = 0; i < chunks.length; i++) {
            if (!root.hasOwnProperty(chunks[i]))
                return false;

            root = root[chunks[i]];
        }

        return true;
    },

    setBasePath: function(namespace, path) {
        if (!path) {
            path = namespace;
            namespace = "_base";
        }

        NS.paths[namespace] = path;
    },

    getBasePath: function(namespace) {
        // Start with the base path
        var path = NS.paths._base;

        // Iterate through each specified namespace path ("Moo.Core" => "js/Moo/Core/")
        for (var stub in NS.paths) {
            if (stub === namespace.substring(0, stub.length)) {
                path += "/" + NS.paths[stub];
                // Remove stub from namespace, as we've already pathed it
                namespace = namespace.substring(stub.length + 1);
                break;
            }
        }

        return path + "/" + namespace.replace(/\./g, "/");
    },

    allClassesExist: function(namespaces) {
        for (var i = 0; i < namespaces.length; i++) {
            if (!NS.classExists(namespaces[i]))
                return false;
        }
        
        return true;
    },

    refreshQueue: function() {
        var self = arguments.callee;

        NS.dependencyQueue.each(function(q, i) {
            if (NS.allClassesExist(q.requires)) {
                q.callback();
                NS.dependencyQueue.splice(i, 1);
                self();
            }
        }, this);
    },

    loadScriptFile: function(url, onLoad) {
		var script = new Element('script', {src: url, type: 'text/javascript'});

		onLoad = onLoad.bind(script);

		script.addEvents({
			load: onLoad,
			readystatechange: function(){
				if (['loaded', 'complete'].contains(this.readyState)) onLoad();
			}
		});

		return script.inject(document.head);
    },

    require: function(namespaces, fn, withoutDomready) {
        if (typeof withoutDomready == 'undefined')
            withoutDomready = false;

        if (typeOf(namespaces) == 'object') {
            var classes = [];

            Object.each(namespaces, function(names, ns) {
                Array.from(names).each(function(name) {
                    classes.push(ns + '.' + name);
                });
            });

            namespaces = classes;
        }
        
        namespaces = Array.from(namespaces);

        if (!withoutDomready) {
            var oldFn = fn;

            fn = function() {
                window.addEvent('domready', oldFn);
            };
        }

        if (NS.allClassesExist(namespaces)) {
            fn();
            return;
        }

        NS.dependencyQueue.push({
            requires: namespaces,
            callback: fn
        });

        namespaces.each(function(namespace) {
            if (!(NS.fileLoaded.hasOwnProperty(namespace) && NS.fileLoaded[namespace] === true)) {
                NS.fileLoaded[namespace] = true;

                NS.loadScriptFile(NS.getBasePath(namespace) + '.js', NS.refreshQueue);

            }
        });
    },

    use: function(namespace) {
        if (NS.instances.hasOwnProperty(namespace))
            return NS.instances[namespace];
        
        var root = window;

        namespace.split('.').each(function(name) {
            if (!root.hasOwnProperty(name)) {
                root[name] = {};
            }
            
            root = root[name];
        });

        NS.instances[namespace] = root;
        return root;
    }
});

window.Namespace = NS;

})();