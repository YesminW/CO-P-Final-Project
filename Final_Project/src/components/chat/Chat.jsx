import { useParams } from "react-router-dom";
import "./chat.css";
import { useEffect, useRef, useState } from "react";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import { db } from "../../utils/firebase";
import { getChildByParent } from "../../utils/apiCalls";

export default function Chat() {
  const { id } = useParams();
  const [chat, setChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  async function createMessage(e) {
    if (!inputRef.current.value.trim()) return;
    const messageData = {
      chatId: id,
      sender: localStorage.getItem("user_id"),
      text: inputRef.current.value.trim(),
      sentAt: Timestamp.now(),
    };
    const message = await addDoc(collection(db, "messages"), messageData);
    const chatRef = doc(db, "chats", id);
    await updateDoc(chatRef, {
      messages: arrayUnion(message.id),
    });
    inputRef.current.value = "";
    setMessages((prev) => [...prev, { id: message.id, ...messageData }]);
  }

  useEffect(() => {
    async function getChatById() {
      try {
        const chat = await getDoc(doc(db, "chats", id));
        const child = await getChildByParent(chat.get("participants")[0]);

        if (chat.data().messages?.length > 0) {
          setMessages(
            await Promise.all(
              chat.data().messages?.map(async (mId) => {
                const message = await getDoc(doc(db, "messages", mId));
                return { id: mId, ...message.data() };
              })
            )
          );
        }

        setChat({
          id: doc.id,
          ...chat.data(),
          childFirstName: child.childFirstName,
          childImage: "",
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getChatById();
  }, [id]);

  return loading ? (
    <CircularProgress />
  ) : (
    <div className="flex-column page-container space-between">
      <div className="chat-title">
        <img className="chat-img" src={chat.childImage} />
        <h1 className="chat-message">
          צ’אט עם ההורים של {chat.childFirstName}
        </h1>
      </div>
      <div className="chat-content-container week-calendar-container">
        <div className="chat-messages-container">
          {!messages.length ? (
            <h2>אין הודעות</h2>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${
                  message.sender === "2" && "reverse"
                }`}
              >
                <img className="chat-img" src={message.img} alt="user" />
                <div className="flex-column width-full">
                  <span className="chat-text-container chat-message-text">
                    {message.text}
                  </span>
                  <span className="chat-message-timestamp">
                    {/* {message.timestamp.toLocaleTimeString()} */}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="chat-input-container">
          <button className="chat-send-btn" onClick={createMessage}>
            ⇨
          </button>
          <input
            className="chat-input"
            type="text"
            ref={inputRef}
            placeholder="שלחו הודעה..."
          />
        </div>
      </div>
    </div>
  );
}
