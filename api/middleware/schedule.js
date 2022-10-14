const _ = require("lodash");
const webpush = require("web-push");
const scheduleLib = require("node-schedule");
const admin = require("firebase-admin");

const serviceAccount = require("../../serviceAccountKey.json");

// Firebase initialization.
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: `${process.env.FIREBASE_DB_URL}`,
});

const schedule = {};

// https://www.udemy.com/course/progressive-web-app-pwa-the-complete-guide/
// https://izaanjahangir.medium.com/setting-schedule-push-notification-using-node-js-and-mongodb-95f73c00fc2e

schedule.sendMessage = function () {
  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    `${process.env.VAPID_PUBLICKEY}`,
    `${process.env.VAPID_PRIVATEKEY}`
  );

  admin
    .database()
    .ref("subscription")
    .once("value")
    .then((subscriptions) => {
      subscriptions.forEach((sub) => {
        const pushConfig = {
          endpoint: sub.val().endpoint,
          keys: {
            auth: sub.val().keys.auth,
            p256dh: sub.val().keys.p256dh,
          },
        };

        webpush
          .sendNotification(
            pushConfig,
            "Make sure to check out your user statistics in the settings tab before they reset on Monday!."
          )
          .catch((err) => {
            console.log("Error: ", err);
          });
      });
    });
};

// Scheduling a notification.
schedule.createSchedule = async (data) => {
  try {
    const dayOfWeek = data.days.join(",");
    const timeToSent = data.time.split(":");
    const hours = timeToSent[0];
    const minutes = timeToSent[1];
    const date = `${minutes} ${hours} * * ${dayOfWeek}`;

    scheduleLib.scheduleJob(date, schedule.sendMessage);
  } catch (error) {
    throw new Error(error);
  }
};

schedule.getJobs = function () {
  return scheduleLib.scheduledJobs;
};

module.exports = schedule;
