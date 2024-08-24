using CO_P_library.Models;
using Co_P_WebAPI.DTO;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

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

    }
}
