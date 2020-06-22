const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.customLogger = functions.https.onRequest((req, resp) => {
    setTimeout(() => console.log("Hello World after 2000ms"), 2000);
    resp.send("Hello from cloud function");
});

exports.createTaskNotifier = functions.firestore
    .document('projects/{projectName}')
    .onCreate((snapshot, context) => {
        const project = snapshot.data();

        const notificationPayload = {
            notification: {
                title: "New Project Creation",
                body: `A new project: ${project.projectName} has been created!!!`,
                clickAction: "FLUTTER_NOTIFICATION_CLICK"
            }
        }

        console.log('New Project Created');

        return admin.messaging().sendToDevice(project.token, notificationPayload);
    });

exports.taskNotifier = functions.firestore
    .document('projects/{projectName}')
    .onCreate((snapshot, context) => {
        const project = snapshot.data();
        project.firstTaskDate = Date.parse(snapshot.data().firstTaskDate);
        project.secondTaskDate = Date.parse(snapshot.data().secondTaskDate);
        project.thirdTaskDate = Date.parse(snapshot.data().thirdTaskDate);
        project.finalTaskDate = Date.parse(snapshot.data().finalTaskDate);

        const firstTime = project.firstTaskDate.getTime() - (new Date()).getTime();
        const secondTime = project.secondTaskDate.getTime() - (new Date()).getTime();
        const thirdTime = project.thirdTaskDate.getTime() - (new Date()).getTime();
        const finalTime = project.finalTaskDate.getTime() - (new Date()).getTime();

        const firstTaskPayload = {
            notification: {
                title: "First Task Deadline",
                body: `Your Project ${project.projectName}'s first deadline is here`,
                clickAction: "FLUTTER_NOTIFICATION_CLICK"
            }
        }

        const secondTaskPayload = {
            notification: {
                title: "Second Task Deadline",
                body: `Your Project ${project.projectName}'s second deadline is here`,
                clickAction: "FLUTTER_NOTIFICATION_CLICK"
            }
        }

        const thirdTaskPayload = {
            notification: {
                title: "Third Task Deadline",
                body: `Your Project ${project.projectName}'s third deadline is here`,
                clickAction: "FLUTTER_NOTIFICATION_CLICK"
            }
        }

        const finalTaskPayload = {
            notification: {
                title: "Final Task Deadline",
                body: `Your Project ${project.projectName}'s final deadline is here`,
                clickAction: "FLUTTER_NOTIFICATION_CLICK"
            }
        }

        setTimeout(() => (admin.messaging().sendToDevice(project.token, firstTaskPayload)), firstTime);
        setTimeout(() => (admin.messaging().sendToDevice(project.token, secondTaskPayload)), secondTime);
        setTimeout(() => (admin.messaging().sendToDevice(project.token, thirdTaskPayload)), thirdTime);
        setTimeout(() => (admin.messaging().sendToDevice(project.token, finalTaskPayload)), finalTime);

        return null;
    });