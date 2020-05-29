const Entry = require('../models/Entry');
//const { EntryValidator } = require('../middlewares/Validator');

const EntryController = {};

EntryController.read = async (req, res) => {
    const entries = await Entry.find({});
    res.render('entries/index', { entries });
};

/*
EntryController.getEntry = async (req, res) => {
    try {
        const Entry = await Entry.findById(req.params.id);
        if (Entry) return res.send(Entry);
        return res.send("Entry Doesn't Exist");
    } catch (e) {
        // console.error(e);
        return '';
    }
};

EntryController.create = async (req, res) => {
    const { name, code, rate } = req.body;
    const validator = EntryValidator({ name, code, rate });
    if (validator.error) {
        req.flash('error', validator.error);
        return res.redirect('/Entrys');
    }
    const existEntry = await Entry.findOne({ code: validator.value.code });
    if (existEntry) {
        req.flash('error', `A Entry with "${existEntry.code}" has already existed!`);
        return res.redirect('/Entrys');
    }
    const Entry = new Entry({
        name: validator.value.name,
        code: validator.value.code,
        rate: validator.value.rate,
    });
    try {
        const savedEntry = await Entry.save();
        req.flash('success', `Entry (${savedEntry.name}) has been successfully added!`);
        return res.redirect('/Entrys');
    } catch (e) {
        req.flash('error', `Error While Saving Data - ${e}`);
        return res.redirect('/Entrys');
    }
};


EntryController.updateEntry = async (req, res) => {
    const Entry = await Entry.findByIdAndUpdate(req.params.id,
        { $set: req.body },
        { new: true });
    req.flash('success', `Entry (${Entry.name}) has been updated successfully!`);
    res.redirect('/Entrys');
};


EntryController.deleteEntry = async (req, res) => {
    const Entry = await Entry.findByIdAndDelete(req.params.id);
    req.flash('success', `Entry (${Entry.name}) has been deleted successfully!`);
    res.redirect('/Entrys');
};

*/
module.exports = EntryController;
