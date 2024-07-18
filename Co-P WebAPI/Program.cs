using Microsoft.EntityFrameworkCore;
using Co_P_WebAPI.Schedulers;
using CO_P_library.Services;
using Quartz;
using Quartz.Impl;
using Quartz.Spi;
using CO_P_library.Models;

namespace Co_P_WebAPI
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddCors(p => p.AddPolicy("corsapp", builder =>
            {
                builder.WithOrigins("*").AllowAnyMethod().AllowAnyHeader();
            }));

            // הוספת DbContext
            builder.Services.AddDbContext<CoPFinalProjectContext>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

            // הוספת Quartz.NET
            builder.Services.AddTransient<DutyScheduler>();
            builder.Services.AddTransient<DutySchedulerJob>();
            builder.Services.AddSingleton<IJobFactory, JobFactory>();
            builder.Services.AddHostedService<QuartzHostedService>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseAuthorization();

            app.UseCors("corsapp");
            app.MapControllers();

            app.Run();
        }
    }
}
