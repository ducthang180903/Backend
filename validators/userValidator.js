const { check } = require('express-validator');

const registerValidator = [
  check('TenDangNhap').notEmpty().withMessage('Tên đăng nhập là bắt buộc'),
  check('MatKhau').isLength({ min: 6 }).withMessage('Mật khẩu phải dài ít nhất 6 ký tự'),
  check('Email').isEmail().withMessage('Email không hợp lệ'),
];

module.exports = { registerValidator };



import React, { useRef, useState } from 'react';
import InputGroup from '../InputGroup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './InputForm.scss';
import '../InputGroup.scss';
import { Form } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Image from 'next/image';

const InputFormSanPham = ({ formData, errors, handleChange }) => {
    const quillRef = useRef(null);
    const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

    const insertImage = (url) => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        const newImageUrls = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onloadend = () => {
                newImageUrls.push(reader.result);
                setImagePreviewUrls(prevUrls => [...prevUrls, reader.result]); // Cập nhật danh sách URL tạm thời
            };

            if (file) {
                reader.readAsDataURL(file);
            }
        }

        // Cập nhật formData với tất cả file ảnh
        handleChange({ target: { name: 'HinhAnh', files } });
    };

    const insertVideo = (url) => {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        const videoEmbed = `<iframe width="560" height="315" src="${url}" frameborder="0" allowfullscreen></iframe>`;
        quill.clipboard.dangerouslyPasteHTML(range.index, videoEmbed);
    };

    const handleVideoInsert = () => {
        const videoUrl = prompt("Nhập URL video:");
        if (videoUrl) {
            insertVideo(videoUrl);
        }
    };

    return (
        <InputGroup>
            <div className="inputGroup">
                <input type="text" name='TenSanPham' required
                    value={formData.TenSanPham}
                    onChange={handleChange}
                />
                <label>Tên Sản Phẩm</label>
                {errors.TenSanPham &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.TenSanPham}
                    </span>
                }
            </div>
            <div className="inputGroup">
                <input type="text" name='DonViTinhID' required
                    value={formData.DonViTinhID}
                    onChange={handleChange}
                />
                <label>Đơn Vị Tính</label>
                {errors.DonViTinhID &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.DonViTinhID}
                    </span>
                }
            </div>
            <div className="inputGroup">
                <input type="number" name='LoaiSanPhamId' required
                    value={formData.LoaiSanPhamId}
                    onChange={handleChange}
                />
                <label>Loại Sản Phẩm</label>
                {errors.LoaiSanPhamId &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.LoaiSanPhamId}
                    </span>
                }
            </div>
            <div className="inputGroup">
                <input type="text" name='LoaiChiTiet' required
                    value={formData.LoaiChiTiet}
                    onChange={handleChange}
                />
                <label>Loại Chi Tiết</label>
                {errors.LoaiChiTiet &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.LoaiChiTiet}
                    </span>
                }
            </div>
            <div className="inputGroup">
                <input type="number" name='Gia' required
                    value={formData.Gia}
                    onChange={handleChange}
                />
                <label>Giá</label>
                {errors.Gia &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.Gia}
                    </span>
                }
            </div>
            <div className="inputGroup">
                <input type="number" name='SoLuong' required
                    value={formData.SoLuong}
                    onChange={handleChange}
                />
                <label>Số Lượng</label>
                {errors.SoLuong &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.SoLuong}
                    </span>
                }
            </div>
            <div className="inputGroup">
                {/* <label>Mô Tả</label> */}
                <ReactQuill
                    ref={quillRef}
                    value={formData.MoTa}
                    onChange={(value) => handleChange({ target: { name: 'MoTa', value } })}
                    placeholder="Nhập mô tả sản phẩm của bạn..."
                    modules={{
                        toolbar: [
                            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                            ['bold', 'italic', 'underline'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            [{ 'align': [] }],
                            ['clean'],
                            ['image', 'video', 'code-block'], // Thêm nút video
                        ],
                    }}
                />
                {errors.MoTa &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.MoTa}
                    </span>
                }
            </div>
            {/* <div className="inputGroup">
                <input
                    type="file"
                    name='HinhAnh'
                    required
                    accept="image/*"
                    multiple // Thêm thuộc tính này để cho phép chọn nhiều file
                    onChange={handleChange}
                />
                {errors.HinhAnh &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.HinhAnh}
                    </span>
                }
            </div> */}
            <div className="inputGroup">
                <input
                    type="file"
                    name='HinhAnh'
                    required
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                />
                {/* Hiển thị hình ảnh tạm thời */}
                {imagePreviewUrls.length > 0 && (
                    <div className="image-preview">
                        {imagePreviewUrls.map((url, index) => (
                            <img key={index} src={url} alt={`Preview ${index}`} style={{ width: '100px', height: '100px', margin: '5px' }} />
                        ))}
                    </div>
                )}
                {errors.HinhAnh &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.HinhAnh}
                    </span>
                }
            </div>
            {/* <div className='inputGroup'>
                <Form.Select
                    required
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    aria-label="Chọn vai trò"
                >
                    <option value="">Chọn vai trò</option>
                    <option value="user">Người dùng</option>
                    <option value="quanly">Quản lý</option>
                    <option value="admin">Admin</option>
                </Form.Select>
                {errors.role &&
                    <span
                        style={{ fontSize: '.75rem' }}
                        className='text-orange'>
                        {errors.role}
                    </span>
                }
            </div> */}

        </InputGroup>
    );
};

export default InputFormSanPham;
