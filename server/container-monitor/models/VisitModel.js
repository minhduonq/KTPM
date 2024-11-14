const e = require('express');
const db = require('../config/db')

module.exports = class VisitTracker {

    static async checkExist(ref_path) {
        try {
            const snapshot = await db.ref(ref_path).get();
            if(snapshot.exists()) {
                return true;
            } else {
                return false;
            }
        } catch(error) {
            console.error('Error checking reference:', error);
            return false;
        }
    }

    static async getHourVisitor(hour_ref) {
        try {
            const snapshot = await db.ref(hour_ref).get();
            if(snapshot.exists()) {
                return snapshot.val();
            }
        }
        catch(error) {
            console.log("Error: " + error);
            throw error;
        }
        return null;
    }

    static async updateVisitor(hour_ref) {
       const currentVisit = await this.getHourVisitor(hour_ref);
       if(currentVisit == null) {
        return false;
       }
       let newVisit = currentVisit.visitors + 1;
       try {
        await db.ref(hour_ref + '/visitors').set(newVisit);
        return true;
       } catch(error) {
        console.log("Error while updating" + error);
        return false;
       }
    }

    static createHours() {
        const intervals = [];
        for (let i = 0; i < 24; i++) {
            const start = i;
            const end = (i + 1); // modulo 24 to wrap around at the end of the day
            let time_start, time_end;
            if(start < 10) {
                time_start = '0' + start.toString();
            } else {
              time_start = start.toString();
            }
            if(end < 10) {
                time_end = '0' + end.toString();
            } else {
              time_end = end.toString()
            }
            intervals.push(`${time_start}-${time_end}`);
        }
        return intervals;
    }

    static async addVisitIndex(day, hour) {
        // lấy ref của ngày và giờ
       const day_ref = '/' +  day;
        // check xem liệu ngày đã được tạo chưa
       const day_ref_exists = await this.checkExist(day_ref);
       if(!day_ref_exists) {
        // nếu ngày chưa được tạo thì tạo ngày mới với đầy đủ múi giờ
        const hours = this.createHours();
        for(let i = 0; i<hours.length; i++) {
            const each_hour_reference = day_ref + '/' + hours[i];
            if(hour === hours[i]) {
                await db.ref(each_hour_reference).set({visitors: 1});
                console.log("Added new day and new visitor successfully");
            } else {
                await db.ref(each_hour_reference).set({visitors: 0});
            } 
        }
       } else {
        // nếu ngày đã được tạo thì insert giá trị vào nó
            const hour_ref = day_ref + "/" + hour;
            const result = await this.updateVisitor(hour_ref)
            if(result) {
                console.log("Update new visitor successfully");
            } else {
                console.log("Update new visitor unsuccessfully");
            }
       }
    }

    /*
    static async getVisitPerDay() {
        try {
            const snapshot = await db.ref('/').get();
            if(snapshot.exists()) {
                return snapshot.val();
            } else {
                return null;
            }
        } catch(error) {
            console.log("Error while getting visit for day:", day, "-", error);
            return null;
        }
    }
    */
}

