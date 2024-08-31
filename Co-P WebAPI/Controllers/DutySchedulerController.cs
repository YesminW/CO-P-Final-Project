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

namespace Co_P_WebAPI.Controllers
{
    public class DutySchedulerController : Controller
    {
       

        private readonly DutyScheduler _dutyScheduler;

        CoPFinalProjectContext db = new CoPFinalProjectContext();
        public DutySchedulerController(DutyScheduler dutyScheduler)
        {
            _dutyScheduler = dutyScheduler;
        }

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
        [Route("dutiesByMonth")]
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
        [HttpPost("manual")]
        public async Task<IActionResult> RunManualScheduler([FromBody] SchedulerRequest request)
        {
            try
            {
                await _dutyScheduler.GenerateAndSaveManualDutyPairsAsync(request.Year, request.Month);
                return Ok("Scheduler ran successfully.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }

    public class SchedulerRequest
    {
        public int Year { get; set; }
        public int Month { get; set; }
    }


}



