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
        [Route("Login")]
        public dynamic Login(string userid, string password)
        {
            var thisuser = db.Users.Where(u => u.UserId == userid && u.UserpPassword == password).FirstOrDefault();
            if (thisuser == null)
            {
                return "User not found";
            }
            return (new
            {
                thisuser.UserId,
                thisuser.UserCode,
                thisuser.KindergartenNumber

            });
        }

    }
}
