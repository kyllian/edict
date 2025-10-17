using System.Diagnostics;
using Edict.Domain;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using OpenTelemetry.Trace;

namespace Edict.Migration;

public class Worker(ILogger<Worker> logger, IServiceProvider serviceProvider, IHostApplicationLifetime hostApplicationLifetime) : BackgroundService
{
    public const string ActivitySourceName = "Migrations";
    private static readonly ActivitySource ActivitySource = new(ActivitySourceName);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using Activity? activity = ActivitySource.StartActivity(ActivityKind.Client);

        try
        {
            using IServiceScope scope = serviceProvider.CreateScope();
            EdictDbContext dbContext = scope.ServiceProvider.GetRequiredService<EdictDbContext>();
            await RunMigrationAsync(dbContext, stoppingToken);
        }
        catch (Exception ex)
        {
            activity?.RecordException(ex);
            throw;
        }

        hostApplicationLifetime.StopApplication();
    }

    private static async Task RunMigrationAsync(EdictDbContext context, CancellationToken cancellationToken)
    {
        IExecutionStrategy strategy = context.Database.CreateExecutionStrategy();
        // await strategy.ExecuteAsync(async () =>
        // {
        //     // Run migration in a transaction to avoid partial migration if it fails.
        //     await context.Database.EnsureCreatedAsync(cancellationToken);
        // });

        await strategy.ExecuteAsync(async () =>
        {
            // Run migration in a transaction to avoid partial migration if it fails.
            await context.Database.MigrateAsync(cancellationToken);
        });
    }
}