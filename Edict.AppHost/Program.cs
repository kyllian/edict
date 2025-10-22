using Aspire.Hosting.Yarp;
using Aspire.Hosting.Yarp.Transforms;
using Projects;

IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

// builder.AddDockerComposeEnvironment("docker");

IResourceBuilder<PostgresDatabaseResource> db = builder
    .AddPostgres("postgres")
    .WithLifetime(ContainerLifetime.Persistent)
    // .WithDataVolume()
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

gateway.WithEnvironment("ASPNETCORE_ENVIRONMENT", builder.Configuration["ASPNETCORE_ENVIRONMENT"]);
api.WithEnvironment("ASPNETCORE_ENVIRONMENT", builder.Configuration["ASPNETCORE_ENVIRONMENT"])
    .WithEnvironment("AUTH0_DOMAIN", builder.Configuration["AUTH0_DOMAIN"] ?? string.Empty)
    .WithEnvironment("AUTH0_AUDIENCE", builder.Configuration["AUTH0_AUDIENCE"] ?? string.Empty);

migration.WithEnvironment("DOTNET_ENVIRONMENT", builder.Environment.EnvironmentName);

builder.Build().Run();