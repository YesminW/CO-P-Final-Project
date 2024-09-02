using CO_P_library.Models;
using Co_P_WebAPI.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Co_P_WebAPI.Controllers
{
    public class ActivityController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("GetDaySummaryByDate/{today}/{kindernumber}")]
        public dynamic GetDaySummaryByDate(DateTime today, int kindernumber)
        {
            var summary = db.DaySummaries
                .Where(s => s.DaySummaryDate.Date == today && s.KindergartenNumber == kindernumber)
                .FirstOrDefault();
            return summary.SummaryDetails;
        }

        [HttpPut]
        [Route("UpdateSummary")]
        public dynamic UpdateSummary(int kindernumber, DateTime today, string summaryupdates)
        {
            var summaryToUpdate = db.DaySummaries.Where(s => s.KindergartenNumber == kindernumber && s.DaySummaryDate == today).FirstOrDefault();
            if (summaryToUpdate == null)
            {
                return "Summary Details not found";
            }
            summaryToUpdate.SummaryDetails = summaryupdates;
            db.DaySummaries.Update(summaryToUpdate);
            db.SaveChanges();
            return summaryToUpdate;
        }

        [HttpPost]
        [Route("createSummary/{CurrentAcademicYear}/{kindernumber}/{Daysummary}/{today}")]
        public dynamic createSummary(int CurrentAcademicYear, int kindernumber, string Daysummary, DateTime today)
        {
            DaySummary newSummary = new DaySummary();
            newSummary.DaySummaryDate = today;
            newSummary.SummaryDetails = Daysummary;
            newSummary.KindergartenNumber = kindernumber;
            newSummary.CurrentAcademicYear = CurrentAcademicYear;

            db.DaySummaries.Add(newSummary);
            db.SaveChanges();
            return newSummary;

        }


        [HttpGet]
        [Route("GetAllActivitiesByDate")]
        public dynamic GetAllActivitiesByDate(int kindergartenNumber, DateTime date)
        {
            var activities = db.ActualActivities
                .Where(a => a.KindergartenNumber == kindergartenNumber && a.ActivityDate.Date == date.Date).Select(aa => new
                {
                    activityName = aa.ActivityNumberNavigation.ActivityName,
                    activityHour = aa.ActivityDate.Hour
                })
                .ToList();

            return activities;
        }






    }
}
