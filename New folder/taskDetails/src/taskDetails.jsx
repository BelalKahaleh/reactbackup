import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
import  { auth, database } from "./firebase";

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);
// const auth = getAuth(app);

const DesignLoginForm = () => {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch task details
    const taskRef = ref(database, "tasks");
    
    onValue(taskRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTitle(data.title || "");
        setDueDate(data.dueDate || "");
        setDescription(data.description || "");
        setPriority(data.priority || "Normal"); // Default to "Normal" if not set
      }
    });

    // Fetch comments
    const commentsRef = ref(database, "comments");
    onValue(commentsRef, (snapshot) => {
      const data = snapshot.val();
      setComments(data ? Object.values(data) : []);
    });

    // Fetch authenticated user
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(database, `users/${user.uid}/name`);
        onValue(userRef, (snapshot) => {
          setUser({ id: user.uid, name: snapshot.val() || "Unknown User" });
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  const handlePublish = () => {
    if (newComment.trim() === "") return;

    const comment = {
      author: user ? user.name : "Anonymous",
      time: new Date().toLocaleString(),
      content: newComment,
    };

    // Save comment to Firebase
    const commentsRef = ref(database, "comments");
    push(commentsRef, comment);

    // Clear the input field
    setNewComment("");
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-xl font-bold mb-4">{title}</h1>

          <div className="mb-4">
            <p className="text-gray-600">Due date</p>
            <p className="font-medium">{dueDate}</p>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Priority</p>
            <span className="px-2 py-1 rounded-full bg-red-500 text-white">
              {priority}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-gray-600">Description</p>
            <p className="text-gray-800">{description}</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h2 className="text-lg font-medium mb-4">Comments ({comments.length})</h2>
            <div className="mb-4">
              <textarea
                placeholder="Add a comment"
                className="w-full border border-gray-300 rounded-lg p-2 mb-2"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              ></textarea>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center"
                onClick={handlePublish}
              >
                 Submit
              </button>
            </div>

            {comments.map((comment, index) => (
              <div key={index} className="mb-4">
                <p className="font-medium">{comment.author}</p>
                <p className="text-gray-600 text-sm mb-2">{comment.time}</p>
                <p className="text-gray-800">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignLoginForm;
