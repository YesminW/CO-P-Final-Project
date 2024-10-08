import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { getAllKindergartens } from "../../utils/apiCalls";

export default function KindergartenManagement() {
  const navigate = useNavigate();
  const [kindergartens, setKindergartens] = useState([]);

  useEffect(() => {
    try {
      async function getKindergartens() {
        try {
          const birth = await getAllKindergartens();
          setKindergartens(birth);
        } catch (error) {
          console.error(error);
        }
      }
      getKindergartens();
    } catch (error) {}
  }, []);

  const handleAddKindergarten = () => {
    navigate("/AddKindergarden");
  };

  return (
    <form>
      <div className="linkbackdeyails">
        <Link className="linkback" to="/AddSAndP">
          {"<"}
        </Link>
      </div>
      <h2 className="registerh2">ניהול גנים</h2>
      {kindergartens.map((kindergarten, index) => (
        <Link
          key={index}
          to={`/KindergartenDetails`}
          state={kindergarten}
          style={{ textDecoration: "none", width: "100%" }}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: "#B9DCD1",
              color: "white",
              margin: "10px 0",
              width: "250px",
              height: "60px",
              fontSize: "28px",
              fontFamily: "Karantina",
              borderRadius: "10px",
            }}
          >
            {kindergarten.kindergartenName}
          </Button>
        </Link>
      ))}
      <Button
        variant="contained"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.28)",
          color: "white",
          marginTop: "20px",
          fontSize: "25px",
          fontFamily: "Karantina",
        }}
        onClick={handleAddKindergarten}
      >
        הוספת גן
      </Button>
    </form>
  );
}
