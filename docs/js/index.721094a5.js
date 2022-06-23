/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/ 		var executeModules = data[2];
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 		// add entry modules from loaded chunk to deferred list
/******/ 		deferredModules.push.apply(deferredModules, executeModules || []);
/******/
/******/ 		// run deferred modules when all chunks ready
/******/ 		return checkDeferredModules();
/******/ 	};
/******/ 	function checkDeferredModules() {
/******/ 		var result;
/******/ 		for(var i = 0; i < deferredModules.length; i++) {
/******/ 			var deferredModule = deferredModules[i];
/******/ 			var fulfilled = true;
/******/ 			for(var j = 1; j < deferredModule.length; j++) {
/******/ 				var depId = deferredModule[j];
/******/ 				if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 			}
/******/ 			if(fulfilled) {
/******/ 				deferredModules.splice(i--, 1);
/******/ 				result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 			}
/******/ 		}
/******/
/******/ 		return result;
/******/ 	}
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = // eslint-disable-next-line no-unused-vars
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) {
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if (parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var script = document.createElement("script");
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		if (null) script.crossOrigin = null;
/******/ 		document.head.appendChild(script);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest(requestTimeout) {
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if (typeof XMLHttpRequest === "undefined") {
/******/ 				return reject(new Error("No browser support"));
/******/ 			}
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch (err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if (request.readyState !== 4) return;
/******/ 				if (request.status === 0) {
/******/ 					// timeout
/******/ 					reject(
/******/ 						new Error("Manifest request to " + requestPath + " timed out.")
/******/ 					);
/******/ 				} else if (request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if (request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch (e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "721094a5bb263be68445";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			for(var chunkId in installedChunks)
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		0: 0
/******/ 	};
/******/
/******/ 	var deferredModules = [];
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// add entry module to deferred list
/******/ 	deferredModules.push([365,1]);
/******/ 	// run deferred modules when ready
/******/ 	return checkDeferredModules();
/******/ })
/************************************************************************/
/******/ ({

/***/ 364:
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ 365:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var d3_namespaceObject = {};
__webpack_require__.r(d3_namespaceObject);
__webpack_require__.d(d3_namespaceObject, "drag", function() { return src["a" /* drag */]; });
__webpack_require__.d(d3_namespaceObject, "dragDisable", function() { return src["b" /* dragDisable */]; });
__webpack_require__.d(d3_namespaceObject, "dragEnable", function() { return src["c" /* dragEnable */]; });
__webpack_require__.d(d3_namespaceObject, "forceCenter", function() { return d3_force_src["a" /* forceCenter */]; });
__webpack_require__.d(d3_namespaceObject, "forceCollide", function() { return d3_force_src["b" /* forceCollide */]; });
__webpack_require__.d(d3_namespaceObject, "forceLink", function() { return d3_force_src["c" /* forceLink */]; });
__webpack_require__.d(d3_namespaceObject, "forceManyBody", function() { return d3_force_src["d" /* forceManyBody */]; });
__webpack_require__.d(d3_namespaceObject, "forceRadial", function() { return d3_force_src["e" /* forceRadial */]; });
__webpack_require__.d(d3_namespaceObject, "forceSimulation", function() { return d3_force_src["f" /* forceSimulation */]; });
__webpack_require__.d(d3_namespaceObject, "forceX", function() { return d3_force_src["g" /* forceX */]; });
__webpack_require__.d(d3_namespaceObject, "forceY", function() { return d3_force_src["h" /* forceY */]; });
__webpack_require__.d(d3_namespaceObject, "create", function() { return d3_selection_src["b" /* create */]; });
__webpack_require__.d(d3_namespaceObject, "creator", function() { return d3_selection_src["c" /* creator */]; });
__webpack_require__.d(d3_namespaceObject, "local", function() { return d3_selection_src["f" /* local */]; });
__webpack_require__.d(d3_namespaceObject, "matcher", function() { return d3_selection_src["g" /* matcher */]; });
__webpack_require__.d(d3_namespaceObject, "mouse", function() { return d3_selection_src["h" /* mouse */]; });
__webpack_require__.d(d3_namespaceObject, "namespace", function() { return d3_selection_src["i" /* namespace */]; });
__webpack_require__.d(d3_namespaceObject, "namespaces", function() { return d3_selection_src["j" /* namespaces */]; });
__webpack_require__.d(d3_namespaceObject, "clientPoint", function() { return d3_selection_src["a" /* clientPoint */]; });
__webpack_require__.d(d3_namespaceObject, "select", function() { return d3_selection_src["k" /* select */]; });
__webpack_require__.d(d3_namespaceObject, "selectAll", function() { return d3_selection_src["l" /* selectAll */]; });
__webpack_require__.d(d3_namespaceObject, "selection", function() { return d3_selection_src["m" /* selection */]; });
__webpack_require__.d(d3_namespaceObject, "selector", function() { return d3_selection_src["n" /* selector */]; });
__webpack_require__.d(d3_namespaceObject, "selectorAll", function() { return d3_selection_src["o" /* selectorAll */]; });
__webpack_require__.d(d3_namespaceObject, "style", function() { return d3_selection_src["p" /* style */]; });
__webpack_require__.d(d3_namespaceObject, "touch", function() { return d3_selection_src["q" /* touch */]; });
__webpack_require__.d(d3_namespaceObject, "touches", function() { return d3_selection_src["r" /* touches */]; });
__webpack_require__.d(d3_namespaceObject, "window", function() { return d3_selection_src["s" /* window */]; });
__webpack_require__.d(d3_namespaceObject, "event", function() { return d3_selection_src["e" /* event */]; });
__webpack_require__.d(d3_namespaceObject, "customEvent", function() { return d3_selection_src["d" /* customEvent */]; });
__webpack_require__.d(d3_namespaceObject, "now", function() { return d3_timer_src["b" /* now */]; });
__webpack_require__.d(d3_namespaceObject, "timer", function() { return d3_timer_src["d" /* timer */]; });
__webpack_require__.d(d3_namespaceObject, "timerFlush", function() { return d3_timer_src["e" /* timerFlush */]; });
__webpack_require__.d(d3_namespaceObject, "timeout", function() { return d3_timer_src["c" /* timeout */]; });
__webpack_require__.d(d3_namespaceObject, "interval", function() { return d3_timer_src["a" /* interval */]; });
__webpack_require__.d(d3_namespaceObject, "arc", function() { return d3_shape_src["a" /* arc */]; });
__webpack_require__.d(d3_namespaceObject, "area", function() { return d3_shape_src["b" /* area */]; });
__webpack_require__.d(d3_namespaceObject, "line", function() { return d3_shape_src["v" /* line */]; });
__webpack_require__.d(d3_namespaceObject, "pie", function() { return d3_shape_src["A" /* pie */]; });
__webpack_require__.d(d3_namespaceObject, "areaRadial", function() { return d3_shape_src["c" /* areaRadial */]; });
__webpack_require__.d(d3_namespaceObject, "radialArea", function() { return d3_shape_src["C" /* radialArea */]; });
__webpack_require__.d(d3_namespaceObject, "lineRadial", function() { return d3_shape_src["w" /* lineRadial */]; });
__webpack_require__.d(d3_namespaceObject, "radialLine", function() { return d3_shape_src["D" /* radialLine */]; });
__webpack_require__.d(d3_namespaceObject, "pointRadial", function() { return d3_shape_src["B" /* pointRadial */]; });
__webpack_require__.d(d3_namespaceObject, "linkHorizontal", function() { return d3_shape_src["x" /* linkHorizontal */]; });
__webpack_require__.d(d3_namespaceObject, "linkVertical", function() { return d3_shape_src["z" /* linkVertical */]; });
__webpack_require__.d(d3_namespaceObject, "linkRadial", function() { return d3_shape_src["y" /* linkRadial */]; });
__webpack_require__.d(d3_namespaceObject, "symbol", function() { return d3_shape_src["Q" /* symbol */]; });
__webpack_require__.d(d3_namespaceObject, "symbols", function() { return d3_shape_src["Y" /* symbols */]; });
__webpack_require__.d(d3_namespaceObject, "symbolCircle", function() { return d3_shape_src["R" /* symbolCircle */]; });
__webpack_require__.d(d3_namespaceObject, "symbolCross", function() { return d3_shape_src["S" /* symbolCross */]; });
__webpack_require__.d(d3_namespaceObject, "symbolDiamond", function() { return d3_shape_src["T" /* symbolDiamond */]; });
__webpack_require__.d(d3_namespaceObject, "symbolSquare", function() { return d3_shape_src["U" /* symbolSquare */]; });
__webpack_require__.d(d3_namespaceObject, "symbolStar", function() { return d3_shape_src["V" /* symbolStar */]; });
__webpack_require__.d(d3_namespaceObject, "symbolTriangle", function() { return d3_shape_src["W" /* symbolTriangle */]; });
__webpack_require__.d(d3_namespaceObject, "symbolWye", function() { return d3_shape_src["X" /* symbolWye */]; });
__webpack_require__.d(d3_namespaceObject, "curveBasisClosed", function() { return d3_shape_src["e" /* curveBasisClosed */]; });
__webpack_require__.d(d3_namespaceObject, "curveBasisOpen", function() { return d3_shape_src["f" /* curveBasisOpen */]; });
__webpack_require__.d(d3_namespaceObject, "curveBasis", function() { return d3_shape_src["d" /* curveBasis */]; });
__webpack_require__.d(d3_namespaceObject, "curveBundle", function() { return d3_shape_src["g" /* curveBundle */]; });
__webpack_require__.d(d3_namespaceObject, "curveCardinalClosed", function() { return d3_shape_src["i" /* curveCardinalClosed */]; });
__webpack_require__.d(d3_namespaceObject, "curveCardinalOpen", function() { return d3_shape_src["j" /* curveCardinalOpen */]; });
__webpack_require__.d(d3_namespaceObject, "curveCardinal", function() { return d3_shape_src["h" /* curveCardinal */]; });
__webpack_require__.d(d3_namespaceObject, "curveCatmullRomClosed", function() { return d3_shape_src["l" /* curveCatmullRomClosed */]; });
__webpack_require__.d(d3_namespaceObject, "curveCatmullRomOpen", function() { return d3_shape_src["m" /* curveCatmullRomOpen */]; });
__webpack_require__.d(d3_namespaceObject, "curveCatmullRom", function() { return d3_shape_src["k" /* curveCatmullRom */]; });
__webpack_require__.d(d3_namespaceObject, "curveLinearClosed", function() { return d3_shape_src["o" /* curveLinearClosed */]; });
__webpack_require__.d(d3_namespaceObject, "curveLinear", function() { return d3_shape_src["n" /* curveLinear */]; });
__webpack_require__.d(d3_namespaceObject, "curveMonotoneX", function() { return d3_shape_src["p" /* curveMonotoneX */]; });
__webpack_require__.d(d3_namespaceObject, "curveMonotoneY", function() { return d3_shape_src["q" /* curveMonotoneY */]; });
__webpack_require__.d(d3_namespaceObject, "curveNatural", function() { return d3_shape_src["r" /* curveNatural */]; });
__webpack_require__.d(d3_namespaceObject, "curveStep", function() { return d3_shape_src["s" /* curveStep */]; });
__webpack_require__.d(d3_namespaceObject, "curveStepAfter", function() { return d3_shape_src["t" /* curveStepAfter */]; });
__webpack_require__.d(d3_namespaceObject, "curveStepBefore", function() { return d3_shape_src["u" /* curveStepBefore */]; });
__webpack_require__.d(d3_namespaceObject, "stack", function() { return d3_shape_src["E" /* stack */]; });
__webpack_require__.d(d3_namespaceObject, "stackOffsetExpand", function() { return d3_shape_src["G" /* stackOffsetExpand */]; });
__webpack_require__.d(d3_namespaceObject, "stackOffsetDiverging", function() { return d3_shape_src["F" /* stackOffsetDiverging */]; });
__webpack_require__.d(d3_namespaceObject, "stackOffsetNone", function() { return d3_shape_src["H" /* stackOffsetNone */]; });
__webpack_require__.d(d3_namespaceObject, "stackOffsetSilhouette", function() { return d3_shape_src["I" /* stackOffsetSilhouette */]; });
__webpack_require__.d(d3_namespaceObject, "stackOffsetWiggle", function() { return d3_shape_src["J" /* stackOffsetWiggle */]; });
__webpack_require__.d(d3_namespaceObject, "stackOrderAppearance", function() { return d3_shape_src["K" /* stackOrderAppearance */]; });
__webpack_require__.d(d3_namespaceObject, "stackOrderAscending", function() { return d3_shape_src["L" /* stackOrderAscending */]; });
__webpack_require__.d(d3_namespaceObject, "stackOrderDescending", function() { return d3_shape_src["M" /* stackOrderDescending */]; });
__webpack_require__.d(d3_namespaceObject, "stackOrderInsideOut", function() { return d3_shape_src["N" /* stackOrderInsideOut */]; });
__webpack_require__.d(d3_namespaceObject, "stackOrderNone", function() { return d3_shape_src["O" /* stackOrderNone */]; });
__webpack_require__.d(d3_namespaceObject, "stackOrderReverse", function() { return d3_shape_src["P" /* stackOrderReverse */]; });
__webpack_require__.d(d3_namespaceObject, "transition", function() { return d3_transition_src["c" /* transition */]; });
__webpack_require__.d(d3_namespaceObject, "active", function() { return d3_transition_src["a" /* active */]; });
__webpack_require__.d(d3_namespaceObject, "interrupt", function() { return d3_transition_src["b" /* interrupt */]; });
__webpack_require__.d(d3_namespaceObject, "zoom", function() { return d3_zoom_src["a" /* zoom */]; });
__webpack_require__.d(d3_namespaceObject, "zoomTransform", function() { return d3_zoom_src["c" /* zoomTransform */]; });
__webpack_require__.d(d3_namespaceObject, "zoomIdentity", function() { return d3_zoom_src["b" /* zoomIdentity */]; });

// EXTERNAL MODULE: ../node_modules/@babel/runtime/helpers/typeof.js
var helpers_typeof = __webpack_require__(62);
var typeof_default = /*#__PURE__*/__webpack_require__.n(helpers_typeof);

// EXTERNAL MODULE: ../node_modules/d3-drag/src/index.js + 3 modules
var src = __webpack_require__(116);

// EXTERNAL MODULE: ../node_modules/d3-force/src/index.js + 31 modules
var d3_force_src = __webpack_require__(158);

// EXTERNAL MODULE: ../node_modules/d3-selection/src/index.js + 4 modules
var d3_selection_src = __webpack_require__(10);

// EXTERNAL MODULE: ../node_modules/d3-timer/src/index.js + 1 modules
var d3_timer_src = __webpack_require__(68);

// EXTERNAL MODULE: ../node_modules/d3-shape/src/index.js + 52 modules
var d3_shape_src = __webpack_require__(157);

// EXTERNAL MODULE: ../node_modules/d3-transition/src/index.js + 40 modules
var d3_transition_src = __webpack_require__(61);

// EXTERNAL MODULE: ../node_modules/d3-zoom/src/index.js + 6 modules
var d3_zoom_src = __webpack_require__(159);

// CONCATENATED MODULE: ./lib/d3.js







// EXTERNAL MODULE: ../node_modules/babel-polyfill/lib/index.js
var lib = __webpack_require__(162);

// CONCATENATED MODULE: ./images/model.png
/* harmony default export */ var model = ("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAYAAADhu0ooAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3FpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmN2M2MTUyYi1jYmJmLTdhNDItOWRkZS00YmMxMjlmYzRmMmIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NUY0NTlDQzA1ODE3MTFFOEE2RDREMDVGRkJGMEY1NjYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NUY0NTlDQkY1ODE3MTFFOEE2RDREMDVGRkJGMEY1NjYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjM3MDFhMzhmLTJjNDMtOWI0My1iNWFhLWVkNjMzMzZjYjQ1ZCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpmN2M2MTUyYi1jYmJmLTdhNDItOWRkZS00YmMxMjlmYzRmMmIiLz4gPC9y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");
// CONCATENATED MODULE: ./lib/chart.js




console.log(d3_namespaceObject); //判断浏览器版本

var Env = function () {
  var UA = window.navigator.userAgent.toLowerCase(),
      isEdge = UA && UA.indexOf('edge/') > 0,
      inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform,
      weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
  return {
    Edge: isEdge,
    IE: function () {
      var isIE = UA && /msie|trident/.test(UA);
      if (!isIE) return false;
      if (/rv:([\d.]+)\) like gecko/.test(UA)) return 11;
      if (document.all && !!window.atob) return 10;
      if (document.all && !!window.addEventListener) return 9;
      if (document.all && !!document.querySelector) return 8;
      if (document.all && !!window.XMLHttpRequest) return 7;
      if (document.all && !!document.compatMode) return 6;
      return 5;
    }(),
    Chrome: UA && /chrome\/\d+/.test(UA) && !isEdge,
    FF: UA && !!UA.match(/firefox\/(\d+)/),
    Android: UA && UA.indexOf('android') > 0 || weexPlatform === 'android',
    IOS: UA && /iphone|ipad|ipod|ios/.test(UA) || weexPlatform === 'ios'
  };
}(); //勾股定理计算两点之间的距离


function getDistance(s, t) {
  return Math.sqrt(Math.pow(t.x - s.x, 2) + Math.pow(t.y - s.y, 2));
} //三角函数计算两点之间的线段与水平线之间的旋转角度


function getRotate(s, t) {
  var f = t.y > s.y ? 1 : -1,
      r = f * Math.asin(Math.abs(t.y - s.y) / getDistance(s, t));
  return (t.x > s.x ? r : f * Math.PI - r) * (180 / Math.PI);
} //根据两点之间的距离，与水平夹角，及一点的坐标，计算另一点的坐标


function getPoint(r, a, p) {
  var ar = a * Math.PI / 180;
  return [p.x + r * Math.cos(ar), p.y + r * Math.sin(ar)];
} //根据海伦公式(三边求面积法)，获取每个边的高


function getHeight(a, b, c) {
  var p = (a + b + c) / 2,
      S = Math.sqrt(p * (p - a) * (p - b) * (p - c));
  return [2 * S / a, 2 * S / b, 2 * S / c];
} //对数值直接截取几位小数，不四舍五入


function cutNumber(n, c) {
  if (Number.isNaN(+n)) return n;
  return Number(String(+n).replace(new RegExp('^(.*\\..{' + c + '}).*$'), '$1'));
} //根据给定的半径r,箭头长度l,以及点距d，画线路径


function getStraightPath(t, r, l, d) {
  //箭头本来可以使用maker来取代，但是IE浏览器会造成线显示不出来，所以这里箭头直接画出来
  var a = t === 'B1' || t === 'B0' ? 2 / 3 : 1,
      //B开头的是锥形箭头，否则是三角形箭头
  D = '';

  if (t === 'A1' || t === 'B1') {
    //1结尾的是双向箭头，否则是单向箭头
    D = "M".concat(r + a * l, ",0 L").concat(r + l, ",").concat(-l / 2, " ").concat(r, ",0 ").concat(r + l, ",").concat(l / 2, " ").concat(r + a * l, ",0 ");
  } else {
    D = "M".concat(r, ",0 L");
  }

  D += "".concat(d - r - a * l, ",0 ").concat(d - r - l, ",").concat(-l / 2, " ").concat(d - r, ",0 ").concat(d - r - l, ",").concat(l / 2, " ").concat(d - r - a * l, ",0 Z");
  return D;
} //根据起点和终点画出曲线路径，这是一种只会在节点边缘上下左右四个点连接的曲线


function getCurvePath(t, r, l, ps, pt) {
  //箭头本来可以使用maker来取代，但是IE浏览器会造成线显示不出来，所以这里箭头直接画出来
  var awl = t === 'B1' || t === 'B0' ? 2 / 3 : 1,
      //B开头的是锥形箭头，否则是三角形箭头
  angle = getRotate(ps, pt),
      pn = 1,
      ox = 0,
      oy = 0,
      opn = 1;

  if (angle >= -45 && angle < 45) {
    pn = 1;
    ox = 1;
    oy = 0;
  } else if (angle >= -180 && angle < -135 || angle >= 135 && angle < 180) {
    pn = -1;
    ox = 1;
    oy = 0;
  } else if (angle >= 45 && angle < 135) {
    pn = 1;
    ox = 0;
    oy = 1;
    opn = 0;
  } else if (angle >= -135 && angle < -45) {
    pn = -1;
    ox = 0;
    oy = 1;
    opn = 0;
  }

  var p1 = [ps.x + r * pn * ox, ps.y + r * pn * oy],
      p2 = [ps.x + (r + l * awl) * pn * ox, ps.y + (r + l * awl) * pn * oy],
      p3 = [ps.x + (r + l) * pn * ox + l / 2 * pn * oy, ps.y + (r + l) * pn * oy - l / 2 * pn * ox],
      p4 = [ps.x + (r + l) * pn * ox - l / 2 * pn * oy, ps.y + (r + l) * pn * oy + l / 2 * pn * ox],
      p5 = [pt.x - r * pn * ox, pt.y - r * pn * oy],
      p6 = [pt.x - (r + l * awl) * pn * ox, pt.y - (r + l * awl) * pn * oy],
      p7 = [pt.x - (r + l) * pn * ox + l / 2 * pn * oy, pt.y - l / 2 * pn * ox - (r + l) * pn * oy],
      p8 = [pt.x - (r + l) * pn * ox - l / 2 * pn * oy, pt.y + l / 2 * pn * ox - (r + l) * pn * oy],
      p9 = [],
      p10 = [],
      D = '';

  if (opn) {
    p9 = [(p2[0] + p6[0]) / 2, p2[1]];
    p10 = [(p2[0] + p6[0]) / 2, p6[1]];
  } else {
    p9 = [p2[0], (p2[1] + p6[1]) / 2];
    p10 = [p6[0], (p2[1] + p6[1]) / 2];
  }

  if (t === 'A1' || t === 'B1') {
    //1结尾的是双向箭头，否则是单向箭头
    D = "M".concat(p2[0], ",").concat(p2[1], " L").concat(p3[0], ",").concat(p3[1], " ").concat(p1[0], ",").concat(p1[1], " ").concat(p4[0], ",").concat(p4[1], " ").concat(p2[0], ",").concat(p2[1], " ");
  } else {
    D = "M".concat(p1[0], ",").concat(p1[1], " ");
  }

  D += "C".concat(p9[0], ",").concat(p9[1], " ").concat(p10[0], ",").concat(p10[1], " ").concat(p6[0], ",").concat(p6[1], " L").concat(p7[0], ",").concat(p7[1], " ").concat(p5[0], ",").concat(p5[1], " ").concat(p8[0], ",").concat(p8[1], " ").concat(p6[0], ",").concat(p6[1], " C").concat(p10[0], ",").concat(p10[1], " ").concat(p9[0], ",").concat(p9[1], " ");

  if (t === 'A1' || t === 'B1') {
    //1结尾的是双向箭头，否则是单向箭头
    D += "".concat(p2[0], ",").concat(p2[1], " Z");
  } else {
    D += "".concat(p1[0], ",").concat(p1[1], " Z");
  }

  return D;
} //根据起点和终点画出曲线路径，这是一种可以在节点边缘任一点连接的曲线


function getCurvePath2(t, r, l, ps, pt) {
  //箭头本来可以使用maker来取代，但是IE浏览器会造成线显示不出来，所以这里箭头直接画出来
  var awl = t === 'B1' || t === 'B0' ? 2 / 3 : 1,
      //B开头的是锥形箭头，否则是三角形箭头
  aw = Math.sqrt(Math.pow(l, 2) + Math.pow(l / 2, 2)),
      aa = 180 * Math.atan(1 / 2) / Math.PI,
      angle = getRotate(ps, pt),
      p1 = getPoint(r, angle, ps),
      p2 = getPoint(r + l * awl, angle, ps),
      p3 = getPoint(aw, angle + aa, {
    x: p1[0],
    y: p1[1]
  }),
      p4 = getPoint(aw, angle - aa, {
    x: p1[0],
    y: p1[1]
  }),
      p5 = getPoint(r, 180 + angle, pt),
      p6 = getPoint(r + l * awl, 180 + angle, pt),
      p7 = getPoint(aw, 180 + angle - aa, {
    x: p5[0],
    y: p5[1]
  }),
      p8 = getPoint(aw, 180 + angle + aa, {
    x: p5[0],
    y: p5[1]
  }),
      p9 = [(p2[0] + p6[0]) / 2, p2[1]],
      p10 = [(p2[0] + p6[0]) / 2, p6[1]],
      D = '';

  if (t === 'A1' || t === 'B1') {
    //1结尾的是双向箭头，否则是单向箭头
    D = "M".concat(p2[0], ",").concat(p2[1], " L").concat(p3[0], ",").concat(p3[1], " ").concat(p1[0], ",").concat(p1[1], " ").concat(p4[0], ",").concat(p4[1], " ").concat(p2[0], ",").concat(p2[1], " ");
  } else {
    D = "M".concat(p1[0], ",").concat(p1[1], " ");
  }

  D += "C".concat(p9[0], ",").concat(p9[1], " ").concat(p10[0], ",").concat(p10[1], " ").concat(p6[0], ",").concat(p6[1], " L").concat(p7[0], ",").concat(p7[1], " ").concat(p5[0], ",").concat(p5[1], " ").concat(p8[0], ",").concat(p8[1], " ").concat(p6[0], ",").concat(p6[1], " C").concat(p10[0], ",").concat(p10[1], " ").concat(p9[0], ",").concat(p9[1], " ");

  if (t === 'A1' || t === 'B1') {
    //1结尾的是双向箭头，否则是单向箭头
    D += "".concat(p2[0], ",").concat(p2[1], " Z");
  } else {
    D += "".concat(p1[0], ",").concat(p1[1], " Z");
  }

  return D;
} //判断矩形与圆是否相交


function rectCrossCircle(rect, circle) {
  var rx = rect.x,
      ry = rect.y,
      rw = rect.width,
      rh = rect.height,
      cx = circle.x,
      cy = circle.y,
      cr = circle.radius,
      cross = false; //九种情况

  if (cx <= rx) {
    if (cy <= ry) {
      //圆心到矩形左上角点的距离
      if (getDistance({
        x: rx,
        y: ry
      }, {
        x: cx,
        y: cy
      }) <= cr) {
        //相交
        cross = true;
      }
    } else if (cy > ry && cy < ry + rh) {
      //圆心到矩形左边线的垂直距离
      if (rx - cx <= cr) {
        //相交
        cross = true;
      }
    } else if (cy >= ry + rh) {
      //圆心到矩形左下角点的距离
      if (getDistance({
        x: rx,
        y: ry + rh
      }, {
        x: cx,
        y: cy
      }) <= cr) {
        //相交
        cross = true;
      }
    }
  } else if (cx > rx && cx < rx + rw) {
    if (cy <= ry) {
      //圆心到矩形上边线的垂直距离
      if (ry - cy <= cr) {
        //相交
        cross = true;
      }
    } else if (cy > ry && cy < ry + rh) {
      //圆心在矩形内部，必相交
      cross = true;
    } else if (cy >= ry + rh) {
      //圆心到矩形下边线的垂直距离
      if (cy - (ry + rh) <= cr) {
        //相交
        cross = true;
      }
    }
  } else if (cx >= rx + rw) {
    if (cy <= ry) {
      //圆心到矩形右上角点的距离
      if (getDistance({
        x: rx + rw,
        y: ry
      }, {
        x: cx,
        y: cy
      }) <= cr) {
        //相交
        cross = true;
      }
    } else if (cy > ry && cy < ry + rh) {
      //圆心到矩形右边线的垂直距离
      if (cx - (rx + rw) <= cr) {
        //相交
        cross = true;
      }
    } else if (cy >= ry + rh) {
      //圆心到矩形右下角点的距离
      if (getDistance({
        x: rx + rw,
        y: ry + rh
      }, {
        x: cx,
        y: cy
      }) <= cr) {
        //相交
        cross = true;
      }
    }
  }

  return cross;
} //判断矩形是否与线段相交


function rectCrossLine(rect, line) {
  var rx = rect.x,
      ry = rect.y,
      rw = rect.width,
      rh = rect.height,
      sx = line.sx,
      sy = line.sy,
      tx = line.tx,
      ty = line.ty,
      lr = getRotate({
    x: sx,
    y: sy
  }, {
    x: tx,
    y: ty
  }),
      ld = getDistance({
    x: sx,
    y: sy
  }, {
    x: tx,
    y: ty
  }),
      cross = false; //以竖向为中心，线段向右倾斜的情况（一，三象限，斜率为正直）

  if (lr >= -90 && lr < 0 || lr < 180 && lr >= 90) {
    //类似于矩形与矩形相交，考虑坐标起始点相反两种情况，所以使用最大最小值比较
    if (Math.min(sx, tx) <= rx + rw && Math.max(sx, tx) >= rx && Math.min(sy, ty) <= ry + rh && Math.max(sy, ty) >= ry) {
      //计算定值距离
      lr = (180 - lr) % 180;
      var kr = 180 - lr - getRotate({
        x: rx,
        y: ry
      }, {
        x: rx + rw,
        y: ry + rh
      }),
          distance = Math.sin(kr * Math.PI / 180) * Math.sqrt(Math.pow(rw, 2) + Math.pow(rh, 2)); //计算点到线的垂直距离之和

      var a1 = getDistance({
        x: rx,
        y: ry
      }, {
        x: sx,
        y: sy
      }),
          b1 = getDistance({
        x: rx,
        y: ry
      }, {
        x: tx,
        y: ty
      }),
          a2 = getDistance({
        x: rx + rw,
        y: ry + rh
      }, {
        x: sx,
        y: sy
      }),
          b2 = getDistance({
        x: rx + rw,
        y: ry + rh
      }, {
        x: tx,
        y: ty
      }),
          height = getHeight(a1, b1, ld)[2] + getHeight(a2, b2, ld)[2]; //如果相交的情况下，则矩形两条对角线其中一条与线段同一方向倾斜（即斜率正负相同）的对角线的两个点（矩形顶点）到线段的垂直距离之差，以及反方向倾斜（即斜率正负相反）的对角线两个点（矩形顶点）到线段的垂直距离之和都是一个定值，这里验证一种即可。

      if (cutNumber(distance, 10) === cutNumber(height, 10)) {
        //小数点的误差，所以需要截取前一段取大致数值
        cross = true;
      }
    } //以竖向为中心，线段向左倾斜的情况（二，四象限，斜率为正直）

  } else if (lr < 90 && lr >= 0 || lr >= -180 && lr < -90) {
    //类似于矩形与矩形相交，考虑坐标起始点相反两种情况，所以使用最大最小值比较
    if (Math.min(sx, tx) <= rx + rw && Math.max(sx, tx) >= rx && Math.max(sy, ty) >= ry && Math.min(sy, ty) <= ry + rh) {
      //计算定值距离
      lr = (180 + lr) % 180;

      var _kr = 180 - lr + getRotate({
        x: rx,
        y: ry + rh
      }, {
        x: rx + rw,
        y: ry
      }),
          _distance = Math.sin(_kr * Math.PI / 180) * Math.sqrt(Math.pow(rw, 2) + Math.pow(rh, 2)); //计算点到线的垂直距离之和


      var _a = getDistance({
        x: rx,
        y: ry + rh
      }, {
        x: sx,
        y: sy
      }),
          _b = getDistance({
        x: rx,
        y: ry + rh
      }, {
        x: tx,
        y: ty
      }),
          _a2 = getDistance({
        x: rx + rw,
        y: ry
      }, {
        x: sx,
        y: sy
      }),
          _b2 = getDistance({
        x: rx + rw,
        y: ry
      }, {
        x: tx,
        y: ty
      }),
          _height = getHeight(_a, _b, ld)[2] + getHeight(_a2, _b2, ld)[2]; //如果相交的情况下，则矩形两条对角线其中一条与线段同一方向倾斜（即斜率正负相同）的对角线的两个点（矩形顶点）到线段的垂直距离之差，以及反方向倾斜（即斜率正负相反）的对角线两个点（矩形顶点）到线段的垂直距离之和都是一个定值，这里验证一种即可。


      if (cutNumber(_distance, 10) === cutNumber(_height, 10)) {
        cross = true;
      }
    }
  }

  return cross;
} //判断矩形是否与矩形相交


function rectCrossRect(rect1, rect2) {
  var x1 = rect1.x,
      y1 = rect1.y,
      w1 = rect1.width,
      h1 = rect1.height,
      x2 = rect2.x,
      y2 = rect3.y,
      w2 = rect2.width,
      h2 = rect2.height,
      cross = false; //rect2上边竖坐标值小于等于rect1下边竖坐标值&&rect2下边竖坐标值大于等于rect1下边竖坐标值并且rect2左边横坐标值小于等于rect1右边横坐标值&&rect2右边横坐标值大于等于rect1左边边横坐标值，则两矩形必相交

  if (y2 + h2 >= y1 && y2 <= y1 + h1 && x2 + w2 >= x1 && x2 <= x1 + w1) {
    cross = true;
  }

  return cross;
} //阻止相关事件默认行为及冒泡，主要针对菜单元素的


function _stopAllEvents(el) {
  el.on('click', function () {
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  }).on('dblclick', function () {
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  }).on('contextmenu', function () {
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  }).on('wheel', function () {
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  }).on('mousedown', function () {
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  }).on('mousemove', function () {
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  }).on('mouseup', function () {
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  }).on('mouseover', function () {
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  }).on('mouseout', function () {
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  });
} //右键菜单统一注册处理


function _contextmenu(type, el) {
  var _this2 = this;

  var key = type === 'node' ? 'nodeMenu' : type === 'line' ? 'lineMenu' : 'viewMenu';
  if (!this._options[key] || !this._options[key].length) return;
  var width = 120,
      //菜单宽度
  height = 30,
      //单个菜单高度
  marginLeft = 20,
      //菜单文字离左边距离
  totalHeight = 30,
      menuX = 0,
      menuY = 0; //菜单总宽度

  el.on('contextmenu.contextmenu', function (n) {
    var args = [n],
        classId = '';

    if (type === 'line') {
      args = [_this2._lines.idMap[n.sid], _this2._lines.idMap[n.tid], n.twa];
    }

    classId = type + (args[0] ? '-' + args[0].id : '') + (args[1] ? '-' + args[1].id : '');
    menuX = d3_selection_src["e" /* event */].clientX;
    menuY = d3_selection_src["e" /* event */].clientY; //根据菜单里的test检测点击对象是否可以显示改菜单

    var menus = _this2._options[key].filter(function (m) {
      return !(typeof m.test === 'function' && m.test.apply(m, args) === false);
    });

    if (!menus.length) return;
    totalHeight = menus.length * height;
    menus = menus.map(function (m, i) {
      return {
        index: i,
        data: m
      };
    }); //创建右键菜单元素

    if (!_this2._contextmenu || _this2._contextmenu.empty()) {
      _this2._contextmenu = _this2._svg.append('g').attr('opacity', 0);
    }

    _this2._contextmenu.attr('class', '').classed('contextmenu contextmenu-' + classId, true); //创建子菜单组，会合并元素替换上一次出现的时候数据


    var children = _this2._contextmenu.attr('opacity', 0).selectAll('g').data(menus, function (m) {
      return m.index;
    }).join('g').attr('cursor', 'pointer').attr('transform', function (m, i) {
      return 'translate(0,' + i * height + ')';
    }).on('click.contextmenu', function (m) {
      //菜单点击事件
      var event = d3_selection_src["e" /* event */];
      event.menuX = menuX;
      event.menuY = menuY;
      args.splice(0, 0, event);
      typeof_default()(m.data.click === 'function') ? m.data.click.apply(m.data, args) : null; //处理完事件后隐藏菜单

      _contextmenuHide.call(_this2);
    }).on('mouseover.contextmenu', function () {
      //鼠标移上菜单时的处理
      var gmenu = d3_selection_src["k" /* select */](this);
      gmenu.select('rect').attr('fill', '#c3e5f9'); //gmenu.select('text').attr('fill', '#fff');
    }).on('mouseout.contextmenu', function () {
      //鼠标移出菜单时的处理
      var gmenu = d3_selection_src["k" /* select */](this);
      gmenu.select('rect').attr('fill', '#fff'); //gmenu.select('text').attr('fill', '#333');
    }); //对菜单上的所有事件进行阻止冒泡和默认行为，会阻止在此事件触发之后的所有事件


    _stopAllEvents.call(_this2, children); //创建子菜单的文字及占据范围的rect


    children.each(function (m, i) {
      var child = d3_selection_src["k" /* select */](this),
          rect = child.select('rect'),
          text = child.select('text');

      if (rect.empty()) {
        rect = child.append('rect').attr('width', width).attr('height', height).attr('fill', '#fff').attr('fill-opacity', .85).attr('stroke', '#fff').attr('stroke-width', 1).attr('stroke-linejoin', 'round'); //圆角处理
      }

      rect.attr('stroke-dasharray', i === 0 ? '150,120' : i === menus.length - 1 ? '0,120,60' : '0,120,30,0'); //处理菜单边框的，控制四边显示哪些

      if (text.empty()) {
        text = child.append('text').attr('dy', '.3em').attr('transform', 'translate(' + marginLeft + ',' + height / 2 + ')').attr('font-size', '14px').attr('fill', '#333');
      }

      text.text(function (m) {
        return m.data.name;
      });
    }); //计算右键菜单位置，主要考虑靠下及靠右点击，菜单不应该显示在点击位置，而是在窗口内显示

    var svgNode = _this2._svg.node(),
        svgRect = svgNode.getBoundingClientRect(),
        mouse = d3_selection_src["h" /* mouse */](svgNode),
        //获取鼠标相对于svg元素的xy坐标
    margin = 2,
        //菜单与画布边缘边距
    delt = 1,
        //菜单左上角与鼠标点错开一定的像素
    x = mouse[0],
        y = mouse[1];

    if (svgRect.width < width + margin) {
      x = 0;
    } else if (svgRect.width - x < width + margin) {
      x = svgRect.width - (width + margin);
    }

    if (svgRect.height < totalHeight + margin) {
      y = 0;
    } else if (svgRect.height - y < totalHeight + margin) {
      y = y - (totalHeight + margin);

      if (y < 0) {
        y = 0;
      }
    } //菜单动画显示以及位置更新


    _this2._contextmenu.attr('transform', 'translate(' + (x + delt) + ',' + (y + delt) + ')').attr('display', null).transition().attr('opacity', 1);

    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  });
} //隐藏右键菜单函数


function _contextmenuHide() {
  var _this3 = this;

  if (this._contextmenu && this._contextmenu.attr('display') !== 'none') {
    this._contextmenu.transition().attr('opacity', 0).end().then(function () {
      _this3._contextmenu.attr('display', 'none');
    })["catch"](function (e) {});
  }
} //快速菜单统一注册处理


function _fastmenu(type, el) {
  var key = type === 'node' ? 'nodeFastMenu' : type === 'line' ? 'lineFastMenu' : 'viewFastMenu';
  if (!this._options[key] || !this._options[key].length) return;

  var _this = this;

  el.on('click.fastmenu', function (n) {
    //计算点击范围内可触发快速菜单
    var mouse = d3_selection_src["h" /* mouse */](this),
        radius = getDistance({
      x: 0,
      y: 0
    }, {
      x: mouse[0],
      y: mouse[1]
    });
    if (radius > _this._options.radius - _this._options.split) return;
    var args = [n],
        classId = '';

    if (type === 'line') {
      args = [_this._lines.idMap[n.sid], _this._lines.idMap[n.tid], n.twa];
    }

    classId = type + (args[0] ? '-' + args[0].id : '') + (args[1] ? '-' + args[1].id : ''); //根据菜单里的test函数检测点击对象是否可以显示该菜单

    var menus = _this._options[key].filter(function (m) {
      return !(typeof m.test === 'function' && m.test.apply(m, args) === false);
    });

    if (!menus.length) return; //创建快速菜单元素

    if (!_this._fastmenu || _this._fastmenu.empty()) {
      _this._fastmenu = _this._svg.append('g').attr('opacity', 0);
    } //更新class


    _this._fastmenu.attr('class', '').classed('fastmenu fastmenu-' + classId, true); //创建子菜单组，会合并元素替换上一次出现的时候数据


    var children = _this._fastmenu.selectAll('g').data(_generator.call(_this, 'pie')(menus), function (m) {
      return m.index;
    }).join('g').attr('cursor', 'pointer').on('click.fastmenu', function (m) {
      //菜单点击事件
      args.splice(0, 0, d3_selection_src["e" /* event */]);
      typeof m.data.click === 'function' ? m.data.click.apply(m.data, args) : null; //处理完事件后隐藏菜单

      _fastmenuHide.call(_this);
    }).on('mouseover.fastmenu', function () {
      //鼠标移上菜单时的处理
      var gmenu = d3_selection_src["k" /* select */](this);
      gmenu.select('path').attr('fill', '#c3e5f9');
      gmenu.select('text').attr('fill', '#333');
    }).on('mouseout.fastmenu', function () {
      //鼠标移出菜单时的处理
      var gmenu = d3_selection_src["k" /* select */](this);
      gmenu.select('path').attr('fill', '#00A68F');
      gmenu.select('text').attr('fill', '#fff');
    }); //对菜单上的所有事件进行阻止冒泡和默认行为，会阻止在此事件触发之后的所有事件


    _stopAllEvents.call(_this, children); //创建子菜单的文字及path


    children.each(function (m, i) {
      var child = d3_selection_src["k" /* select */](this),
          path = child.select('path'),
          text = child.select('text');

      if (path.empty()) {
        path = child.append('path').attr('fill', '#00A68F');
      } //可能上一次打开和本次打开，菜单个数都不一样，所以要重新绘制路径


      path.attr('d', _generator.call(_this, 'arc'));

      if (text.empty()) {
        text = child.append('text').attr('text-anchor', 'middle').attr('dy', '.3em').attr('font-size', '12px').attr('fill', '#fff');
      }

      text.attr('transform', 'translate(' + _generator.call(_this, 'arc').centroid(m) + ')').text(m.data.name);
    }); //菜单动画显示，位置更新等

    _this._fastmenu.attr('transform', d3_zoom_src["c" /* zoomTransform */](this).toString()).attr('display', null).transition().attr('opacity', 1).selectAll('g').attr('transform', 'translate(' + (args[0] && !args[1] ? args[0].x : mouse[0]) + ',' + (args[0] && !args[1] ? args[0].y : mouse[1]) + ')');
  });
} //隐藏快速菜单函数


function _fastmenuHide() {
  var _this4 = this;

  if (this._fastmenu && this._fastmenu.attr('display') !== 'none') {
    this._fastmenu.transition().attr('opacity', 0).end().then(function () {
      _this4._fastmenu.attr('display', 'none');
    })["catch"](function (e) {});
  }
} //只调用一次隐藏快速菜单函数


_fastmenuHide.onceCall = function () {
  var called = false;
  return function () {
    if (!called) {
      var context = arguments[0],
          args = [],
          len = arguments.length - 1;

      while (len--) {
        args[len] = arguments[len + 1];
      }

      _fastmenuHide.apply(context, args.slice(1));

      called = true;
    }
  };
}; //增加修改替换等节点时合并线


function _lineMerge(replace, update, node) {
  var _this5 = this;

  var lineMap = {},
      len = this._lines.length; //循环合并

  while (len--) {
    var l = this._lines[len];

    if (l.sid == replace.id && l.tid == update.id || l.sid == update.id && l.tid == replace.id) {
      //将要合并的两个节点之间的连接删除
      this._lines.splice(len, 1);
    } else if (l.sid == replace.id || l.tid == replace.id || l.sid == update.id || l.tid == update.id) {
      var skey = 'sid',
          tkey = 'tid';

      if (l.sid == replace.id || l.sid == update.id) {
        skey = 'tid';
        tkey = 'sid';
      }

      if (!!lineMap[l[skey]]) {
        var _l = lineMap[l[skey]];

        if (_l.twa) {
          //双向
          this._lines.splice(len, 1);
        } else {
          if (_l[skey] == l[skey]) {
            //同向
            _l.twa = l.twa;

            this._lines.splice(len, 1);
          } else {
            //反向
            _l.twa = true;

            this._lines.splice(len, 1);
          }
        }
      } else {
        l[tkey] = node.id;
        this._lines.idMap[node.id] = node;
        lineMap[l[skey]] = l;
      }
    }
  } //循环判断合并后的线和新节点是否可以连线


  var _loop = function _loop(k) {
    var line = lineMap[k],
        snode = _this5._lines.idMap[line.sid],
        tnode = _this5._lines.idMap[line.tid],
        isPositive = _this5._options.canLink(snode, tnode),
        isOpposite = false;

    if (line.twa) {
      isOpposite = _this5._options.canLink(tnode, snode);
    }

    if (!isPositive && !isOpposite) {
      //删掉该线
      var index = _this5._lines.findIndex(function (l) {
        return line === l;
      });

      if (index !== -1) _this5._lines.splice(index, 1);
    } else if (isPositive && !isOpposite) {
      line.twa = false;
    } else if (!isPositive && isOpposite) {
      line.twa = false;
      var tempId = line.sid;
      line.sid = line.tid;
      line.tid = tempId;
    }
  };

  for (var k in lineMap) {
    _loop(k);
  }

  _lines.call(this);
} //构建d3相关功能函数生成器


var _generator = function () {
  var generator = {};
  return function (type) {
    var _this6 = this;

    if (!generator[type]) {
      var _this = this;

      if (type === 'zoom') {
        //构造缩放事件生成器
        generator[type] = d3_zoom_src["a" /* zoom */]().scaleExtent([0.1, 10]) //缩放比例在0.1-1-10之间
        .on('zoom', function () {
          /*//考虑缩放的时候外层容器加入滚动条
          if (d3.event.transform.k > 1) {
              this._svg
                  .attr('width', d3.event.transform.k * 100 + '%')
                  .attr('height', d3.event.transform.k * 100 + '%');
          }
          this._svg.selectAll('g.node-line').attr('transform', 'scale(' + d3.event.transform.k + ')');
          this._svg.selectAll('g.fastmenu').attr('transform', 'scale(' + d3.event.transform.k + ')');
          let pnode = this._svg.node().parentNode;
          pnode.scrollTop = -d3.event.transform.y;
          pnode.scrollLeft = -d3.event.transform.x;*/
          //rect元素变化改变节点-连线组的位移及缩放，IE9必须显示的调用toString方法
          _this6._svg.selectAll('g.node,g.line,g.rect').attr('transform', d3_selection_src["e" /* event */].transform.toString()); //改变节点快速菜单的位移及缩放，主要是跟随节点-连线一起变化


          _this6._svg.selectAll('g.fastmenu').attr('transform', d3_selection_src["e" /* event */].transform.toString());
        });
      } else if (type === 'drag') {
        //构造拖拽事件生成器
        generator[type] = src["a" /* drag */]().on('start', function (n) {
          //计算鼠标在当前元素上的位置
          var startMouse = d3_selection_src["h" /* mouse */](this);

          if (!n) {
            //表示触发的是svg的拖拽事件
            //构造“选择框”
            var boxSelector = _this._svg.append('rect').classed('box-selector', true).attr('fill', '#ddd').attr('fill-opacity', .45),
                nodeZoom = d3_zoom_src["c" /* zoomTransform */](_this._svg.selectAll('g.rect').node());

            d3_selection_src["e" /* event */].on('drag', function (_) {
              //注册拖动事件
              //拖动时计算并更新“选择框”的位置和大小
              var x = Math.min(startMouse[0], d3_selection_src["e" /* event */].x),
                  y = Math.min(startMouse[1], d3_selection_src["e" /* event */].y),
                  w = Math.abs(d3_selection_src["e" /* event */].x - startMouse[0]),
                  h = Math.abs(d3_selection_src["e" /* event */].y - startMouse[1]);
              boxSelector.attr('x', x).attr('y', y).attr('width', w).attr('height', h);

              _this._nodes.forEach(function (_n) {
                //获取进行缩放和位移后的点坐标及半径长度
                var point = nodeZoom.apply([_n.x, _n.y]),
                    radius = (_this._options.radius - _this._options.split) * nodeZoom.k;

                _selectNode.call(_this, d3_selection_src["k" /* select */]('image.node-' + _n.id), rectCrossCircle({
                  x: x,
                  y: y,
                  width: w,
                  height: h
                }, {
                  x: point[0],
                  y: point[1],
                  radius: radius
                })); //rectCrossRect({ x: x, y: y, width: w, height: h },{ x: _n.x, y: _n.y, width: _n.w, height: _n.h });

              });

              _this._lines.forEach(function (_l) {
                var source = _this._lines.idMap[_l.sid],
                    target = _this._lines.idMap[_l.tid],
                    radius = _this._options.radius,
                    angle = getRotate(source, target); //因为线的起止坐标并不在节点圆心上，而是在节点的半径以外，所以要减去相应的长度

                source = nodeZoom.apply(getPoint(radius, angle, source));
                target = nodeZoom.apply(getPoint(radius, 180 + angle, target)); //如果线是曲线，则相交也按直线算，因为算曲线相交太麻烦了

                _selectLine.call(_this, d3_selection_src["k" /* select */]('path.line-' + _l.sid + '-' + _l.tid), rectCrossLine({
                  x: x,
                  y: y,
                  width: w,
                  height: h
                }, {
                  sx: source[0],
                  sy: source[1],
                  tx: target[0],
                  ty: target[1]
                }));
              });
            }).on('end', function (_) {
              //结束拖动
              //移除“选择框”
              boxSelector.remove();
            });
            return;
          } //获取鼠标点距离节点中心距离


          var radius = getDistance({
            x: 0,
            y: 0
          }, {
            x: startMouse[0],
            y: startMouse[1]
          });

          if (radius <= _this._options.radius - _this._options.split) {
            //此种范围内执行拖拽动作
            //启动力模型tick事件
            _this._simulation.alphaTarget(0.3).restart();

            n.fx = n.x;
            n.fy = n.y; //此处加上一个快速菜单隐藏是因为当前节点mousuedown的时候没有去隐藏（如果是再次单击无需隐藏），所以当拖拽的时候在此处去隐藏菜单

            var onceCall = _fastmenuHide.onceCall();

            d3_selection_src["e" /* event */].on('drag', function (_n) {
              //注册拖动事件
              onceCall(_this); //赋值节点下一点的位置，后面会在tick函数内更新节点位置

              _n.fx = d3_selection_src["e" /* event */].x;
              _n.fy = d3_selection_src["e" /* event */].y;
            }).on('end', function (_n) {
              //结束拖动，并结束tick函数
              _this._simulation.alphaTarget(0);

              _n.fx = null;
              _n.fy = null;
            });
          } else if (radius <= _this._options.radius) {
            //此种范围内执行节点连线动作
            //判断节点是否可以连线
            if (!_this._options.canLink(n)) return; //构造“拖动线”

            var lineHelp = _this._svg.selectAll('g.line').append('path').classed('line-help', true).attr('stroke', '#9dadb5').attr('stroke-width', 2).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round').attr('fill', '#9dadb5');

            d3_selection_src["e" /* event */].on('drag', function (source) {
              //注册拖动事件
              var target = {
                x: startMouse[0] + d3_selection_src["e" /* event */].x,
                y: startMouse[1] + d3_selection_src["e" /* event */].y
              },
                  t = getPoint(_this._options.radius, getRotate(source, target), target);
              target = {
                x: t[0],
                y: t[1]
              }; //因为获取线的path时，终点也会去掉半径，所以这里加上

              var distance = getDistance(source, target); //拖动时计算并更新“拖动线”的位置和角度

              if (distance > 2 * _this._options.radius + _this._options.arrow) {
                //在此范围你才可以出现拖动线
                if (_this._options.lineShape === 'straight') {
                  //直线
                  lineHelp.attr('d', getStraightPath('A0', _this._options.radius, _this._options.arrow, distance)).attr('transform', 'translate(' + source.x + ',' + source.y + ') rotate(' + getRotate(source, target) + ')');
                } else if (_this._options.lineShape === 'curve') {
                  //曲线
                  lineHelp.attr('d', getCurvePath2('A0', _this._options.radius, _this._options.arrow, source, target));
                } else if (_this._options.lineShape === 'curve2') {
                  //曲线
                  lineHelp.attr('d', getCurvePath2('A0', _this._options.radius, _this._options.arrow, source, target));
                }
              }
            }).on('end', function (source) {
              //结束拖动
              //移除“拖动线”
              lineHelp.remove(); //判断结束时鼠标是否落在另一个节点范围内

              var target = d3_selection_src["e" /* event */].sourceEvent.target;

              if (target instanceof SVGImageElement) {
                target = d3_selection_src["k" /* select */](target).datum();
              } else {
                target = null;
              } //判断连线的两个节点之间是都可以连线


              if (!_this._options.canLink(source, target)) return; //终点是落在节点上，并且不是起点的节点，并且原来的线集合里没有起终点的连接

              if (!!target && source.id != target.id && _this._lines.findIndex(function (l) {
                return l.sid == source.id && l.tid == target.id;
              }) === -1) {
                var index = _this._lines.findIndex(function (l) {
                  return l.sid == target.id && l.tid == source.id;
                });

                if (index === -1) {
                  _this._lines.push({
                    sid: source.id,
                    tid: target.id
                  });
                } else {
                  //双向箭头
                  _this._lines[index].twa = true;
                } //更新连线


                _lines.call(_this);
              }
            });
          }
        });
      } else if (type === 'arc') {
        //构造弧形路径生成器
        generator[type] = d3_shape_src["a" /* arc */]().innerRadius(_this._options.radius - 3).outerRadius(_this._options.radius + 17);
      } else if (type === 'pie') {
        //构造环、饼图数据生成器
        generator[type] = d3_shape_src["A" /* pie */]().padAngle(.03).value(function (a, b, c) {
          return 1 / c.length;
        });
      }
    }

    return generator[type];
  };
}(); //选择线


function _selectLine(path, selected) {
  if (selected === false) {
    //取消选择
    path.classed('selected', false).attr('stroke', '#9dadb5').attr('fill', '#9dadb5');
  } else {
    //选择
    path.classed('selected', true).attr('stroke', 'red').attr('fill', 'red');
  }
} //选择节点


function _selectNode(node, selected) {
  if (selected === false) {
    //取消选择
    node.classed('selected', false);
  } else {
    //选择
    node.classed('selected', true);
  }
} //构建节点


function _nodes() {
  var _this7 = this;

  //使用力模型重新构造节点对象数据
  this._simulation.nodes(this._nodes); //在lines集合里放入可以根据node.id直接获取node对象的映射


  this._lines.idMap = {};

  this._nodes.forEach(function (n) {
    _this7._lines.idMap[n.id] = n;
  }); //查找节点组，如果没有则创建


  var gnodeParent = this._svg.selectAll('g.node-line'),
      gnode = gnodeParent.selectAll('g.node');

  if (gnode.empty()) {
    gnode = gnodeParent.append('g').classed('node', true);
  } //创建节点（会和原有数据合并，根据node.id筛选的）


  var _this = this,
      node = gnode.selectAll('g.node-child').data(this._nodes, function (n) {
    return n.id;
  }).join('g').classed('node-child', true).attr('cursor', 'default').on('mousedown.contextmenu', function (n) {
    //由于下面的'drag'事件会阻止冒泡及后续的注册事件，所以在此注册关掉菜单用
    _contextmenuHide.call(_this);

    var mouse = d3_selection_src["h" /* mouse */](this),
        radius = getDistance({
      x: 0,
      y: 0
    }, {
      x: mouse[0],
      y: mouse[1]
    });

    if (!_this._fastmenu || !_this._fastmenu.classed('fastmenu-node-' + n.id) || radius > _this._options.radius - _this._options.split) {
      _fastmenuHide.call(_this);
    }
  }).on('mousemove.line', function (n) {
    //鼠标在节点上移动的时候，判断移动到可连线区域，则改变鼠标样式
    var mouse = d3_selection_src["h" /* mouse */](this),
        radius = getDistance({
      x: 0,
      y: 0
    }, {
      x: mouse[0],
      y: mouse[1]
    }),
        isPointer = radius > _this._options.radius - _this._options.split && radius <= _this._options.radius;
    d3_selection_src["k" /* select */](this).attr('cursor', isPointer ? 'pointer' : null);
  }).on('click.select', function (n) {
    //选中事件
    console.log(new Date().getTime());
    var image = d3_selection_src["k" /* select */](this).select('image');

    _selectNode.call(_this, image, !image.classed('selected')); //防止冒泡到svg的click事件


    d3_selection_src["e" /* event */].stopPropagation();
  }).on('dblclick.dbl', function (n) {
    //双击打开是否要双击，双击会造成两次单击，必须舍弃一个
    d3_selection_src["e" /* event */].preventDefault();
    d3_selection_src["e" /* event */].stopImmediatePropagation();
  }).call(_generator.call(this, 'drag')); //对节点注册拖拽事件，此事件会阻止后续注册的以及冒泡的父元素相关事件:mousedown,mouseup,mousemove
  //注册周围快速菜单事件


  _fastmenu.call(_this, 'node', node); //注册右键菜单事件


  _contextmenu.call(_this, 'node', node); //创建节点组内部图片image和节点名称text


  node.each(function (n) {
    var cnode = d3_selection_src["k" /* select */](this),
        image = cnode.select('image'),
        text = cnode.select('text');

    if (image.empty()) {
      image = cnode.append('image').classed('node-' + n.id, true).attr('x', -_this._options.radius).attr('y', -_this._options.radius).attr('width', _this._options.radius * 2).attr('height', _this._options.radius * 2);
    }

    image.attr('xlink:href', function (n) {
      return model;
    });

    if (text.empty()) {
      text = cnode.append('text').classed('node-' + n.id, true).attr('y', _this._options.radius).attr('dy', '1em').attr('text-anchor', 'middle').attr('font-size', '12px').attr('fill', '#ddd');
    }

    text.text(function (n) {
      return n.text;
    });
  }); //启动力模型事件，校正线位置（alphaTarget[0-1]数值越大，tick运行次数越多）

  this._simulation.alphaTarget(0.5).restart(); //启动后用此法停止力模型tick


  d3_timer_src["c" /* timeout */](function (_) {
    return _this7._simulation.alphaTarget(0);
  });
} //构建连线


function _lines() {
  var _this8 = this;

  //查找连线组，如果没有则创建
  var glineParent = this._svg.selectAll('g.node-line'),
      gline = glineParent.selectAll('g.line');

  if (gline.empty()) {
    gline = glineParent.append('g').classed('line', true);
  }
  /*//直接使用path作为线，此种情况鼠标点击选中或右键，可点范围较小，不易触发事件
  let line = gline.selectAll('path.line-child')
      .data(this._lines, l => (l.sid + '-' + l.tid))
      .join('path')
      .classed('line-child', true)
      .attr('stroke', '#9dadb5')
      .attr('stroke-width', 2)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .attr('fill', '#9dadb5')*/
  //创建线（会和原有数据合并，根据连线的起止节点id筛选的）


  var _this = this,
      line = gline.selectAll('g.line-child').data(this._lines, function (l) {
    return l.sid + '-' + l.tid;
  }).join('g').attr('cursor', 'default').classed('line-child', true).on('click.select', function (l) {
    //选中事件
    var path = d3_selection_src["k" /* select */](this).select('path.line-' + l.sid + '-' + l.tid);

    _selectLine.call(_this, path, !path.classed('selected')); //防止冒泡到svg的click事件


    d3_selection_src["e" /* event */].stopPropagation();
  }); //注册右键菜单事件


  _contextmenu.call(this, 'line', line); //创建线内部撑大范围的rect和线的path


  line.each(function (l) {
    var cline = d3_selection_src["k" /* select */](this),
        rect = cline.select('path.line-rect-' + l.sid + '-' + l.tid),
        path = cline.select('path.line-' + l.sid + '-' + l.tid);

    if (rect.empty()) {
      //为每条线加一个背景存托，如此，鼠标点击选中或右键，可点范围大，更易触发事件
      rect = cline.append('path').classed('line-rect-' + l.sid + '-' + l.tid, true).attr('stroke', 'white').attr('stroke-width', _this._options.arrow).attr('stroke-opacity', 0);
    }

    if (path.empty()) {
      path = cline.append('path').classed('line-' + l.sid + '-' + l.tid, true).attr('stroke', '#9dadb5').attr('stroke-width', 2).attr('stroke-linecap', 'round').attr('stroke-linejoin', 'round').attr('fill', '#9dadb5');
    }
  }); //启动力模型事件，校正线位置（alphaTarget[0-1]数值越大，tick运行次数越多）

  this._simulation.alphaTarget(0.5).restart(); //启动后用此法停止力模型tick


  d3_timer_src["c" /* timeout */](function (_) {
    return _this8._simulation.alphaTarget(0);
  });
} //初始化


function _init() {
  var _this9 = this;

  this._svg = d3_selection_src["b" /* create */]('svg');

  if (Env.IE && Env.IE < 9) {
    alert('SVG不支持你所使用的浏览器，请更换其他浏览器或升级为更高版本的浏览器后查看！');
    return;
  } //创建svg画布


  this._svg.attr('viewBox', this._options.viewBox.join(' ')) //火狐需要设置具体的宽高不能直接百分比，否则会报错，另外火狐获取不到clientWidth/clientHeight
  .attr('display', 'block').on('mousedown.contextmenu', function (_) {
    //由于后面的'drag'事件会阻止冒泡及后续的注册事件，所以在此注册关掉菜单用
    _contextmenuHide.call(_this9);

    _fastmenuHide.call(_this9);
  }).on('click.select', function (_) {
    //单击时去掉选择状态
    _selectNode.call(_this9, d3_selection_src["l" /* selectAll */]('g.node-child').selectAll('image.selected'), false);

    _selectLine.call(_this9, d3_selection_src["l" /* selectAll */]('g.line-child').selectAll('path.selected'), false);
  }).call(_generator.call(this, 'drag')); //对画布注册右键菜单事件


  _contextmenu.call(this, 'view', this._svg); //创建节点-连线组并注册放大缩小事件，事件内容主要是改变注册元素及相关元素的位移及缩放


  this._svg.append('g').classed('node-line', true).on('mousedown.contextmenu', function (_) {
    //由于下面的'zoom'事件会阻止冒泡及后续的注册事件，所以在此注册关掉菜单用
    _contextmenuHide.call(_this9);

    _fastmenuHide.call(_this9);
  }).call(_generator.call(this, 'zoom')) //缩放事件，此事件会阻止后续注册的以及冒泡的父元素相关事件:mousedown,mouseup,mousemove,wheel,dblclick
  .append('g').classed('rect', true).append('rect').attr('opacity', 0); //构建节点碰撞力模型


  this._simulation = d3_force_src["f" /* forceSimulation */]([]).force('collide', d3_force_src["b" /* forceCollide */](this._options.radius)); //注册用力时执行的事件，事件内主要用于改变因为力的原因需要改变的相关参数，比如节点位移，线的路径以及旋转变形等

  this._simulation.on('tick', function (_) {
    var _this = _this9; //线更新

    _this9._svg.selectAll('g.line-child').each(function (l) {
      var child = d3_selection_src["k" /* select */](this);

      if (_this._options.lineShape === 'straight') {
        //直线
        var x = _this._lines.idMap[l.sid].x,
            y = _this._lines.idMap[l.sid].y,
            r = _this._options.radius,
            distance = getDistance(_this._lines.idMap[l.sid], _this._lines.idMap[l.tid]),
            _rotate = getRotate(_this._lines.idMap[l.sid], _this._lines.idMap[l.tid]);

        child.select('path.line-' + l.sid + '-' + l.tid) //更新线的位置
        .attr('d', getStraightPath(l.twa ? 'A1' : 'A0', r, _this._options.arrow, distance)).attr('transform', 'translate(' + x + ',' + y + ') rotate(' + _rotate + ')');
        child.select('path.line-rect-' + l.sid + '-' + l.tid).attr('d', getStraightPath('A0', r, 0, distance)) //更新线的可点区域位置
        .attr('transform', 'translate(' + x + ',' + y + ') rotate(' + _rotate + ')');
      } else if (_this._options.lineShape === 'curve') {
        //曲线
        child.select('path.line-' + l.sid + '-' + l.tid) //更新线的位置
        .attr('d', getCurvePath(l.twa ? 'A1' : 'A0', _this._options.radius, _this._options.arrow, _this._lines.idMap[l.sid], _this._lines.idMap[l.tid]));
        child.select('path.line-rect-' + l.sid + '-' + l.tid) //更新线的可点区域位置
        .attr('d', getCurvePath('A0', _this._options.radius, 0, _this._lines.idMap[l.sid], _this._lines.idMap[l.tid]));
      } else if (_this._options.lineShape === 'curve2') {
        //曲线
        child.select('path.line-' + l.sid + '-' + l.tid) //更新线的位置
        .attr('d', getCurvePath2(l.twa ? 'A1' : 'A0', _this._options.radius, _this._options.arrow, _this._lines.idMap[l.sid], _this._lines.idMap[l.tid]));
        child.select('path.line-rect-' + l.sid + '-' + l.tid) //更新线的可点区域位置
        .attr('d', getCurvePath2('A0', _this._options.radius, 0, _this._lines.idMap[l.sid], _this._lines.idMap[l.tid]));
      } //线上的快速菜单位置更新（暂时没有这个快速菜单）


      var menus = _this._svg.selectAll('g.fastmenu-line-' + l.sid + '-' + l.tid);

      if (menus && !menus.empty()) {
        menus.selectAll('g').attr('transform', 'rotate(' + rotate + ')');
      }
    }); //节点更新


    _this9._svg.selectAll('g.node-child').each(function (n) {
      var child = d3_selection_src["k" /* select */](this); //更新node的位置

      child.attr('transform', 'translate(' + n.x + ',' + n.y + ')'); //节点上的快速菜单位置更新

      var menus = _this._svg.selectAll('g.fastmenu-node-' + n.id);

      if (menus && !menus.empty()) {
        menus.selectAll('g').attr('transform', 'translate(' + n.x + ',' + n.y + ')');
      }
    }); //更新node-line组内部rect宽高和位置，方便缩放使用


    var max = {
      x: 0,
      y: 0
    },
        min = {
      x: Infinity,
      y: Infinity
    };

    _this9._nodes.forEach(function (n) {
      if (n.x > max.x) max.x = n.x;
      if (n.y > max.y) max.y = n.y;
      if (n.x < min.x) min.x = n.x;
      if (n.y < min.y) min.y = n.y;
    });

    if (_this9._nodes.length) {
      _this9._svg.select('g.rect').select('rect').attr('width', max.x - min.x + 2 * _this9._options.radius > 0 ? max.x - min.x + 2 * _this9._options.radius : 0).attr('height', max.y - min.y + 2 * _this9._options.radius + 15 > 0 ? max.y - min.y + 2 * _this9._options.radius + 15 : 0) //加上15是因为节点下面有名称占15px高度
      .attr('x', min.x - _this9._options.radius).attr('y', min.y - _this9._options.radius);
    }
  }); //构建线和节点


  _lines.call(this);

  _nodes.call(this);
}

function ModelView(options) {
  this._options = options = Object.assign({
    radius: 32,
    //节点半径
    split: 12,
    //节点连线和拖动的分界长度
    arrow: 12,
    //线上面箭头宽度
    viewBox: [0, 0, 100, 100],
    lineShape: 'curve',
    nodes: [],
    lines: [],
    canLink: function canLink(_) {
      return 1;
    },
    lineMenu: [],
    nodeMenu: [],
    nodeFastMenu: [],
    viewMenu: []
  }, options);
  this._nodes = options.nodes;
  this._lines = options.lines;

  _init.call(this);
}

Object.assign(ModelView.prototype, {
  getView: function getView() {
    return this._svg.node();
  },
  getData: function getData() {
    return {
      nodes: this._nodes,
      lines: this._lines
    };
  },
  viewBox: function viewBox(w, h, l, t) {
    if (Number.isNaN(+w) || +w <= 0) w = 100;
    if (Number.isNaN(+h) || +h <= 0) h = 100;
    if (Number.isNaN(+l)) l = 0;
    if (Number.isNaN(+t)) t = 0;

    this._svg.attr('viewBox', [l, t, w, h].join(' '));
  },
  translate: function translate(x, y, way) {
    //根据给定的x,y值进行位移，不传值则位于初始位置
    //zoom.translateTo移动的是视图中心点，所以要进行转换
    var zoom = _generator.call(this, 'zoom'),
        el = this._svg.selectAll('g.node-line').transition(),
        rect = this._svg.select('g.rect').select('rect'),
        svgRect = this._svg.node().getBoundingClientRect();

    if (x === 'center') {
      //移动到画布中央
      x = (svgRect.width - +rect.attr('width')) / 2;
      y = (svgRect.height - +rect.attr('height')) / 2;
      way = 'to';
    } else if (x === 'init') {
      //移动到刚开始的位置
      x = +rect.attr('x');
      y = +rect.attr('y');
      way = 'to';
    }

    if (way === 'to') {
      //直接移动到距离画布左边x，上边y的位置
      var rx = +rect.attr('x'),
          ry = +rect.attr('y');
      if (Number.isNaN(+x)) x = rx;
      if (Number.isNaN(+y)) y = ry;
      x = x - rx;
      y = y - ry;
      zoom.translateTo(el, svgRect.width / 2 - x, svgRect.height / 2 - y);
    } else {
      //在原来的位置基础上再移动一定的距离(x,y)
      if (Number.isNaN(+x)) x = 0;
      if (Number.isNaN(+y)) y = 0;
      zoom.translateBy(el, x, y);
    }
  },
  scale: function scale(k, way) {
    //根据给定的k值进行缩放，不传值则恢复原始比例
    if (Number.isNaN(+k) || +k <= 0) k = 1;

    var zoom = _generator.call(this, 'zoom'),
        el = this._svg.selectAll('g.node-line').transition();

    if (k === 1) {
      //如果是1，则直接认为恢复到原始比例，因为在原来的基础上增加一倍，没有用。
      way = 'to';
    }

    if (way === 'to') {
      //直接变换到给出的比例
      zoom.scaleTo(el, k);
    } else {
      //在原有的基础上变化k倍
      zoom.scaleBy(el, k);
    }
  },
  addNode: function addNode(node) {
    var _this10 = this;

    var point = d3_selection_src["a" /* clientPoint */](this._svg.select('g.node').node(), {
      clientX: node.x,
      clientY: node.y
    });
    node.x = point[0];
    node.y = point[1];

    var replaceIndex = this._nodes.findIndex(function (n) {
      return getDistance(n, node) <= _this10._options.radius;
    }),
        updateIndex = this._nodes.findIndex(function (n) {
      return n.id == node.id;
    });

    if (replaceIndex === -1 && updateIndex === -1) {
      //添加
      this._nodes.push(node);
    } else if (updateIndex !== -1 && (replaceIndex === -1 || replaceIndex === updateIndex)) {
      //更新
      _lineMerge.call(this, {}, this._nodes[updateIndex], node);

      this._nodes[updateIndex] = node;
    } else {
      //替换
      //直接替换
      _lineMerge.call(this, this._nodes[replaceIndex], this._nodes[updateIndex] || {}, node);

      this._nodes[replaceIndex] = node;

      if (updateIndex !== -1) {
        //合并(删除)替换
        this._nodes.splice(updateIndex, 1);
      }
    }

    _nodes.call(this);
  },
  deleteNode: function deleteNode(ns) {
    var _this11 = this;

    if (ns === '*') {
      //节点不在，线将何存？
      this._lines = [];
      this._nodes = [];

      _lines.call(this);

      _nodes.call(this);

      return;
    }

    if (!Array.isArray(ns)) {
      ns = typeof_default()(ns) === 'object' ? [ns] : [];
    }

    var nodeChange = [],
        lineChange = false;
    ns.forEach(function (n) {
      var delIndex = _this11._nodes.findIndex(function (_n) {
        return n.id == _n.id;
      });

      if (delIndex !== -1) {
        nodeChange.push(_this11._nodes.splice(delIndex, 1)[0]);
      }
    });

    if (nodeChange.length) {
      //将与删掉的节点相关的线删除
      var len = this._lines.length;

      while (len--) {
        var l = this._lines[len];

        for (var j = 0; j < nodeChange.length; j++) {
          if (l.sid == nodeChange[j].id || l.tid == nodeChange[j].id) {
            lineChange = true;

            this._lines.splice(len, 1);

            break;
          }
        }
      }
    }

    if (lineChange) {
      _lines.call(this);
    }

    if (nodeChange.length) {
      _nodes.call(this);
    }
  },
  deleteLine: function deleteLine(ls) {
    var _this12 = this;

    if (ls === '*') {
      this._lines = [];

      _lines.call(this);

      return;
    }

    if (!Array.isArray(ls)) {
      ls = typeof_default()(ls) === 'object' ? [ls] : [];
    }

    var change = false;
    ls.forEach(function (l) {
      var delIndex = _this12._lines.findIndex(function (_l) {
        return l.sid == _l.sid && l.tid == _l.tid;
      });

      if (delIndex !== -1) {
        change = true;

        _this12._lines.splice(delIndex, 1);
      }
    });

    if (change) {
      _lines.call(this);
    }
  },
  selectNode: function selectNode(ns, selected) {
    if (ns === '*') {
      return _selectNode.call(this, d3_selection_src["l" /* selectAll */]('g.node-child').selectAll('image'), selected);
    }

    if (!Array.isArray(ns)) {
      ns = typeof_default()(ns) === 'object' ? [ns] : [];
    }

    var nodes = ns.map(function (n) {
      return d3_selection_src["k" /* select */]('image.node-' + n.id).node();
    });
    return _selectNode.call(this, d3_selection_src["l" /* selectAll */](nodes), selected);
  },
  selectLine: function selectLine(ls, selected) {
    if (ls === '*') {
      return _selectLine.call(this, d3_selection_src["l" /* selectAll */]('g.line-child').selectAll(function (l) {
        return [d3_selection_src["k" /* select */]('path.line-' + l.sid + '-' + l.tid).node()];
      }), selected);
    }

    if (!Array.isArray(ls)) {
      ls = typeof_default()(ls) === 'object' ? [ls] : [];
    }

    var lines = ls.map(function (l) {
      return d3_selection_src["k" /* select */]('path.line-' + l.sid + '-' + l.tid).node();
    });
    return _selectLine.call(this, d3_selection_src["l" /* selectAll */](lines), selected);
  },
  isSelected: function isSelected(data) {
    return !d3_selection_src["k" /* select */]((data.type === 'node' ? 'image' : 'path') + '.selected.' + data.type + '-' + (data.type === 'node' ? data[data.type].id : data[data.type].sid + '-' + data[data.type].tid)).empty();
  },
  getSelecteds: function getSelecteds() {
    var _this13 = this;

    var rtn = {
      nodes: [],
      lines: []
    };
    rtn.lines.idMap = {};
    d3_selection_src["l" /* selectAll */]('path.selected').each(function (l) {
      rtn.lines.push(l);
      rtn.lines.idMap[l.sid] = rtn.lines.idMap[l.sid] || _this13._lines.idMap[l.sid];
      rtn.lines.idMap[l.tid] = rtn.lines.idMap[l.tid] || _this13._lines.idMap[l.tid];
    });
    d3_selection_src["l" /* selectAll */]('image.selected').each(function (n) {
      rtn.nodes.push(n);
    });
    return rtn;
  }
});
/* harmony default export */ var chart = (ModelView);
// CONCATENATED MODULE: ../data/data.js
var data_nodes = [{
  'id': 11,
  'shape': './a.png',
  'text': '数据1',
  x: 568,
  y: 76
}, {
  'id': 22,
  'shape': './a.png',
  'text': '数据2',
  x: 588,
  y: 276
}, {
  'id': 33,
  'shape': './a.png',
  'text': '数据3',
  x: 578,
  y: 176
}, {
  'id': 44,
  'shape': './a.png',
  'text': '数据4',
  x: 768,
  y: 226
}];
var data_lines = [{
  'sid': data_nodes[0].id,
  'tid': data_nodes[1].id
}, {
  'twa': true,
  'sid': data_nodes[1].id,
  'tid': data_nodes[2].id
}, {
  'sid': data_nodes[1].id,
  'tid': data_nodes[3].id
}];

// EXTERNAL MODULE: ./index.css
var index_0 = __webpack_require__(364);

// CONCATENATED MODULE: ./index.js



var count = 4;
var areaDom = document.getElementsByClassName('graph-area')[0];
var dragImg = Array.prototype.slice.call(document.getElementsByClassName('dragImg'));
var chartDom = new chart({
  radius: 32,
  viewBox: [0, 0, 800, 450],
  nodes: data_nodes,
  lines: data_lines,
  canLink: function canLink(s, t) {
    if (s && s.id == 66) {
      alert('此节点无法作为连线的起点');
      return false;
    }

    if (s.id == 33 && t && t.id == 66) {
      alert('无法连接到该节点');
      return false;
    }

    return true;
  },
  lineMenu: [{
    name: '选择',
    click: function click(e, s, t, a) {
      chartDom.selectLine({
        sid: s.id,
        tid: t.id,
        twa: a
      }, true);
    },
    test: function test(s, t, a) {
      console.log(s.id, t.id);
      return !chartDom.isSelected({
        type: 'line',
        line: {
          sid: s.id,
          tid: t.id,
          twa: a
        }
      });
    }
  }, {
    name: '取消',
    click: function click(e, s, t, a) {
      console.log(this);
      chartDom.selectLine({
        sid: s.id,
        tid: t.id,
        twa: a
      }, false);
    },
    test: function test(s, t, a) {
      console.log(this);
      return chartDom.isSelected({
        type: 'line',
        line: {
          sid: s.id,
          tid: t.id,
          twa: a
        }
      });
    }
  }, {
    name: '删除',
    click: function click(e, s, t, a) {
      chartDom.deleteLine({
        sid: s.id,
        tid: t.id,
        twa: a
      });
    }
  }],
  nodeMenu: [{
    name: '选择',
    click: function click(e, n) {
      chartDom.selectNode(n, true);
    },
    test: function test(n) {
      console.log(n.id);
      return !chartDom.isSelected({
        type: 'node',
        node: n
      });
    }
  }, {
    name: '取消',
    click: function click(e, n) {
      chartDom.selectNode(n, false);
    },
    test: function test(n) {
      return chartDom.isSelected({
        type: 'node',
        node: n
      });
    }
  }, {
    name: '删除',
    click: function click(e, n) {
      chartDom.deleteNode(n);
    }
  }],
  nodeFastMenu: [{
    name: 'a',
    click: function click() {
      console.log(this);
    },
    test: function test(n) {
      console.log(n.id);
      console.log(this);
    }
  }, {
    name: 'b',
    click: function click(k) {
      alert(k.text);
    }
  }, {
    name: 'c',
    click: function click() {},
    test: function test(n) {
      return n.id != 11;
    }
  }, {
    name: 'd',
    click: function click() {}
  }, {
    name: 'e',
    click: function click() {}
  }, {
    name: 'f',
    click: function click() {}
  }, {
    name: 'g',
    click: function click() {}
  }],
  viewMenu: [{
    name: '添加节点',
    click: function click(e) {
      chartDom.addNode({
        'id': count + '' + count,
        'shape': './images/model.png',
        'text': prompt('请输入节点名称', '数据' + count),
        'x': e.menuX,
        'y': e.menuY
      });
      count++;
    }
  }, {
    name: '右移',
    click: function click(e) {
      chartDom.translate(30, 0);
    }
  }, {
    name: '左移',
    click: function click(e) {
      chartDom.translate(-30, 0);
    }
  }, {
    name: '上移',
    click: function click(e) {
      chartDom.translate(0, -30);
    }
  }, {
    name: '下移',
    click: function click(e) {
      chartDom.translate(0, 30);
    }
  }, {
    name: '居中',
    click: function click(e) {
      chartDom.translate('center');
    }
  }, {
    name: '初始位置',
    click: function click(e) {
      chartDom.translate('init');
    }
  }, {
    name: '放大',
    click: function click(e) {
      chartDom.scale(1.2);
    }
  }, {
    name: '缩小',
    click: function click(e) {
      chartDom.scale(0.8);
    }
  }, {
    name: '初始大小',
    click: function click(e) {
      chartDom.scale();
    }
  }, {
    name: '全屏查看',
    click: function click(e) {
      areaDom.style.cssText = "width:auto;height:auto;left:0;top:0;bottom:0;right:0;margin:0;z-index:10000;position:absolute;";
      var bound = areaDom.getBoundingClientRect();
      chartDom.viewBox(bound.width, bound.height);
      chartDom.translate('center');
    },
    test: function test() {
      console.log(arguments);
      return areaDom.style.position != 'absolute';
    }
  }, {
    name: '退出全屏',
    click: function click(e) {
      areaDom.style.cssText = "width:800px;height:450px;margin:100px;position:static;";
      var bound = areaDom.getBoundingClientRect();
      chartDom.viewBox(bound.width, bound.height);
      chartDom.translate('center');
    },
    test: function test() {
      return areaDom.style.position != 'static';
    }
  }, {
    name: '全部选择',
    click: function click(e) {
      chartDom.selectNode('*', true);
      chartDom.selectLine('*', true);
    },
    test: function test() {
      var data = chartDom.getSelecteds(),
          allData = chartDom.getData();
      return !(data.nodes.length === allData.nodes.length && data.lines.length === allData.lines.length);
    }
  }, {
    name: '取消选择',
    click: function click(e) {
      chartDom.selectNode('*', false);
      chartDom.selectLine('*', false);
    },
    test: function test() {
      var data = chartDom.getSelecteds();
      return !(data.nodes.length === 0 && data.lines.length === 0);
    }
  }, {
    name: '清空选择',
    click: function click(e) {
      var data = chartDom.getSelecteds();
      chartDom.deleteNode(data.nodes);
      chartDom.deleteLine(data.lines);
    },
    test: function test() {
      var data = chartDom.getSelecteds();
      return data.nodes.length !== 0 || data.lines.length !== 0;
    }
  }, {
    name: '清空所有',
    click: function click(e) {
      chartDom.deleteNode('*');
    }
  }]
});
areaDom.appendChild(chartDom.getView());
dragImg.forEach(function (t, i) {
  t.onmousedown = function (e) {
    var startPos = {
      x: e.pageX,
      y: e.pageY
    };
    var startOffset = this.getBoundingClientRect();
    startOffset = {
      x: startOffset.x,
      y: startOffset.y
    };
    var imgHelper = document.createElement('a');
    imgHelper.innerHTML = this.innerHTML;
    imgHelper.style.position = 'absolute';
    imgHelper.style.display = 'inline-block';
    imgHelper.style.width = this.clientWidth + 'px';
    imgHelper.style.height = this.clientHeight + 'px';
    imgHelper.style.top = startOffset.y + 'px';
    imgHelper.style.left = startOffset.x + 'px';
    document.body.appendChild(imgHelper);

    document.onmousemove = function (ee) {
      imgHelper.style.top = startOffset.y + (ee.pageY - startPos.y) + 'px';
      imgHelper.style.left = startOffset.x + (ee.pageX - startPos.x) + 'px';
      ee.preventDefault();
    };

    document.onmouseup = function (ee) {
      document.onmousemove = null;
      document.onmouseup = null;
      var viewRect = areaDom.getBoundingClientRect();

      if (imgHelper.offsetLeft > viewRect.left && imgHelper.offsetLeft + imgHelper.clientWidth / 2 < viewRect.right && imgHelper.offsetTop > viewRect.top && imgHelper.offsetTop + imgHelper.clientHeight / 2 < viewRect.bottom) {
        console.log('a:', ee.clientX);
        chartDom.addNode({
          'id': i == 0 ? count + '' + count : '000000000000',
          'shape': './images/model.png',
          'text': '数据' + (i == 0 ? count : ''),
          'x': ee.clientX,
          'y': ee.clientY
        });
        if (i == 0) count++;
        imgHelper.parentNode.removeChild(imgHelper);
      } else {
        imgHelper.style.top = startOffset.y + 'px';
        imgHelper.style.left = startOffset.x + 'px';
        imgHelper.style.transition = 'top .3s, left .3s';
        setTimeout(function () {
          imgHelper.remove();
        }, 300);
      }

      ee.preventDefault();
    };

    e.stopPropagation();
  };
});
console.dir(chartDom);
console.log(chartDom.getData());

/***/ })

/******/ });