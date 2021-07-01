const searchAble = async (req) => {
  let lookUpProduct = {
    from: 'products',
    localField: 'product',
    foreignField: '_id',
    as: 'product',
  };
  let matchObj = {
    type: 'inventory',
    'product.code': { $regex: req.query.searchQuery, $options: 'i' },
  };
  let queryString = {},
    countDocs;
  if (req.query.searchQuery) {
    entries = Entry.aggregate().lookup(lookUpProduct).match(matchObj).unwind({
      preserveNullAndEmptyArrays: true,
      path: '$product',
    });
    countDocs = Entry.aggregate().lookup(lookUpProduct).match(matchObj);
    queryString.query = req.query.searchQuery;
  }
  if (req.query.startDate) {
    entries = entries.match({
      createdAt: { $gte: new Date(req.query.startDate) },
    });
    countDocs = countDocs.match({
      createdAt: { $gte: new Date(req.query.startDate) },
    });
    queryString.startDate = req.query.startDate;
  }
  if (req.query.endDate) {
    entries = entries.match({
      createdAt: { $lt: new Date(req.query.endDate) },
    });
    countDocs = countDocs.match({
      createdAt: { $lt: new Date(req.query.endDate) },
    });
    queryString.endDate = req.query.endDate;
  }
  if (countDocs) {
    countDocs = await countDocs.exec();
    count = countDocs.length;
  }
};
