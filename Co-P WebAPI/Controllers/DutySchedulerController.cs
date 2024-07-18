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


namespace Co_P_WebAPI.Controllers
{
    public class DutySchedulerController : Controller
    {
        CoPFinalProjectContext db = new CoPFinalProjectContext();

        private readonly DutyScheduler _dutyScheduler;

        public DutySchedulerController(DutyScheduler dutyScheduler)
        {
            _dutyScheduler = dutyScheduler;
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



