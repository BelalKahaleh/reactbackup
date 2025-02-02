const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure email transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "your-email@gmail.com", // Replace with your email
    pass: "your-email-password",  // Use App Password if 2FA is enabled
  },
});

// Function to check due dates and send emails
exports.checkTaskDeadlines = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  const db = admin.database();
  const tasksRef = db.ref("tasks");
  const usersRef = db.ref("users");

  const snapshot = await tasksRef.once("value");
  const tasks = snapshot.val();

  if (!tasks) return null;

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Get tomorrow's date
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  for (const [taskId, task] of Object.entries(tasks)) {
    if (task.dueDate === tomorrowStr) {
      // Fetch user email
      const userSnapshot = await usersRef.child(task.assignedTo).once("value");
      const userData = userSnapshot.val();

      if (userData && userData.email) {
        const mailOptions = {
          from: "your-email@gmail.com",
          to: userData.email,
          subject: "Task Deadline Reminder",
          text: `Reminder: Your task "${task.title}" is due tomorrow! Please complete it before the deadline.`,
        };

        try {
          await transporter.sendMail(mailOptions);
          console.log(`Email sent to ${userData.email}`);
        } catch (error) {
          console.error("Error sending email:", error);
        }
      }
    }
  }

  return null;
});
