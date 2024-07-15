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
        public dynamic LogIn(string ID, string password)
        {
            List<User> users = db.Users.ToList();
            if (users == null)
            {
                return ("login faild");
            }
            for (int i = 0; i < users.Count(); i++)
            {
                if (users[i].UserId == ID && users[i].UserpPassword == password)
                {
                    return new { user_id = users[i].UserId };
                }

            }
            return BadRequest("login faild");
        }

    }
}
