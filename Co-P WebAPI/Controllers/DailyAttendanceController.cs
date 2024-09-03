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
        [Route("GetDailyAttendance/{Attendancedate}")]
        public dynamic GetAttendance(DateTime Attendancedate)
        {
            var attendace = db.DailyAttendances.Where(x => x.Date == Attendancedate);

            return attendace;
        }

        [HttpGet]
        [Route("CountAttendance")]
        public string CountAttendance()
        {
            var kids = db.Children.Count();
            var Attendance = db.DailyAttendances.Where(x => x.Date == DateTime.Today && x.AttendanceStatus == "1").Count();
            return $"{kids} / {Attendance}";
        }



        [HttpPost]
        [Route("UpdateAttendanceStatus/{childID}/{Updatedate}")]
        public dynamic UpdateAttendanceStatus(string childID,  DateTime Updatedate)
        {
            var dailyAttendance = db.DailyAttendances
                .Where(x => x.ChildId == childID && x.Date == Updatedate)
                .FirstOrDefault();

            if (dailyAttendance == null)
            {
                // If no record is found, create a new one with status 1 (indicating morning presence)
                DailyAttendance newAttendance = new DailyAttendance();
                newAttendance.Date = Updatedate;
                newAttendance.ChildId = childID;
                newAttendance.AttendanceStatus = "1"; // Morning presence
                db.DailyAttendances.Add(newAttendance);
                db.SaveChanges();
                return newAttendance;
            }
            else
            {
                // Update the status if the record exists
                if (dailyAttendance.AttendanceStatus == "0")
                {
                    dailyAttendance.AttendanceStatus = "1"; // Update to morning presence
                }
                else if (dailyAttendance.AttendanceStatus == "1")
                {
                    dailyAttendance.AttendanceStatus = "2"; // Update to afternoon presence
                }

                db.DailyAttendances.Update(dailyAttendance);
                db.SaveChanges();
                return dailyAttendance;
            }
        }


    }
}
