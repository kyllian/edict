using Aspire.Hosting.Yarp;
using Aspire.Hosting.Yarp.Transforms;
using Microsoft.Extensions.Hosting;
using Projects;

IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

// builder.AddDockerComposeEnvironment("docker");

IResourceBuilder<PostgresServerResource> pgServer = builder
    .AddPostgres("postgres")
    .WithLifetime(ContainerLifetime.Persistent);

if (builder.Environment.IsDevelopment())
{
    pgServer.WithDataVolume();
}

IResourceBuilder<PostgresDatabaseResource> db = pgServer
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
    .AddYarnApp("app", "../app")
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

gateway.WithEnvironment("ASPNETCORE_ENVIRONMENT", builder.Configuration["ASPNETCORE_ENVIRONMENT"]);
api.WithEnvironment("ASPNETCORE_ENVIRONMENT", builder.Configuration["ASPNETCORE_ENVIRONMENT"])
    .WithEnvironment("AUTH0_DOMAIN", builder.Configuration["AUTH0_DOMAIN"])
    .WithEnvironment("AUTH0_AUDIENCE", builder.Configuration["AUTH0_AUDIENCE"]);
app.WithEnvironment("NEXT_PUBLIC_BASE_URL", builder.Configuration["NEXT_PUBLIC_BASE_URL"]);
migration.WithEnvironment("DOTNET_ENVIRONMENT", builder.Environment.EnvironmentName);

builder.Build().Run();