using Quartz;
using Quartz.Impl;

namespace Co_P_WebAPI.Schedulers
{
    public static class QuartzScheduler
    {
        public static async Task StartAsync(IServiceProvider serviceProvider)
        {
            IScheduler scheduler = await StdSchedulerFactory.GetDefaultScheduler();
            scheduler.JobFactory = new JobFactory(serviceProvider);
            await scheduler.Start();

            IJobDetail job = JobBuilder.Create<DutySchedulerJob>()
                .WithIdentity("dutySchedulerJob", "group1")
                .Build();

            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("monthlyTrigger", "group1")
                .StartNow()
                .WithSchedule(CronScheduleBuilder.MonthlyOnDayAndHourAndMinute(1, 0, 0))
                .Build();

            await scheduler.ScheduleJob(job, trigger);
        }
    }
}

