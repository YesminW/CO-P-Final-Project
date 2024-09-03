using CO_P_library.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Co_P_WebAPI.Controllers
{
    public class BirthdayController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("current-month-birthdays")]
        public IActionResult GetCurrentMonthBirthdays()
        {
            var currentMonth = DateTime.Now.Month;
            var currentYear = DateTime.Now.Year;

            var birthdays = db.Children
                .Where(child => child.ChildBirthDate.Month == currentMonth)
                .OrderBy(child => child.ChildBirthDate.Day)
                .Select(child => new
                {
                    FullName = $"{child.ChildFirstName} {child.ChildSurname}",
                    PhotoName = child.ChildPhotoName,
                    BirthDate = child.ChildBirthDate.ToString("yyyy-MM-dd"),
                    childId = child.ChildId
                })
                .ToList();

            return Ok(birthdays);
        }

        [HttpGet]
        [Route("WhosCelebratingToday/{kindergartenNumber}/{today}")]
        public dynamic WhosCelebratingToday (int kindergartenNumber, DateTime today)
        {
            var celebratingChild = db.Children.Where(cc => cc.ChildBirthDate.Month == today.Month && cc.ChildBirthDate.Day == today.Day && cc.kindergartenNumber == kindergartenNumber).Select(x => new
            {
                ChildFirstName = x.ChildFirstName + " " + x.ChildSurname,
                ChildId = x.ChildId

            }).ToList();

            return Ok(celebratingChild);
        }


    }
}
