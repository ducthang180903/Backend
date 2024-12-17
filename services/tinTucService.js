const TinTuc = require('../models/tinTucModel');

const getAllTinTuc = async () => {
    return await TinTuc.findAll();
};

const getTinTucById = async (id) => {
    return await TinTuc.findByPk(id);
};

const createTinTuc = async (data) => {
    return await TinTuc.create(data);
};

const updateTinTuc = async (id, data) => {
    const tinTuc = await TinTuc.findByPk(id);
    if (!tinTuc) return null;
    return await tinTuc.update(data);
};

const deleteTinTuc = async (id) => {
    const tinTuc = await TinTuc.findByPk(id);
    if (!tinTuc) return null;
    await tinTuc.destroy();
    return true;
};

module.exports = {
    getAllTinTuc,
    getTinTucById,
    createTinTuc,
    updateTinTuc,
    deleteTinTuc,
};