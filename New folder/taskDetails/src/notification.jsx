import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";





const DesignLoginForm = () => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    // Fetch task details
    const taskRef = ref(database, "tasks");

    onValue(taskRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTitle(data.title || "");
        setDueDate(data.dueDate || "");
        checkDeadline(data.dueDate);
      }
    });
  }, []);

  // Function to check if task is due tomorrow
  const checkDeadline = (date) => {
    if (!date) return;

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    if (date === tomorrowStr) {
      setShowReminder(true);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {showReminder && (
            <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
              ⚠️ Reminder: Task "{title}" is due tomorrow!
            </div>
          )}
          <h1 className="text-xl font-bold mb-4">{title}</h1>

          <div className="mb-4">
            <p className="text-gray-600">Due date</p>
            <p className="font-medium">{dueDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignLoginForm;
