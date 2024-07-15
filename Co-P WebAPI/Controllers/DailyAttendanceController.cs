using CO_P_library.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Co_P_WebAPI.Controllers
{
    [EnableCors()]
    public class DailyAttendanceController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("GetDailyAttendance")]
        public dynamic GetAttendance(DateTime date)
        {
            var attendace = db.DailyAttendances.Where(x => x.Date == date).Select(a => new
            {
                date = a.Date,
                ChildName = a.Child.ChildFirstName + " " + a.Child.ChildSurname,
                MorningPresence = a.MorningPresenceNavigation.AttendanceCodeName,
                AfternoonPresence = a.AfternoonPresenceNavigation.AttendanceCodeName

            });

            return attendace;
        }

        [HttpGet]
        [Route("CountAttendance")]
        public dynamic CountAttendance()
        {
            var kids = db.Children.Count();
            var Attendance = db.DailyAttendances.Where(x => x.Date == DateTime.Today && x.MorningPresence == 1 && x.AfternoonPresence == 0).Count();
            return ($"{Attendance} / {kids}");
        }


        [HttpPost]
        [Route("AddMorningPresence")]
        public dynamic addMorningPresence(string childID, int MorningP)
        {
            DailyAttendance DA = new DailyAttendance();
            DA.Date = DateTime.Today;
            DA.ChildId = childID;
            DA.MorningPresence = MorningP;

            db.DailyAttendances.Add(DA);
            db.SaveChanges();
            return DA;

        }

        [HttpPost]
        [Route("AddAfternoonPresence")]
        public dynamic addAfternoonPresence(string ID, int AfternoonP)
        {
            var dateNow = DateTime.Today;
            DailyAttendance daily = db.DailyAttendances.Where(x => x.ChildId == ID && x.Date == dateNow).FirstOrDefault();
            if (daily == null)
            {
                return ("Child did not found");
            }
            daily.AfternoonPresence = AfternoonP;

            db.DailyAttendances.Update(daily);
            db.SaveChanges();
            return daily;

        }

    }
}
