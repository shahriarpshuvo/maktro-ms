const Paginate = (models) => {
    return async (req, res, next) => {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const results = {};
        const modelsCounter = await models.countDocuments().exec();
        if (endIndex < modelsCounter) {
            results.after = {
                page: page + 1,
                limit: modelsCounter - endIndex < limit ? modelsCounter - endIndex : limit
            }
        }

        if (startIndex > 0) {
            results.prev = {
                page: page - 1,
                limit: limit
            }
        }

        try {
            results.result = await models.find().limit(limit).skip(startIndex).exec();
            res.results = results;
            next();
        } catch (e) {
            res.status(500).send('Something went wrong.');
        }
    }
}

module.exports = Paginate;