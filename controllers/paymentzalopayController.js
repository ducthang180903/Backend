// paymentController.js

const paymentService = require('../services/paymentzalopayService');

const createPaymentzalo = async (req, res) => {
    try {
      // Lấy thông tin từ body request (frontend gửi lên)
      const { amount, items } = req.body;  // amount và items từ frontend
  
      if (!amount || !items || !Array.isArray(items)) {
        return res.status(400).json({ error: 'Invalid data' });  // Kiểm tra dữ liệu đầu vào
      }
  
      // Tạo đơn hàng thanh toán ZaloPay bằng service
      const result = await paymentService.createOrder(amount, items);
  
      // Trả kết quả cho frontend
      return res.status(200).json(result);
    } catch (error) {
      console.error('Error creating order:', error);
      return res.status(500).json({ error: 'Lỗi khi tạo thanh toán ZaloPay.' });
    }
  };

// const paymentCallbackzalo = (req, res) => {
//     const dataStr = req.body.data;
//     const reqMac = req.body.mac;
  
//     console.log('Received callback data:', req.body);
  
//     const result = paymentService.paymentCallbackzalo(dataStr, reqMac);
//     res.json(result);
//   };
  
const handleCallback = async (req, res) => {
  try {
    const result = await paymentService.processCallback(req.body);
    res.json(result);
  } catch (error) {
    console.log('Lỗi:::', error.message);
    res.json({
      return_code: 0,
      return_message: error.message,
    });
  }
};



// Controller để kiểm tra trạng thái đơn hàng
const checkOrderStatus = async (req, res) => {
  const appTransId = req.params.appTransId;

  try {
      const result = await paymentService.checkOrderStatus(appTransId);
      res.json(result); // Trả về kết quả cho client
  } catch (error) {
      res.status(500).json({ error: error.message }); // Xử lý lỗi và trả về cho client
  }
};

module.exports = {
  createPaymentzalo,
  handleCallback,
  checkOrderStatus,
};
