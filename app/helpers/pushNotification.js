const fs = require("fs");
const path = require('path');


const admin = require("firebase-admin");
const serviceAccount = require('../../config/serviceAccountKey.json');



const certPath = admin.credential.cert(serviceAccount);



var FCM = require('fcm-node');


const sendPushNotification = async(token,message) => {

    try {


        console.log('message:- '+message);

        fs.readFile(path.join(__dirname,'../../config/FirebaseConfig.json'), "utf8", async(err, jsonString) => {
            if (err) {
                console.log("Error reading file from disk:", err);
                return err;
            }
            try {

                //firebase push notification send
                const data = JSON.parse(jsonString);
                var serverKey = data.SERVER_KEY;
                console.log(serverKey);
                var fcm = new FCM(serverKey);

              /*  var push_tokens = await Push_Notification.find({
                    where:{
                        user_id:userId
                    }
                });

                var reg_ids = [];
                push_tokens.forEach(token => {
                    reg_ids.push(token.fcm_token)
                })
*/
                var pushMessage = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    registration_ids:token,
                    content_available: true,
                    mutable_content: true,
                    notification: {
                        title:"First message",
                        body: message,
                    },
                 /*   data:{
                        body: message,
                        message:message

                    }*/
                    // data: {
                    //   notification_type: 5,
                    //   conversation_id:inputs.user_id,
                    // }
                };

                fcm.send(pushMessage, function(err, response){
                    if (err) {
                        console.log("Something has gone wrong!",err);
                    } else {
                        console.log("Push notification sent.", response);
                    }
                });


            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });

    } catch (error) {
        console.log(error);
    }

}

module.exports = {
    sendPushNotification
}