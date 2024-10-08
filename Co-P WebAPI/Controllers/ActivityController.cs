﻿using CO_P_library.Models;
using Co_P_WebAPI.DTO;
using Microsoft.AspNetCore.Mvc;

namespace Co_P_WebAPI.Controllers
{
    public class ActivityController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("GetDaySummaryByDate/{today}/{kindernumber}")]
        public IActionResult GetDaySummaryByDate(DateTime today, int kindernumber)
        {
            var summary = db.DaySummaries
                .Where(s => s.DaySummaryDate.Date == today && s.KindergartenNumber == kindernumber)
                .FirstOrDefault();

            if (summary == null)
            {
                return NotFound("Day summary not found");
            }

            return Ok(summary.SummaryDetails);
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
        [Route("GetAllActivitiesByDate/{kindergartenNumber}/{Activitydate}")]
        public dynamic GetAllActivitesByDate(int kindergartenNumber, DateTime Activitydate)
        {
            var activities = db.ActualActivities
                .Where(a => a.KindergartenNumber == kindergartenNumber && a.ActivityDate == Activitydate.Date)
                .Select(aa => new
                {
                    activityName = aa.ActivityNumberNavigation != null ? aa.ActivityNumberNavigation.ActivityName : "No Activity",
                    activityHour = aa.ActivityHour // כעת, סוג הנתונים הוא TimeSpan ולא DateTime
                })
                .OrderBy(aaa => aaa.activityHour)
                .ToList();

            return activities;
        }

    }
}
