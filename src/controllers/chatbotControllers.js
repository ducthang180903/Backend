require("dotenv").config();

let getHomePage = (req, res) =>{
    return res.send("Xin chào")
};

let postWebhook = (req, res) =>{
    let body = req.body;

    // Kiểm tra xem có tin nhắn đến không
    if (body.object === 'page') {
        body.entry.forEach(entry => {
            const webhook_event = entry.messaging[0];
            console.log(webhook_event); // Log thông tin tin nhắn
        });
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
};

let getWebhook = (req, res) =>{
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN; // Mã xác minh của bạn    

    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];

    if(mode && token){
        // Kiểm tra mã xác minh
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verified');
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403); // Forbidden
    }
    }
    
};

module.exports = {
    getHomePage: getHomePage,
    getWebhook: getWebhook,
    postWebhook: postWebhook, //key:value
}