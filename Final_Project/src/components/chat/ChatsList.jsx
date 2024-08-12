import { Link } from "react-router-dom";
import EfooterS from "../../Elements/EfooterS";
import "./chat.css";
import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { CircularProgress } from "@mui/material";
export default function ChatsList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getAllChats() {
      try {
        const chats = await getDocs(collection(db, "chats"));
        setChats(
          chats.docs.map((doc) => {
            return { id: doc.id, ...doc.data() };
          })
        );
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    getAllChats();
  }, []);
  return (
    <div className="page-container">
      <h1 className="chat-title">עם מי נדבר?</h1>
      {loading ? (
        <CircularProgress />
      ) : (
        <div className="chats-list-container week-calendar-container">
          {chats.length === 0 ? (
            <h2>אין שיחות</h2>
          ) : (
            chats.map((chat) => (
              <Link
                to={`/chat/${chat.id}`}
                key={chat.id}
                className="chat-container"
              >
                <img
                  className="chat-img"
                  src={chat.parentImage}
                  alt={chat.name}
                />
                <h3 className="chat-text-container">{chat.childName}</h3>
              </Link>
            ))
          )}
        </div>
      )}
      {EfooterS}
    </div>
  );
}
