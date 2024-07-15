using CO_P_library.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace Co_P_WebAPI.Controllers
{
    [EnableCors()]
    public class DutyController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("setChildForDuty")]
        public dynamic SetDuty(int year, int month, string KindergartenName, int KindergartenNumber)
        {

            IEnumerable<Child> children = db.Children.Where(c => c.KindergartenName == KindergartenName).Select(x => new Child()
            {
                ChildFirstName = x.ChildFirstName,
                ChildSurname = x.ChildSurname,
            }).ToList();

            var dates = new List<DateTime>();
            for (var date = new DateTime(year, month, 1); date.Month == month; date = date.AddDays(1))
            {
                dates.Add(date);
            }
            Random random = new Random();
            List<Duty> duties = new List<Duty>();

            for (int i = 0; i < dates.Count(); i++)
            {
                for (int j = 0; j < children.Count(); j++)
                {
                    var RandomChild1 = children.ElementAt(random.Next(children.Count()));
                    var firstName1 = RandomChild1.ChildFirstName + " " + RandomChild1.ChildSurname;
                    List<Child> otherChildren = children.Where(c => c != RandomChild1).ToList();
                    var randomChild2 = otherChildren.ElementAt(random.Next(otherChildren.Count));
                    var firstName2 = randomChild2.ChildFirstName + " " + randomChild2.ChildSurname;

                    Duty d = new Duty
                    {
                        DutyDate = dates[i],
                        Child1 = firstName1,
                        Child2 = firstName2,
                        CurrentAcademicYear = dates[i].Year,
                        KindergartenNumber = KindergartenNumber
                    };
                    duties.Add(d);
                }
            }


            db.Duties.AddRange(duties);
            db.SaveChanges();
            return ("Duties is save");

        }

    }
}
