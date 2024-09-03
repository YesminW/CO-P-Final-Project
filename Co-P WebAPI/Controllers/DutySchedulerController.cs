using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CO_P_library.Models;
using Microsoft.AspNetCore.Mvc;
using Co_P_WebAPI.DTO;

namespace Co_P_WebAPI.Controllers
{
    public class DutySchedulerController : Controller
    {
        private readonly CoPFinalProjectContext db = new CoPFinalProjectContext();

        [HttpGet]
        [Route("getdutyList/{kinderNumber}")]
        public async Task<ActionResult> GetDutyList(int kinderNumber)
        {
            try
            {
                var dutyList = await db.Duties
                    .Where(d => d.KindergartenNumber == kinderNumber)
                    .Select(dl => new
                    {
                        Child1Id = dl.Child1,
                        Child1Name = dl.Child1Navigation.ChildFirstName + " " + dl.Child1Navigation.ChildSurname,
                        Child2Id = dl.Child2,
                        Child2Name = dl.Child2Navigation.ChildFirstName + " " + dl.Child2Navigation.ChildSurname
                    })
                    .ToListAsync();

                return Ok(dutyList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("Whosondutytoday/{kindergartenNumber}/{today}")]
        public async Task<ActionResult<IEnumerable<DutyChildrenDTO>>> Whosondutytoday(int kindergartenNumber, DateTime today)
        {
            try
            {
                var dutyChildren = await db.Duties
                    .Where(d => d.KindergartenNumber == kindergartenNumber && d.DutyDate == today)
                    .Select(dd => new DutyChildrenDTO
                    {
                        ChildId1 = dd.Child1,
                        Child1Name = dd.Child1Navigation.ChildFirstName + " " + dd.Child1Navigation.ChildSurname,
                        ChildId2 = dd.Child2,
                        Child2Name = dd.Child2Navigation.ChildFirstName + " " + dd.Child2Navigation.ChildSurname
                    })
                    .ToListAsync();

                return Ok(dutyChildren[0]);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("allDuties")]
        public async Task<ActionResult<IEnumerable<DutyChildrenDTO>>> GetAllDuties()
        {
            try
            {
                var duties = await db.Duties
                    .Include(d => d.Child1Navigation)
                    .Include(d => d.Child2Navigation)
                    .ToListAsync();

                var result = duties.Select(d => new DutyChildrenDTO
                {
                    ChildId1 = d.Child1,
                    Child1Name = d.Child1Navigation.ChildFirstName + " " + d.Child1Navigation.ChildSurname,
                    ChildId2 = d.Child2,
                    Child2Name = d.Child2Navigation.ChildFirstName + " " + d.Child2Navigation.ChildSurname
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet]
        [Route("dutiesByMonth/{year}/{month}")]
        public async Task<ActionResult<IEnumerable<DutyChildrenDTO>>> GetDutiesByMonth(int year, int month)
        {
            try
            {
                var duties = await db.Duties
                    .Where(d => d.DutyDate.Year == year && d.DutyDate.Month == month)
                    .Include(d => d.Child1Navigation)
                    .Include(d => d.Child2Navigation)
                    .ToListAsync();

                var result = duties.Select(d => new DutyChildrenDTO
                {
                    ChildId1 = d.Child1,
                    Child1Name = d.Child1Navigation.ChildFirstName + " " + d.Child1Navigation.ChildSurname,
                    ChildId2 = d.Child2,
                    Child2Name = d.Child2Navigation.ChildFirstName + " " + d.Child2Navigation.ChildSurname
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpPost("manual/{Schedulerdate}/{kindergartenNumber}")]
        public async Task<IActionResult> RunManualScheduler(DateTime Schedulerdate, int kindergartenNumber)
        {
            try
            {
                int year = Schedulerdate.Year;
                int month = Schedulerdate.Month;

                using (var context = new CoPFinalProjectContext())
                {
                    var lastDuty = await context.Duties
                        .Where(d => d.KindergartenNumber == kindergartenNumber)
                        .OrderByDescending(d => d.DutyDate)
                        .AsNoTracking()
                        .FirstOrDefaultAsync();

                    var startDate = lastDuty?.DutyDate.AddDays(1) ?? new DateTime(year, month, 1);

                    if (startDate < DateTime.Now)
                    {
                        startDate = DateTime.Now;
                    }

                    var remainingDays = Enumerable.Range(startDate.Day, DateTime.DaysInMonth(year, month) - startDate.Day + 1)
                                                  .Select(day => new DateTime(year, month, day)).ToList();

                    var children = await context.Children
                        .Where(c => c.kindergartenNumber == kindergartenNumber)
                        .AsNoTracking()
                        .ToListAsync();

                    if (children.Count < 2)
                    {
                        return BadRequest("Not enough children to create duty pairs.");
                    }

                    int childCount = children.Count;
                    for (int i = 0; i < remainingDays.Count; i++)
                    {
                        // בכל יום, נבחר זוג ילדים מהגן לפי מחזור (עם חישוב מודולרי)
                        var child1 = children[i % childCount];
                        var child2 = children[(i + 1) % childCount];

                        using (var insertContext = new CoPFinalProjectContext())
                        {
                            var existingDuty = await insertContext.Duties
                                .FirstOrDefaultAsync(d => d.DutyDate == remainingDays[i] && d.KindergartenNumber == kindergartenNumber);

                            if (existingDuty == null)
                            {
                                var duty = new Duty
                                {
                                    DutyDate = remainingDays[i],
                                    Child1 = child1.ChildId,
                                    Child2 = child2.ChildId,
                                    CurrentAcademicYear = child1.CurrentAcademicYear,
                                    KindergartenNumber = kindergartenNumber
                                };

                                insertContext.Duties.Add(duty);
                                await insertContext.SaveChangesAsync();
                            }
                        }
                    }
                }

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
