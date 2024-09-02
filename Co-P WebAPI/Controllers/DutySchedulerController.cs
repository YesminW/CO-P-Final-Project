using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CO_P_library.Models;
using Microsoft.AspNetCore.Mvc;
using CO_P_library.Services;
using System;
using System.Threading.Tasks;
using Co_P_WebAPI.DTO;
using System.Linq;


namespace Co_P_WebAPI.Controllers
{
    public class DutySchedulerController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("getdutyList/{kinderNumber}")]

        public async Task<ActionResult<IEnumerable<Duty>>> GetDutyList(int kinderNumber)
        {
            try
            {

                var dutyList = await db.Duties.Where(d => d.KindergartenNumber == kinderNumber).ToListAsync();
                return Ok(dutyList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("Whosondutytoday/{kindergartenNumber}/{today}")]
        public async Task<ActionResult<IEnumerable<Duty>>> Whosondutytoday(int kindergartenNumber, DateTime today)
        {
            var dutyChildren = await db.Duties.Where(d => d.KindergartenNumber == kindergartenNumber && d.DutyDate == today).ToListAsync();
            return Ok(dutyChildren);

        }

        [HttpGet]
        [Route("allDuties")]
        public async Task<ActionResult<IEnumerable<DutyChildInfoDTO>>> GetAllDuties()
        {
            try
            {
                var duties = await db.Duties
                    .Include(d => d.Child1Navigation)
                    .Include(d => d.Child2Navigation)
                    .ToListAsync();

                var result = duties.Select(d => new DutyChildInfoDTO
                {
                    Date = d.DutyDate,
                    Child1Name = d.Child1Navigation.ChildFirstName + " " + d.Child1Navigation.ChildSurname,
                    Child2Name = d.Child2Navigation.ChildFirstName + " " + d.Child2Navigation.ChildSurname
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
        [HttpGet]
        [Route("dutiesByMonth/{year}/{month}")]
        public async Task<ActionResult<IEnumerable<DutyChildInfoDTO>>> GetDutiesByMonth(int year, int month)
        {
            try
            {
                var duties = await db.Duties
                    .Where(d => d.DutyDate.Year == year && d.DutyDate.Month == month)
                    .Include(d => d.Child1Navigation)
                    .Include(d => d.Child2Navigation)
                    .ToListAsync();

                var result = duties.Select(d => new DutyChildInfoDTO
                {
                    Date = d.DutyDate,
                    Child1Name = d.Child1Navigation.ChildFirstName + " " + d.Child1Navigation.ChildSurname,
                    Child2Name = d.Child2Navigation.ChildFirstName + " " + d.Child2Navigation.ChildSurname
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost]
        [Route("manual/{Schedulerdate}/{kindergartenNumber}")]
       
        public async Task<IActionResult> RunManualScheduler(DateTime Schedulerdate, int kindergartenNumber)
        {
            try
            {
                int year = Schedulerdate.Year;
                int month = Schedulerdate.Month;

                var lastDuty = await db.Duties
                    .Where(d => d.DutyDate.Year == year && d.DutyDate.Month == month && d.KindergartenNumber == kindergartenNumber)
                    .OrderByDescending(d => d.DutyDate)
                    .FirstOrDefaultAsync();

                var startDate = lastDuty?.DutyDate.AddDays(1) ?? new DateTime(year, month, 1);

                if (startDate < DateTime.Now)
                {
                    startDate = DateTime.Now;
                }

                var remainingDays = Enumerable.Range(startDate.Day, DateTime.DaysInMonth(year, month) - startDate.Day + 1)
                                              .Select(day => new DateTime(year, month, day)).ToList();

                var children = await db.Children.Where(c => c.kindergartenNumber == kindergartenNumber).ToListAsync();

                List<(DateTime, Child, Child)> dutyPairs = GenerateDutyPairsForRemainingDays(children, remainingDays);

                foreach (var (dutyDate, child1, child2) in dutyPairs)
                {
                    var existingDuty = await db.Duties
                        .AsNoTracking()
                        .FirstOrDefaultAsync(d => d.DutyDate == dutyDate && d.KindergartenNumber == kindergartenNumber);

                    if (existingDuty != null)
                    {
                        db.Entry(existingDuty).State = EntityState.Detached;
                    }

                    var duty = new Duty
                    {
                        DutyDate = dutyDate,
                        Child1 = child1.ChildId,
                        Child2 = child2.ChildId,
                        CurrentAcademicYear = child1.CurrentAcademicYear,
                        KindergartenNumber = kindergartenNumber
                    };

                    db.Duties.Add(duty);
                }

                await db.SaveChangesAsync();

                return Ok("Scheduler ran successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        private List<(DateTime, Child, Child)> GenerateDutyPairsForRemainingDays(List<Child> children, List<DateTime> remainingDays)
        {
            List<(DateTime, Child, Child)> dutyPairs = new List<(DateTime, Child, Child)>();
            Random random = new Random();

            // Group children by Kindergarten
            var childrenByKindergarten = children.GroupBy(c => c.kindergartenNumber);

            foreach (var group in childrenByKindergarten)
            {
                var kindergartenChildren = group.ToList();

                // Shuffle the children list
                var shuffledChildren = kindergartenChildren.OrderBy(x => random.Next()).ToList();

                foreach (var dutyDate in remainingDays)
                {
                    int childCount = shuffledChildren.Count;

                    for (int i = 0; i < childCount; i += 2)
                    {
                        if (i + 1 < childCount)
                        {
                            dutyPairs.Add((dutyDate, shuffledChildren[i], shuffledChildren[i + 1]));
                        }
                        else
                        {
                            // If there is an odd number of children, pair the last one with the first one
                            dutyPairs.Add((dutyDate, shuffledChildren[i], shuffledChildren[0]));
                        }
                    }

                    // Shuffle again for next day to ensure different pairs each day
                    shuffledChildren = shuffledChildren.OrderBy(x => random.Next()).ToList();
                }
            }

            return dutyPairs;
        }
    }

    public class SchedulerRequest
    {
        public int Year { get; set; }
        public int Month { get; set; }
    }


}



