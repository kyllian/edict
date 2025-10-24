using System.Security.Claims;
using Edict.Application.Import;
using Edict.Application.Search;
using Edict.Domain;
using Edict.ServiceDefaults;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.AddServiceDefaults();

builder.Services.AddControllers();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = builder.Configuration["AUTH0_DOMAIN"];
        options.Audience = builder.Configuration["AUTH0_AUDIENCE"];
        options.TokenValidationParameters = new()
        {
            NameClaimType = ClaimTypes.NameIdentifier
        };

        if (builder.Environment.IsDevelopment())
        {
            options.RequireHttpsMetadata = false;
        }
    });

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
        .EnableDetailedErrors());

builder.AddElasticsearchClient("elasticsearch");

builder.Services.AddScoped<Importer>();
builder.Services.AddScoped<Indexer>();

WebApplication app = builder.Build();

app.MapOpenApi();
app.MapScalarApiReference(options =>
{
    options.WithOpenApiRoutePattern("/openapi/{documentName}.json");
});

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();