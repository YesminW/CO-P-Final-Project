using Quartz;
using System.Threading.Tasks;
using CO_P_library.Services;
public class DutySchedulerJob : IJob
{
    private readonly DutyScheduler _dutyScheduler;

    public DutySchedulerJob(DutyScheduler dutyScheduler)
    {
        _dutyScheduler = dutyScheduler;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        await _dutyScheduler.GenerateAndSaveMonthlyDutyPairsAsync();
    }
}
