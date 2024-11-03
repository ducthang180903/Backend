const newsModel = require('../models/newsModel');
const imgTinTucModel = require('../models/imgTinTucModel');
const { Op } = require('sequelize');

const createNews = async (newsData) => {
    const { TieuDe, NoiDung, TacGia, HinhAnh } = newsData;

    // Kiểm tra tồn tại
    const existingNews = await newsModel.findOne({ where: { TieuDe } });
    if (existingNews) {
        return { message: 'Tin tức này đã tồn tại.', status: 'warning', TinTucId: null };
    }

    // thêm tin tức
    const newNews = await newsModel.create({
        TieuDe,
        NoiDung,
        TacGia,
    });
    if (HinhAnh && HinhAnh.length > 0) {
        const imgPromises = HinhAnh.map((image) =>
            imgTinTucModel.create({
                TinTucId: newNews.TinTucId,
                DuongDanHinh: image,
            })
        );
        await Promise.all(imgPromises);
    }

    return { message: 'Tin tức đã được tạo thành công!', TinTucId: newNews.TinTucId, status: 'success' };
};

// cập nhập tin tức
const updateNews = async (id, newsData) => {
    const { TieuDe, NoiDung, TacGia, HinhAnh } = newsData;

    const existingNews = await newsModel.findOne({
        where: {
            TieuDe,
            TinTucId: { [Op.ne]: id },
        },
    });

    if (existingNews) {
        return { message: 'Tin tức với tiêu đề này đã tồn tại.', status: 'warning' };
    }

    const [updatedRows] = await newsModel.update(
        { TieuDe, NoiDung, TacGia },
        { where: { TinTucId: id } }
    );

    if (updatedRows === 0) {
        return { message: 'Tin tức không tồn tại.', status: 'error' };
    }

    return { message: 'Tin tức đã được cập nhật thành công!', status: 'success' };
};

// xóa tin tức
const deleteNews = async (newsId) => {
    const news = await newsModel.findByPk(newsId);
    if (!news) {
        return { message: 'Tin tức không tồn tại.', status: 'warning' };
    }

    await imgTinTucModel.destroy({ where: { TinTucId: newsId } });

    await newsModel.destroy({ where: { TinTucId: newsId } });

    return { message: 'Tin tức đã được xóa thành công!', status: 'success' };
};


const getAllNews = async () => {
    const newsList = await newsModel.findAll({
        include: [
            {
                model: imgTinTucModel,
                attributes: ['DuongDanHinh'],
            },
        ],
    });

    return newsList.map((news) => {
        const newsData = news.toJSON();
        return {
            TinTucId: newsData.TinTucId,
            TieuDe: newsData.TieuDe,
            NoiDung: newsData.NoiDung,
            TacGia: newsData.TacGia,
            NgayTao: newsData.NgayTao,
            NgayCapNhat: newsData.NgayCapNhat,
            HinhAnh: newsData.HinhAnhNews.map((image) => image.DuongDanHinh),
        };
    });
};

module.exports = { createNews, updateNews, deleteNews, getAllNews };
