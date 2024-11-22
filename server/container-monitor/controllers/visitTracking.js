const jwt = require('jsonwebtoken');
const JWT_SECRET = 'visited';

const visitTrackingModel = require('../models/VisitModel')

function getDayAndHour() {
    let visit_hour;
    let visit_date;
    const currentTime = new Date();
    const h = currentTime.getHours();
    const formattedH = h.toString().padStart(2, "0");
    const formattedNextH = (h + 1).toString().padStart(2, "0");
    visit_hour = `${formattedH}-${formattedNextH}`;
    const day = currentTime.getDate();
    const month = currentTime.getMonth() + 1;
    const year = currentTime.getFullYear();
    visit_date = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month}-${year}`;
    return {visit_date, visit_hour}
}

exports.visitTracking = (req, res) => {
    const token = req.cookies.session;
    const visit_time = getDayAndHour();
    const visit_day = visit_time.visit_date;
    const visit_hour = visit_time.visit_hour;
    if (!token) {
        // Tạo JWT token mới và gửi về client
        const newToken = jwt.sign({ session: true }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('session', newToken, { httpOnly: true });
        res.send("Welcome new user");
        console.log("Welcom new visitor");
        visitTrackingModel.addVisitIndex(visit_day, visit_hour)
    } else {
        try {
            // Xác thực JWT token
            jwt.verify(token, JWT_SECRET);
            console.log("Visited User")
            res.send("Visited user");
        } catch (err) {
            // Token không hợp lệ hoặc đã hết hạn, tạo mới
            const newToken = jwt.sign({ session: true }, JWT_SECRET, { expiresIn: '1h' });
            res.cookie('session', newToken, { httpOnly: true });
            res.send("Welcome new user");
            visitTrackingModel.addVisitIndex(visit_day, visit_hour)
        }
    }
}

