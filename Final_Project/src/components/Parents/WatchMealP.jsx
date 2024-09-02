import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/StyleSheets/Meals.css";
import { hebrewWeekDays } from "../../utils/constants";
import { formatDate } from "../../utils/functions";
import { nanoid } from "nanoid";
import { getMealByKindergardenAndDate } from "../../utils/apiCalls";
import EfooterP from "../../Elements/EfooterP";

const WatchMealP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const date = location.state;
  const kindergartenNumber = localStorage.getItem("kindergartenNumber");

  const [mealData, setMealData] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const data = await getMealByKindergardenAndDate(
          date,
          kindergartenNumber
        );
        const meals = { בוקר: "", עשר: "", צהריים: "", ארבע: "" };
        for (const meal of data) {
          meals[meal.maelName] = meal.mealDetails;
        }
        setMealData(meals);
        setIsDataLoaded(true);
      } catch (error) {
        console.error("Error fetching meal data:", error);
        setIsDataLoaded(true);
      }
    };

    fetchMealData();
  }, [date, kindergartenNumber]);

  function handleSubmit(e) {
    e.preventDefault();
    navigate("/MealsP");
  }

  return (
    <div className="container flex-column center">
      <header className="headermeals">מה אוכלים היום</header>
      <form className="meal-info" onSubmit={handleSubmit}>
        <h2 className="h2meals">{`${hebrewWeekDays[date.getDay()]} `}</h2>
        <h3 className="h3meals">{formatDate(date)}</h3>
        {isDataLoaded ? (
          <table className="meal-table">
            <tbody>
              {Object.keys(mealData).map((mealKey) => (
                <tr key={nanoid()}>
                  <td className="meal-time">{mealKey}</td>
                  <td className="meal-description">
                    <p name={mealKey} defaultValue={mealData[mealKey]}></p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="h3meals">טוען נתונים...</p>
        )}
        <button className="confirm-btn">אישור</button>
      </form>
      {EfooterP}
    </div>
  );
};

export default WatchMealP;
