using CO_P_library.Models;
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

        [HttpPut]
        [Route("UpdateSummary")]
        public dynamic UpdateSummary(int kindernumber, DateTime today, string summaryupdates)
        {
            var summaryToUpdate = db.DaySummaries.Where(s => s.DaySummaryDate == today && s.KindergartenNumber == kindernumber).FirstOrDefault();
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
        [Route("createSummary")]
        public dynamic createSummary (int CurrentAcademicYear, int kindernumber, string Daysummary)
        {
            DaySummary newSummary = new DaySummary();
            newSummary.DaySummaryDate = DateTime.Now;
            newSummary.DaySummaryHour = DateTime.Hour;
            newSummary.SummaryDetails = Daysummary;
            newSummary.KindergartenNumber = kindernumber;
            newSummary.CurrentAcademicYear = CurrentAcademicYear;

            db.DaySummaries.Add(newSummary);
            db.SaveChanges();
            return newSummary;
            

        }




    }
}
