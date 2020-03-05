"use strict";

var Logins = require("../models").Logins;
var Trash = require("../models").Trash;
var q = require("q");
var queue = require("../services/queue");
var debug = require("debug")("loginsController");
const Request = require("request-promise");

var service = "Logins";

var LoginsController = {};

LoginsController.buildProjection = function(projections) {
    debug("starting build...");
    var projection = projections.split(","); // Projection should be comma separated. eg. name,location
    return q.Promise(function(resolve, reject, notify) {
        debug("This is a promise...");
        var num = projection.length;
        var last = num - 1;
        var select = {};
        for (var n in projection) {
            if (typeof projection[n] === "string") {
                debug("Processing...", projection[n]);
                notify("Adding " + projection[n] + " to projection");
                select[projection[n]] = 1;
                if (n * 1 === last) {
                    debug("Coming out of the loop...", select);
                    notify("Ending Build.");
                    return resolve(select);
                }
            } else {
                debug("Skiping...", projection[n]);
                if (n * 1 === last) {
                    debug("Coming out of the loop......", select);
                    notify("Ending Build..");
                    return resolve(select);
                }
            }
        }
    });
};

LoginsController.find = function(req, res, next) {
    const options = {
        method: 'GET',
        uri: "https://api.chucknorris.io/jokes/random",
        headers: {
            "content-type": "application/json"
        },
        json: true
    };

    Request(options).then((response) => {
        console.log(response)
        res.send(response.value)
    }).catch((error) => {
        console.log(error)
    })

    // var query;
    // if (req.query.search) {
    //     query = req.query.search;
    //     // Clean appId and userId
    //     if (query && query.appId) {
    //         delete query.appId;
    //     }
    //     if (query && query.accountId) {
    //         delete query.accountId;
    //     }

    //     Logins.search(query)
    //         .then(function(resp) {
    //             res.ok(resp);
    //         })
    //         .catch(function(err) {
    //             next(err);
    //         });
    // } else {
    //     query = req.query;
    //     // Clean appId and userId
    //     if (query && query.appId) {
    //         delete query.appId;
    //     }
    //     if (query && query.accountId) {
    //         delete query.accountId;
    //     }
    //     var projection = query.select; // Projection should be comma separated. eg. name,location
    //     var ourProjection;

    //     if (projection) {
    //         ourProjection = LoginsController.buildProjection(projection);
    //         delete query.select;
    //     }
    //     var limit = query.limit * 1 || 50;
    //     if (limit) {
    //         delete query.limit;
    //     }
    //     var skip = query.skip * 1 || 0;
    //     if (skip) {
    //         delete query.skip;
    //     }

    //     var from = query.from;
    //     var to = query.to;
    //     if (from) {
    //         query.createdAt = {};
    //         query.createdAt.$gt = from;
    //         delete query.from;
    //         if (to) {
    //             delete query.to;
    //         } else {
    //             to = new Date().toISOString();
    //         }
    //         query.createdAt.$lt = to;
    //     }
    //     var sort = query.sort; // -fieldName: means descending while fieldName without the minus mean ascending bith by fieldName. eg, '-fieldName1 fieldName2'
    //     if (sort) {
    //         delete query.sort;
    //     }
    //     var populate = query.populate; // Samples: 'name location' will populate name and location references. only supports this for now | 'name', 'firstname' will populate name reference and only pick the firstname attribute
    //     if (populate) {
    //         delete query.populate;
    //     }
    //     var totalResult = Logins.countDocuments(query);
    //     var total = Logins.estimatedDocumentCount({});
    //     var question = Logins.find(query);
    //     if (skip !== 0) {
    //         question = question.skip(skip);
    //     }

    //     if (limit !== -1 || from != null) {
    //         totalResult = totalResult.limit(limit);
    //         question = question.limit(limit);
    //     }

    //     if (sort) {
    //         question = question.sort(sort);
    //     }
    //     if (populate) {
    //         question = question.populate(populate);
    //     }

    //     if (projection) {
    //         q.all([ourProjection, total, totalResult])
    //             .spread(function(resp, total, totalResult) {
    //                 return [question.select(resp), total, totalResult];
    //             })
    //             .spread(function(resp, total, totalResult) {
    //                 var pages = Math.ceil(total / limit);
    //                 var remainingPages = Math.ceil(
    //                     (total - (totalResult + skip)) / limit
    //                 );
    //                 totalResult = totalResult + skip;
    //                 var extraData = {};
    //                 extraData.limit = limit * 1;
    //                 extraData.total = total;
    //                 extraData.totalResult =
    //                     totalResult > total ? total : totalResult;
    //                 extraData.skip = skip;
    //                 extraData.currentPage = pages - remainingPages;
    //                 extraData.pages = pages;
    //                 extraData.isLastPage = totalResult >= total ? true : false;
    //                 res.ok(resp, false, extraData);
    //             })
    //             .catch(function(err) {
    //                 next(err);
    //             });
    //     } else {
    //         q.all([question, total, totalResult])
    //             .spread(function(resp, total, totalResult) {
    //                 var pages = Math.ceil(total / limit);
    //                 var remainingPages = Math.ceil(
    //                     (total - (totalResult + skip)) / limit
    //                 );
    //                 totalResult = totalResult + skip;

    //                 var extraData = {};
    //                 extraData.limit = limit * 1;
    //                 extraData.total = total;
    //                 extraData.totalResult =
    //                     totalResult > total ? total : totalResult;
    //                 extraData.skip = skip;
    //                 extraData.pages = pages;
    //                 extraData.currentPage = pages - remainingPages;

    //                 extraData.isLastPage = totalResult >= total ? true : false;
    //                 res.ok(resp, false, extraData);
    //             })
    //             .catch(function(err) {
    //                 next(err);
    //             });
    //     }
    // }
};

