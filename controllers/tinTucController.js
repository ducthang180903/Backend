const Joi = require('joi');
const tinTucService = require('../services/tinTucService');

const validateTinTuc = (data) => {
    const schema = Joi.object({
        TieuDe: Joi.string().required(),
        MoTa: Joi.string().required(),
        Author: Joi.string().allow(null, ''),
        HinhAnh: Joi.string().allow(null, ''),
    });
    return schema.validate(data);
};

const getAllTinTuc = async (req, res) => {
    try {
        const tinTucList = await tinTucService.getAllTinTuc();
        res.status(200).json(tinTucList);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server, không thể tải danh sách tin tức.', error: error.message });
    }
};

const getTinTucById = async (req, res) => {
    try {
        const { id } = req.params;
        const tinTuc = await tinTucService.getTinTucById(id);
        if (!tinTuc) return res.status(404).json({ message: 'Tin tức không tồn tại' });
        res.status(200).json(tinTuc);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server, không thể tải tin tức.', error: error.message });
    }
};

const createTinTuc = async (req, res) => {
    try {
        const { error } = validateTinTuc(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { TieuDe, MoTa, Author, HinhAnh } = req.body;
        const newTinTuc = await tinTucService.createTinTuc({ TieuDe, MoTa, Author, HinhAnh });
        res.status(201).json(newTinTuc);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server, không thể tạo tin tức.', error: error.message });
    }
};

const updateTinTuc = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = validateTinTuc(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { TieuDe, MoTa, HinhAnh } = req.body;
        const updatedTinTuc = await tinTucService.updateTinTuc(id, { TieuDe, MoTa, HinhAnh });
        if (!updatedTinTuc) return res.status(404).json({ message: 'Tin tức không tồn tại' });
        res.status(200).json(updatedTinTuc);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server, không thể cập nhật tin tức.', error: error.message });
    }
};

const deleteTinTuc = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await tinTucService.deleteTinTuc(id);
        if (!deleted) return res.status(404).json({ message: 'Tin tức không tồn tại' });
        res.status(200).json({ message: 'Xóa tin tức thành công' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server, không thể xóa tin tức.', error: error.message });
    }
};

module.exports = {
    getAllTinTuc,
    getTinTucById,
    createTinTuc,
    updateTinTuc,
    deleteTinTuc,
};
