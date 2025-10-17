using Edict.Domain;
using Edict.Migration;
using Edict.ServiceDefaults;
using Microsoft.EntityFrameworkCore;

HostApplicationBuilder builder = Host.CreateApplicationBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddHostedService<Worker>();

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing => tracing.AddSource(Worker.ActivitySourceName));

builder.AddNpgsqlDbContext<EdictDbContext>(connectionName: "postgresdb", configureDbContextOptions: options =>
{
    options.UseSnakeCaseNamingConvention();
});

IHost host = builder.Build();
host.Run();