LoginsController.findOne = function(req, res, next) {
    var id = req.params.id;
    var query = req.query;
    var populate;
    if (query) {
        populate = query.populate; // Samples: 'name location' will populate name and location references. only supports this for now | 'name', 'firstname' will populate name reference and only pick the firstname attribute
    }
    var question = Logins.findById(id);
    if (populate) {
        delete query.populate;
        question = question.populate(populate);
    }

    question
        .then(function(resp) {
            res.ok(resp);
        })
        .catch(function(err) {
            next(err);
        });
};

LoginsController.create = function(req, res, next) {
    const { email, password } = req.body;
    console.log(req.body);

    const _externalURL = "https://sandbox.mygiro.co/v1/login";
    const options = {
        method: "POST",
        uri: _externalURL,
        body: {
            email,
            password
        },
        json: true,
        headers: {
            "Content-Type": "application/json",
            "x-tag":
                "ZDlkNmZlMzg3ZTQwNjk4OTQwODNiMGQxYjg1ZWJjMDI5NjhkNjEwYTIxODBjYTk5Mzc0Y2NlYTQxM2Q4ODEwMS8vLy8vLzI4MTQ="
        }
    };

    Request(options)
        .then(function(response) {
            //response.status(200).json(response);
            console.log(response);
            res.send(response);
        })
        .catch(function(err) {
            console.log(err);
            res.send(err.response);
        });

    // var data  = req.body;
    // if(data && data.secure){
    //     delete data.secure;
    // }
    // Registers.create(data)
    // .then(function(resp){
    //     res.ok(resp);
    // })
    // .catch(function(err){
    //     next(err);
    // });
};

LoginsController.update = function(req, res, next) {
    var query = req.query;
    // Clean appId and userId
    if (query && query.appId) {
        delete query.appId;
    }
    if (query && query.accountId) {
        delete query.accountId;
    }
    var data = req.body;
    if (data && data.secure) {
        delete data.secure;
    }
    Logins.updateMany(query, data)
        .then(function(resp) {
            res.ok(resp);
        })
        .catch(function(err) {
            next(err);
        });
};

LoginsController.updateOne = function(req, res, next) {
    var id = req.params.id;
    var data = req.body;
    if (data && data.secure) {
        delete data.secure;
    }

    Logins.findByIdAndUpdate(id, data)
        .then(function(resp) {
            if (!resp) {
                next();
            } else {
                res.ok(resp);
            }
        })
        .catch(function(err) {
            next(err);
        });
};

LoginsController.delete = function(req, res, next) {
    var query = req.query;
    // Clean appId and userId
    if (query && query.appId) {
        delete query.appId;
    }
    if (query && query.accountId) {
        delete query.accountId;
    }
    // Find match
    Logins.find(query)
        .then(function(resp) {
            var num = resp.length;
            var last = num - 1;
            for (var n in resp) {
                if (typeof resp === "object") {
                    // Backup data in Trash
                    var backupData = {};
                    backupData.service = service;
                    backupData.data = resp[n];
                    backupData.owner = req.accountId;
                    backupData.deletedBy = req.accountId;
                    backupData.client = req.appId;
                    backupData.developer = req.developer;

                    queue.add("saveToTrash", backupData);
                    if (n * 1 === last) {
                        return resp;
                    }
                } else {
                    if (n * 1 === last) {
                        return resp;
                    }
                }
            }
        })
        .then(function(resp) {
            // Delete matches
            return [Logins.deleteMany(query), resp];
        })
        .spread(function(deleted, resp) {
            res.ok(resp);
        })
        .catch(function(err) {
            next(err);
        });
};

LoginsController.deleteOne = function(req, res, next) {
    var id = req.params.id;
    // Find match
    Logins.findById(id)
        .then(function(resp) {
            // Backup data in Trash
            var backupData = {};
            backupData.service = service;
            backupData.data = resp;
            backupData.owner = req.accountId;
            backupData.deletedBy = req.accountId;
            backupData.client = req.appId;
            backupData.developer = req.developer;

            queue.add("saveToTrash", backupData);
            return [resp];
        })
        .then(function(resp) {
            // Delete match
            return [Logins.findByIdAndRemove(id), resp];
        })
        .spread(function(deleted, resp) {
            if (!resp) {
                next();
            } else {
                res.ok(resp[0]);
            }
        })
        .catch(function(err) {
            next(err);
        });
};

LoginsController.restore = function(req, res, next) {
    var id = req.params.id;
    // Find data by ID from trash
    Trash.findById(id)
        .then(function(resp) {
            // Restore to DB
            return Logins.create(resp.data);
        })
        .then(function(resp) {
            // Delete from trash
            return [Trash.findByIdAndRemove(id), resp];
        })
        .spread(function(trash, resp) {
            res.ok(resp);
        })
        .catch(function(err) {
            next(err);
        });
};

module.exports = LoginsController;
