const ResponseMessage = require('../helper/ResponseMessage');
const express = require('express');
const router = express.Router();
const Record = require('../models/Record');

router.post('/', (req, res, next) => {
        let query = [];
        CreateDateQuery(req.body)
            .then((dateQuery) => {
                CreateCountQuery(req.body)
                    .then((countQuery) => {
                        query.push(dateQuery);
                        query = query.concat(countQuery);
                        Record.aggregate(query, (err, resultData) => {
                            if (err)
                                res.json(new ResponseMessage());
                            else
                                res.json(new ResponseMessage(0, "Success", resultData));
                        });
                    })
                    .catch((errResult) => {
                        res.status(errResult.code);
                        res.json(new ResponseMessage(errResult.code, errResult.message));
                    });
            })
            .catch((errResult) => {
                res.status(errResult.code);
                res.json(new ResponseMessage(errResult.code, errResult.message));
            });
    }
);

function CreateDateQuery(data) {
    return new Promise((resolve, reject) => {
        const {startDate, endDate} = data;
        if (startDate == undefined || endDate == undefined)
            reject({code: 400, message: "start date and/or end date cannot be undefined."});

        if (startDate != undefined && endDate != undefined) {
            const startDateValue = new Date(startDate);
            const endDateValue = new Date(endDate);
            if (!isNaN(startDateValue) && !isNaN(endDateValue)) {
                resolve({$match: {createdAt: {$gt: startDateValue, $lt: endDateValue}}});
            } else {
                reject({code: 422, message: "Invalid format for start date and/or end date."});
            }
        }
    });
}

function CreateCountQuery(data) {
    return new Promise((resolve, reject) => {
        let countQuery = [];
        const {minCount, maxCount} = data;
        const minCountValue = parseInt(minCount);
        const maxCountValue = parseInt(maxCount);
        if (!isNaN(minCountValue) && !isNaN(maxCountValue)) {
            countQuery.push({$addFields: {totalCount: {$sum: "$counts"}}});
            countQuery.push({$project: {_id: false, key: true, createdAt: true, totalCount: true}});
            countQuery.push({$match: {totalCount: {$gt: minCountValue, $lt: maxCountValue}}});
            countQuery.push({$sort: {"totalCount": 1}});
            resolve(countQuery);
        } else {
            reject({code: 422, message: "Invalid format for counts."});
        }
    });
}

module.exports = router;
