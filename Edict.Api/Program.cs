using Edict.Application;
using Edict.Application.Import;
using Edict.Application.Search;
using Edict.Domain;
using Edict.ServiceDefaults;
using Microsoft.EntityFrameworkCore;
using OpenAI;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.AddServiceDefaults();

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.AddNpgsqlDbContext<EdictDbContext>(connectionName: "postgresdb", configureDbContextOptions: options =>
    options.UseSnakeCaseNamingConvention()
        .EnableDetailedErrors()
        .EnableSensitiveDataLogging());

builder.AddElasticsearchClient("elasticsearch");

builder.Services.AddScoped<Importer>();
builder.Services.AddScoped<Indexer>();

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();