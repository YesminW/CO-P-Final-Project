import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../assets/StyleSheets/Meals.css";
import EfooterS from "../../Elements/EfooterS";
import { hebrewWeekDays } from "../../utils/constants";
import { formatDate, formatForCSharp } from "../../utils/functions";
import { nanoid } from "nanoid";
import {
  createMeal,
  getMealByKindergardenAndDate,
  getMealList,
} from "../../utils/apiCalls";

const WatchMeal = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const date = location.state;
  const kindergartenNumber = localStorage.getItem("kindergartenNumber");

  const [mealOptions, setMealOptions] = useState([]);
  const [mealData, setMealData] = useState({
    בוקר: "",
    עשר: "",
    צהריים: "",
    ארבע: "",
  });
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const data = await getMealByKindergardenAndDate(
          date,
          kindergartenNumber
        );
        const options = await getMealList();
        setMealOptions(options);

        const meals = { בוקר: "", עשר: "", צהריים: "", ארבע: "" };
        for (const meal of data) {
          if (meal.mealDetails !== null) {
            meals[meal.maelName] = meal.mealDetails;
          }
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

  async function handleSubmit(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target));

    try {
      const mealPromises = [];

      for (const mealName of Object.keys(data)) {
        const mealDetails = data[mealName];

        const meal = mealOptions.find((m) => m.mealDetails === mealDetails);
        if (!meal) continue;

        mealPromises.push(
          createMeal(
            kindergartenNumber,
            formatForCSharp(date),
            mealName,
            mealDetails,
            meal.mealNumber
          )
        );
      }

      await Promise.all(mealPromises);

      navigate("/Meals");
    } catch (error) {
      console.error("Error submitting meal data:", error);
    }
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
              {Object.keys(mealData).map((mealKey, index) => (
                <tr key={nanoid()}>
                  <td className="meal-time">{mealKey}</td>
                  <td className="meal-description">
                    <select
                      className="meal-select"
                      name={mealKey}
                      defaultValue={mealData[mealKey]}
                    >
                      <option value="">בחר ארוחה</option>
                      <option value={mealOptions[index].mealDetails}>
                        {mealOptions[index].mealDetails}
                      </option>
                    </select>
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
      {EfooterS}
    </div>
  );
};

export default WatchMeal;
