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
        [Route("getbydateandkindergarten/{kindergartenNumber}/{date}")]
        public dynamic Getbydateandkindergarten(int kindergartenNumber, DateTime date)
        {
            var actualActivities = db.ActualActivities
                .Where(a => a.ActivityDate.Date == date.Date && a.KindergartenNumber == kindergartenNumber)
                .Select(m => new MealsInKindergartenDTO()
                {
                    ActivityDate = m.ActivityDate,
                    KindergartenName = m.KindergartenNumberNavigation.KindergartenName,
                    MaelName = m.MealNumberNavigation.MealType,
                    MealDetails = m.MealNumberNavigation.MealDetails
                })
                .ToList();

            return actualActivities;
        }


        [HttpPut]
        [Route("Editbydateandkindergarten")]
        public dynamic Editbydateandkindergarten(int kindergartenNumber, DateTime date, string mealName, string mealDetail)
        {
            var activity = db.ActualActivities
                .Where(a => a.ActivityDate.Date == date.Date
                            && a.KindergartenNumber == kindergartenNumber
                            && a.MealNumberNavigation.MealType == mealName)
                .FirstOrDefault();

            if (activity != null)
            {
                activity.MealNumberNavigation.MealDetails = mealDetail;
                db.SaveChanges();
            }

            return "Update";
        }


    }
}
