using CO_P_library.Models;
using Co_P_WebAPI.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Co_P_WebAPI.Controllers
{
    public class ActivityController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("GetDaySummaryByDate")]
        public dynamic GetDaySummaryByDate(DateTime today, int kindernumber)
        {
            var summary = db.DaySummaries.Where(s => s.DaySummaryDate == today && s.KindergartenNumber == kindernumber).FirstOrDefault();
            return summary.SummaryDetails;
        }

        //[HttpPut]
        //[Route("UpdateSummary")]
        //public dynamic UpdateSummary(int kindernumber, DateTime today, string summaryupdates)
        //{
        //    var summaryToUpdate = db.DaySummaries.Where(s => s.DaySummaryDate == today && s.KindergartenNumber = kindernumber).FirstOrDefault();
        //    if (summaryToUpdate == null)
        //    {
        //        return "Summary Details not found";
        //    }
        //    summaryToUpdate.SummaryDetails = summaryupdates;
        //    db.DaySummaries.Update(summaryToUpdate);
        //    db.SaveChanges();
        //    return summaryToUpdate;
        //}

        //[HttpPost]
        //[Route("createSummary")]
        //public dynamic createSummary (int CurrentAcademicYear, int kindernumber, string Daysummary, DateTime today)
        //{
        //    DaySummary newSummary = new DaySummary();
        //    newSummary.DaySummaryDate = today;
        //    newSummary.DaySummaryHour = today.Hour;
        //    newSummary.SummaryDetails = Daysummary;
        //    newSummary.KindergartenNumber = kindernumber;
        //    newSummary.CurrentAcademicYear = CurrentAcademicYear;

        //    db.DaySummaries.Add(newSummary);
        //    db.SaveChanges();
        //    return newSummary; 

        //}

        //[HttpGet]
        //[Route("getbydateandkindergarten/{kindergartenNumner}/{today}")]
        //public dynamic Getbydateandkindergarten(int kindergartenNumner, DateTime today)
        //{
        //    var ActualActivities = db.ActualActivities.Where(a => a.ActivityDate == today && a.KindergartenNumber == kindergartenNumner && a.ActivityNumber == 10).Select(m => new MealsInKindergartenDTO()
        //    {
        //        ActivityDate = m.ActivityDate,
        //        KindergartenName = m.KindergartenNumberNavigation.KindergartenName,
        //        MaelName = m.MealNumberNavigation.MealType,
        //        MealDetails = m.MealNumberNavigation.MealDetails


        //    });
        //    return ActualActivities;
        //}

        //[HttpPut]
        //[Route("Editbydateandkindergarten")]
        //public dynamic Editbydateandkindergarten(int kindergartenNumner, DateTime date, string mealName, string mealDetail)
        //{
        //    var a = db.ActualActivities.Where(a => a.ActivityDate == date && a.KindergartenNumber == kindergartenNumner && a.MealNumberNavigation.MealType == mealName).FirstOrDefault();
        //    a.MealNumberNavigation.MealDetails = mealDetail;

        //    db.SaveChanges();

        //    return ("UpDate ");
        //}




    }
}
