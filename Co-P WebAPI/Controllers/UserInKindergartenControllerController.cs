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

        [HttpGet]
        [Route("GetStaffofKindergarten/{kindergartenNumber}")]
        public dynamic GetStaffofKindergarten(int kindergartenNumber)
        {
            var staff = db.UserInKindergartens.Where(s => s.KindergartenNumber == kindergartenNumber).Select(ss => new UserInKindergarten()
            {
                TeacherID = ss.TeacherID,
                Assistant1ID = ss.Assistant1ID,
                Assistant2ID = ss.Assistant2ID 

            });

            return staff;

        }

        [HttpPut]
        [Route("AssignStaffToDates/{kindergartenNumber}")]

        public void AssignStaffToDates(int kindergartenNumber)
        {
            // קבל את תאריך היום
            DateTime today = DateTime.Today;

            // קבל את התאריך האחרון של השנה הנוכחית
            DateTime endOfYear = new DateTime(today.Year, 12, 31);

            // שליפת משתמשים עם UserCode 111 (גננת) ו-333 (סייעות) עבור הגן הנבחר
            var teachers = db.Users
                .Where(u => u.UserCode == 111 && u.KindergartenNumber == kindergartenNumber)
                .ToList();

            var assistants = db.Users
                .Where(u => u.UserCode == 333 && u.KindergartenNumber == kindergartenNumber)
                .ToList();

            // בדיקת האם יש מספיק גננות וסייעות
            if (!teachers.Any() || assistants.Count < 2)
            {
                throw new Exception("אין מספיק גננות או סייעות זמינות.");
            }

            // לולאה על כל תאריך מהיום ועד סוף השנה
            for (DateTime date = today; date <= endOfYear; date = date.AddDays(1))
            {
                // יצירת רשומה חדשה עבור הגננת ושתי הסייעות
                db.UserInKindergartens.Add(new UserInKindergarten
                {
                    ActivityDate = date,
                    KindergartenNumber = kindergartenNumber,
                    CurrentAcademicYear = today.Year,
                    TeacherID = teachers.First().UserId,
                    Assistant1ID = assistants[0].UserId,
                    Assistant2ID = assistants[1].UserId
                });
            }

            // שמירת השינויים בבסיס הנתונים
            db.SaveChanges();

        }

        [HttpPut]
        [Route("SwapAssistantsForDate/{date}/{date}/{currentAssistantId}/{newAssistantId}")]
        public IActionResult SwapAssistantsForDate(DateTime date, string currentAssistantId, string newAssistantId)
        {
            // בדיקה שהסייעת החדשה אינה זהה לסייעת הקיימת
            if (currentAssistantId == newAssistantId)
            {
                return BadRequest("תעודת הזהות של הסייעת החדשה זהה לזו של הסייעת הקיימת.");
            }

            // חיפוש הרשומה המתאימה לפי התאריך ות"ז של הסייעת הקיימת
            var userInKindergarten = db.UserInKindergartens
                .Where(uik => uik.ActivityDate == date &&
                              (uik.Assistant1ID == currentAssistantId || uik.Assistant2ID == currentAssistantId))
                .FirstOrDefault();

            if (userInKindergarten == null)
            {
                return NotFound("הרשומה לא נמצאה עבור התאריך והסייעת שנבחרו.");
            }

            // החלפת הסייעת הקיימת בסייעת החדשה, אם נדרשת החלפה
            bool isUpdated = false;
            if (userInKindergarten.Assistant1ID == currentAssistantId)
            {
                userInKindergarten.Assistant1ID = newAssistantId;
                isUpdated = true;
            }
            else if (userInKindergarten.Assistant2ID == currentAssistantId)
            {
                userInKindergarten.Assistant2ID = newAssistantId;
                isUpdated = true;
            }

            if (!isUpdated)
            {
                return BadRequest("הסייעת החדשה זהה לסייעת הקיימת, אין צורך בהחלפה.");
            }

            try
            {
                // שמירת השינויים בבסיס הנתונים
                db.SaveChanges();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "שגיאה בעת שמירת השינויים: " + ex.Message);
            }

            return Ok("ההחלפה בוצעה בהצלחה.");
        }




    }
}
