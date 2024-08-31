using CO_P_library.Models;
using Co_P_WebAPI.DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Co_P_WebAPI.Controllers
{
    [EnableCors()]
    public class MealController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();
        [HttpGet]
        [Route("getmeallist")]
        public dynamic GetMeallist()
        {
            var meals = db.Meals;
            return meals;
        }

        [HttpPut]
        [Route("Updatemeal")]
        public dynamic UpdateMeal(string mealName, string mealD)
        {
            var M = db.Meals.Where(x => x.MealType == mealName).FirstOrDefault();
            if (M == null)
            {
                return "Meal name cant be null";
            }
            M.MealDetails = mealD;
            db.Meals.Update(M);
            db.SaveChanges();
            return M;
        }

        [HttpPost]
        [Route("createMeal")]
        public dynamic CreateMeal(string mealName, string mealD)
        {
            Meal M = new Meal();
            if (mealName == null || mealD == null)
            {
                return "Meal Name or Meal Details cant be null";
            }
            M.MealType = mealName;
            M.MealDetails = mealD;
            db.Meals.Add(M);
            db.SaveChanges();
            return M;

        }
        [HttpDelete]
        [Route("deleteMeal")]
        public dynamic DeleteMeal(string mealName)
        {
            if (mealName == null)
            {
                return "Meal name cant be null";
            }
            var M = db.Meals.Where(x => x.MealType == mealName).FirstOrDefault();
            if (M == null)
            {
                return "Meal not found";
            }
            db.Meals.Remove(M);
            db.SaveChanges();
            return M;
        }

        [HttpGet]
        [Route("getbydateandkindergarten/{kindergartenNumner}/{today}")]
        public dynamic Getbydateandkindergarten(string kindergartenNumner, DateTime today)
        {
            var ActualActivities = db.ActualActivities.Where(a => a.ActivityDate == today && a.KindergartenNumber == kindergartenNumner && a.ActivityNumber == 10).Select(m => new MealsInKindergartenDTO()
            {
                ActivityDate = m.ActivityDate,
                KindergartenName = m.KindergartenNumberNavigation.KindergartenName,
                MaelName = m.MealNumberNavigation.MealType,
                MealDetails = m.MealNumberNavigation.MealDetails


            });
            return ActualActivities;
        }

        [HttpPut]
        [Route("Editbydateandkindergarten")]
        public dynamic Editbydateandkindergarten(string kindergartenNumner, DateTime date, string mealName, string mealDetail)
        {
            var a = db.ActualActivities.Where(a => a.ActivityDate == date && a.KindergartenNumber == kindergartenNumner && a.MealNumberNavigation.MealType == mealName).FirstOrDefault();
            a.MealNumberNavigation.MealDetails = mealDetail;

            db.SaveChanges();

            return ("UpDate ");
        }
    }
}
