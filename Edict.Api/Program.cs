using Edict.Application.Import;
using Edict.Application.Search;
using Edict.Domain;
using Edict.ServiceDefaults;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.AddServiceDefaults();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, _, _) =>
    {
        document.Servers = [new() { Url = "/api" }];
        return Task.CompletedTask;
    });
});

builder.AddNpgsqlDbContext<EdictDbContext>(connectionName: "postgresdb", configureDbContextOptions: options =>
    options.UseSnakeCaseNamingConvention()
        .EnableDetailedErrors()
        .EnableSensitiveDataLogging());

builder.AddElasticsearchClient("elasticsearch");

builder.Services.AddScoped<Importer>();
builder.Services.AddScoped<Indexer>();

WebApplication app = builder.Build();

// app.UsePathBase("/api");

app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.WithOpenApiRoutePattern("/openapi/{documentName}.json");
});

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();