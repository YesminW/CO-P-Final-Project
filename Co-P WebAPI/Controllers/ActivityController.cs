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

        [HttpPost]
        [Route("createSummary/{CurrentAcademicYear}/{kindernumber}/{Daysummary}/{today}")]
        public dynamic createSummary(int CurrentAcademicYear, int kindernumber, string Daysummary, DateTime today)
        {
            var existingSummary = db.DaySummaries
                .FirstOrDefault(ds => ds.DaySummaryDate == today && ds.KindergartenNumber == kindernumber && ds.CurrentAcademicYear == CurrentAcademicYear);

            if (existingSummary != null)
            {
                existingSummary.SummaryDetails = Daysummary;
                db.SaveChanges();
                return existingSummary;
            }
            else
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
