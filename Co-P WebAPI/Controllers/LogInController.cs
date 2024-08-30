using CO_P_library.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Co_P_WebAPI.Controllers
{
    [EnableCors()]
    public class LogInController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("LogIn/{ID}/{password}")]
        public IActionResult LogIn(string ID, string password)
        {
            // חיפוש המשתמש על בסיס ID והסיסמה
            var user = db.Users.FirstOrDefault(u => u.UserId == ID && u.UserpPassword == password);

            if (user == null)
            {
                return BadRequest("Login failed");
            }

            // החזרת פרטי המשתמש, וודא שאת מטפלת בערכים שעשויים להיות null
            return Ok(new
            {
                user_id = user.UserId,
                user_code = user.UserCode,
                kindergarten_number = user.KindergartenNumber
            });
        }
    }
}
