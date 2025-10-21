using Aspire.Hosting.Azure;
using Aspire.Hosting.Yarp;
using Aspire.Hosting.Yarp.Transforms;
using Microsoft.Extensions.Hosting;
using Projects;

IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

IResourceBuilder<PostgresDatabaseResource> db = builder
    .AddPostgres("postgres")
    .AddDatabase("postgresdb");

IResourceBuilder<ProjectResource> migration = builder
    .AddProject<Edict_Migration>("migration")
    .WithReference(db)
    .WaitFor(db);

IResourceBuilder<ElasticsearchResource> elasticsearch = builder
    .AddElasticsearch("elasticsearch")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithDataVolume();

IResourceBuilder<ProjectResource> api = builder
    .AddProject<Edict_Api>("api")
    .WithReference(db)
    .WithReference(migration)
    .WithReference(elasticsearch)
    .WaitFor(db)
    .WaitForCompletion(migration)
    .WaitFor(elasticsearch);

IResourceBuilder<NodeAppResource> app = builder
    .AddYarnApp("app", "../app", "dev")
    .WithYarnPackageInstallation()
    .WithReference(api)
    .WaitFor(api)
    .WithHttpEndpoint(targetPort: 3000)
    .PublishAsDockerFile();

IResourceBuilder<YarpResource> gateway = builder.AddYarp("gateway")
    .WithConfiguration(yarp =>
    {
        yarp.AddRoute("/api/{**catch-all}", api)
            .WithTransformPathRemovePrefix("/api");
        yarp.AddRoute("/{**catch-all}", app);
    })
    .WithExternalHttpEndpoints();

if (builder.Environment.IsProduction())
{
    IResourceBuilder<AzureApplicationInsightsResource> insights = builder
        .AddAzureApplicationInsights("insights");

    api.WithReference(insights).WaitFor(insights);
    gateway.WithReference(insights).WaitFor(insights);
}

gateway.WithEnvironment("ASPNETCORE_ENVIRONMENT", builder.Environment.EnvironmentName);
api.WithEnvironment("ASPNETCORE_ENVIRONMENT", builder.Environment.EnvironmentName)
    .WithEnvironment("AUTH0_DOMAIN", builder.Configuration["Auth0:Domain"] ?? string.Empty)
    .WithEnvironment("AUTH0_AUDIENCE", builder.Configuration["Auth0:Audience"] ?? string.Empty);

migration.WithEnvironment("DOTNET_ENVIRONMENT", builder.Environment.EnvironmentName);

builder.Build().Run();