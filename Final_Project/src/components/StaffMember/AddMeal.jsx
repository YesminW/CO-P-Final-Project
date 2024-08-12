import React, { useState, useEffect } from 'react';
import EfooterS from '../../Elements/EfooterS';
import '../../assets/StyleSheets/AddMeals.css'; // עדכון ייבוא ה-CSS

export default function AddMeal() {

    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedMeal, setSelectedMeal] = useState('');
    const [foodOptions, setFoodOptions] = useState([]);

    useEffect(() => {
        const generateDates = () => {
            const dateArray = [];
            let currentDate = new Date(2023, 8, 1); // Start from September 1st, 2023
            const endDate = new Date(2024, 8, 1); // End at September 1st, 2024

            while (currentDate <= endDate) {
                dateArray.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dateArray;
        };

        const formattedDates = generateDates().map(date => date.toLocaleDateString('he-IL'));
        setDates(formattedDates);
    }, []);

    useEffect(() => {
        if (selectedDate && selectedMeal) {
            setFoodOptions([
                { name: "חטיפים בריאים", image: "path/to/image1.png" },
                { name: "כריכים", image: "path/to/image2.png" },
                { name: "פירות חתוכים", image: "path/to/image3.png" }
            ]);
        } else {
            setFoodOptions([]);
        }
    }, [selectedDate, selectedMeal]);

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleMealChange = (event) => {
        setSelectedMeal(event.target.value);
    };

    const handleSubmit = () => {
        // Handle the form submission logic
        console.log(`Selected Date: ${selectedDate}, Selected Meal: ${selectedMeal}`);
    };

    const handleAddNewDish = () => {
        // Logic for adding a new dish
        console.log('Add new dish');
    };

    return (
        <div className="add-meal-container">
            <header className="add-meal-header">
                <h1 className="add-meal-title">מה אוכלים היום</h1>
            </header>
            <div className="add-meal-select-container">
                <div className="add-meal-select-wrapper">
                    <select
                        id="date-select"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="add-meal-select">
                        <option value="">בחר תאריך</option>
                        {dates.map((date, index) => (
                            <option key={index} value={date}>{date}</option>
                        ))}
                    </select>
                </div>
                <div className="add-meal-select-wrapper">
                    <select
                        id="meal-select"
                        value={selectedMeal}
                        onChange={handleMealChange}
                        className="add-meal-select">
                        <option value="">בחר ארוחה</option>
                        <option value="בוקר">בוקר</option>
                        <option value="צהריים">צהריים</option>
                        <option value="ארבע">ארבע</option>
                        <option value="פינוק מיוחד">פינוק מיוחד</option>
                    </select>
                </div>
            </div>
            {selectedDate && selectedMeal && (
                <>
                    <div className="food-options-title">מה יהיה לאכול?</div>
                    <div className="food-options-container">
                        {foodOptions.map((option, index) => (
                            <div key={index} className="food-option">
                                <img src={option.image} alt={option.name} className="food-option-image" />
                                <div className="food-option-name">{option.name}</div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={handleAddNewDish}
                        className="btn">
                        הוספת מנה חדשה
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="btn">
                        עדכן
                    </button>
                </>
            )}
            {EfooterS}
        </div>
    );
}
