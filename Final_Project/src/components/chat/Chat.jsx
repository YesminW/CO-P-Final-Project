import { Link, useParams } from "react-router-dom";
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
import { getChildByParent, getChildPhoto } from "../../utils/apiCalls";

export default function Chat() {
  const { id } = useParams();
  const [chat, setChat] = useState({});
  const [messages, setMessages] = useState([]);
  const [images, setImages] = useState({});
  const [loading, setLoading] = useState(true);
  const inputRef = useRef(null);

  function formatForMessages(date) {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day}:${month}:${year} - ${hours}:${minutes}`;
  }

  async function createMessage(e) {
    if (!inputRef.current.value.trim()) return;
    const messageData = {
      chatId: id,
      sender: localStorage.getItem("user_id"),
      text: inputRef.current.value.trim(),
      sentAt: Timestamp.now(),
      url:
        localStorage.getItem("user_id") === chat.admin
          ? images.teacher
          : images.child,
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
        // const childImage = await getChildPhoto(child.childId);
        // const teacherImage = await getChildPhoto(chat.admin);
        const childImage = "/default.png";
        const teacherImage = "/logo.png";

        setImages({ child: childImage, teacher: teacherImage });

        if (chat.data().messages?.length > 0) {
          setMessages(
            await Promise.all(
              chat.data().messages?.map(async (mId) => {
                const message = await getDoc(doc(db, "messages", mId));
                console.log(message.get("sender"), chat.get("admin"));
                return {
                  id: mId,
                  ...message.data(),
                  url:
                    message.data()["sender"] === chat.get("admin")
                      ? teacherImage
                      : childImage,
                };
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
        <Link className="linkback" to="/ChatList">
          {"<"}
        </Link>
        <img
          className="chat-img"
          src={
            chat.participants.length > 2
              ? images.teacher
              : localStorage.getItem("role_code") === "111"
              ? images.child
              : images.teacher
          }
        />
        <h1 className="chat-message">
          {chat.participants.length > 2
            ? "צ'אט כללי"
            : localStorage.getItem("role_code") === "111"
            ? `צ’אט עם ההורים של ${chat.childFirstName}`
            : "צ’אט עם הגננת"}
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
                  message.sender !== localStorage.getItem("user_id") &&
                  "reverse"
                }`}
              >
                <img className="chat-img" src={message.url} alt="user" />
                <div className="flex-column width-full">
                  <span className="chat-text-container chat-message-text">
                    {message.text}
                  </span>
                  <span className="chat-message-timestamp">
                    {formatForMessages(new Date(message.sentAt.seconds * 1000))}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        {chat.participants.length > 2 ? (
          localStorage.getItem("role_code") === "111" ? (
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
          ) : (
            <div></div>
          )
        ) : (
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
        )}
      </div>
    </div>
  );
}
