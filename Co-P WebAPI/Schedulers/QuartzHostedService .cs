using Microsoft.Extensions.Hosting;
using System.Threading;
using System.Threading.Tasks;
using Co_P_WebAPI.Schedulers;

namespace Co_P_WebAPI.Schedulers
{
    public class QuartzHostedService : IHostedService
    {
        private readonly IServiceProvider _serviceProvider;

        public QuartzHostedService(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            return QuartzScheduler.StartAsync(_serviceProvider);
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }
    }
}

