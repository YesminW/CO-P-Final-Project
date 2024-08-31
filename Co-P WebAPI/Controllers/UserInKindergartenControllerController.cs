using CO_P_library.Models;
using Co_P_WebAPI.DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Co_P_WebAPI.Controllers
{
    [EnableCors()]
    public class UserInKindergartenControllerController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("GroupUsersByKindergarten")]
        public IActionResult GroupUsersByKindergarten()
        {
            try
            {
                // השגת השנה הנוכחית
                int currentYear = DateTime.Now.Year;

                // קבלת כל המשתמשים מהמסד נתונים
                var users = db.Users.ToList();

                // סינון המשתמשים לפי קוד משתמש (111 או 333) ולפי השנה האקדמית הנוכחית
                var filteredUsers = users.Where(user =>
                    (user.UserCode == 111 || user.UserCode == 333) &&
                    user.CurrentAcademicYear == currentYear)
                    .ToList();

                // חלוקת המשתמשים לקבוצות לפי שם הגן שלהם
                var groupedUsers = filteredUsers
                                    .GroupBy(user => user.KindergartenNumber)
                                    .Select(group => new
                                    {
                                        KindergartenName = group.Key,
                                        Users = group.ToList()
                                    })
                                    .ToList();

                return Ok(groupedUsers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error: " + ex.Message);
            }
        }

        //    [HttpPut]
        //    [Route("AssignUsersToDates")]
        //    public void AssignUsersToDates(int kindergartenNumber)
        //    {
        //        DateTime today = DateTime.Today;

        //        // קבל את התאריך האחרון של השנה הנוכחית
        //        DateTime endOfYear = new DateTime(today.Year, 12, 31);

        //        // שליפת משתמשים עם UserCode 111 (גננת) ו-333 (סייעות) עבור הגן הנבחר
        //        var teachers = db.Users
        //            .Where(u => u.UserCode == 111 && u.KindergartenNumber == kindergartenNumber)
        //            .ToList();

        //        var assistants = db.Users
        //            .Where(u => u.UserCode == 333 && u.KindergartenNumber == kindergartenNumber)
        //            .ToList();

        //        // בדיקת האם יש מספיק גננות וסייעות
        //        if (!teachers.Any() || assistants.Count < 2)
        //        {
        //            throw new Exception("אין מספיק גננות או סייעות זמינות.");
        //        }

        //        // לולאה על כל תאריך מהיום ועד סוף השנה
        //        for (DateTime date = today; date <= endOfYear; date = date.AddDays(1))
        //        {
        //            // יצירת רשומה חדשה עבור הגננת
        //            db.UserInKindergartens.Add(new UserInKindergarten
        //            {
        //                ActivityDate = date,
        //                KindergartenNumber = kindergartenNumber,
        //                CurrentAcademicYear = today.Year,
        //                UserID = teachers.First().UserId
        //            });

        //            // יצירת רשומות חדשות עבור שתי הסייעות
        //            for (int i = 0; i < 2; i++)
        //            {
        //                db.UserInKindergartens.Add(new UserInKindergarten
        //                {
        //                    ActivityDate = date,
        //                    KindergartenNumber = kindergartenNumber,
        //                    CurrentAcademicYear = today.Year,
        //                    UserID = assistants[i].UserId
        //                });
        //            }
        //        }

        //        // שמירת השינויים בבסיס הנתונים
        //        db.SaveChanges();
        //    }
        //}



        //[HttpPost]
        //[Route("ReplaceStaffMember")]
        //public bool ReplaceStaffMember(DateTime date, string oldStaffId, string newStaffId)
        //{
        //    // חיפוש הרשומה של איש הצוות הישן בטבלת UserInKindergarten לפי התאריך ותעודת הזהות שלו
        //    var staffMemberRecord = db.UserInKindergartens
        //        .FirstOrDefault(uik => uik.ActivityDate == date && uik.UserID == oldStaffId);

        //    // אם הרשומה לא נמצאה, הפונקציה מחזירה false
        //    if (staffMemberRecord == null)
        //    {
        //        return false;
        //    }

        //    // חיפוש מידע על איש הצוות החדש בטבלת Users
        //    var newStaffMember = db.Users
        //        .FirstOrDefault(u => u.UserId == newStaffId);

        //    // אם איש הצוות החדש לא נמצא בטבלת Users, הפונקציה מחזירה false
        //    if (newStaffMember == null)
        //    {
        //        return false;
        //    }

        //    // עדכון הרשומה בטבלת UserInKindergarten עם הנתונים של איש הצוות החדש
        //    staffMemberRecord.UserID = newStaffMember.UserId;
        //    staffMemberRecord.CurrentAcademicYear = newStaffMember.CurrentAcademicYear;
        //    staffMemberRecord.KindergartenNumber = newStaffMember.KindergartenNumber;

        //    // שמירת השינויים בבסיס הנתונים
        //    db.UserInKindergartens.Update(staffMemberRecord);
        //    db.SaveChanges();

        //    return true;
        //}


    }
}
