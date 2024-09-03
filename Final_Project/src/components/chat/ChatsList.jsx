import { Link } from "react-router-dom";
import EfooterS from "../../Elements/EfooterS";
import EfooterP from "../../Elements/EfooterP";

import "./chat.css";
import { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { CircularProgress } from "@mui/material";
import { getChildByParent, getChildPhoto } from "../../utils/apiCalls";

export default function ChatsList() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getAllChats() {
      try {
        let chats;
        if (localStorage.getItem("role_code") === "111") {
          chats = await getDocs(
            query(
              collection(db, "chats"),
              where("admin", "==", localStorage.getItem("user_id"))
            )
          );
        } else {
          chats = await getDocs(
            query(
              collection(db, "chats"),
              where(
                "participants",
                "array-contains",
                localStorage.getItem("user_id")
              )
            )
          );
        }
        const chatsToShow = [];
        for (const doc of chats.docs) {
          const data = doc.data();

          const child = await getChildByParent(doc.get("participants")[0]);
          const photo = await getChildPhoto(doc.get("childId"));

          const url = URL.createObjectURL(photo);
          chatsToShow.push({
            id: doc.id,
            ...data,
            childFirstName: child.childFirstName,
            childImage: url,
          });
        }
        setChats(chatsToShow);
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
            chats
              .sort((a, b) => b.participants.length - a.participants.length)
              .map((chat) => (
                <Link
                  to={`/chat/${chat.id}`}
                  key={chat.id}
                  className="chat-container"
                >
                  <img
                    className="chat-img"
                    src={chat.childImage}
                    alt={chat.childFirstName}
                    onError={(e) => (e.target.srcset = "./Images/default.png")}
                  />
                  <h3 className="chat-text-container">
                    {chat.childId
                      ? localStorage.getItem("role_code") === "111"
                        ? `צ’אט עם ההורים של ${chat.childFirstName}`
                        : "צ’אט עם הגננת"
                      : "צ'אט כללי"}
                  </h3>
                </Link>
              ))
          )}
        </div>
      )}
      {localStorage.getItem("role_code") === "111" ? EfooterS : EfooterP}
    </div>
  );
}
