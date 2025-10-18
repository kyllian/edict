using Aspire.Hosting.Yarp.Transforms;
using Projects;
using Scalar.Aspire;

IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

IResourceBuilder<PostgresDatabaseResource> pg = builder
    .AddPostgres("postgres")
    .WithLifetime(ContainerLifetime.Persistent)
    .AddDatabase("postgresdb");

IResourceBuilder<ProjectResource> migration = builder
    .AddProject<Edict_Migration>("migration")
    .WithReference(pg)
    .WaitFor(pg);

IResourceBuilder<ElasticsearchResource> elasticsearch = builder
    .AddElasticsearch("elasticsearch")
    .WithLifetime(ContainerLifetime.Persistent)
    .WithDataVolume();

IResourceBuilder<ProjectResource> api = builder
    .AddProject<Edict_Api>("api")
    .WithReference(pg)
    .WithReference(migration)
    .WithReference(elasticsearch)
    .WaitFor(pg)
    .WaitForCompletion(migration)
    .WaitFor(elasticsearch);

IResourceBuilder<NodeAppResource> app = builder
    .AddYarnApp("app", "../app", "dev")
    .WithYarnPackageInstallation()
    .WithReference(api)
    .WaitFor(api)
    .WithHttpEndpoint(targetPort: 3000)
    .PublishAsDockerFile();

// builder.AddProject<Edict_Gateway>("gateway")
//     .WithReference(api)
//     .WithReference(app)
//     .WithReference(scalar)
//     .WaitFor(api)
//     .WaitFor(app)
//     .WaitFor(scalar)
//     .WithExternalHttpEndpoints();

builder.AddYarp("gateway")
    .WithConfiguration(yarp =>
    {
        yarp.AddRoute("/api/{**catch-all}", api)
            .WithTransformPathRemovePrefix("/api");
        yarp.AddRoute("/{**catch-all}", app);
    })
    .WithExternalHttpEndpoints();

builder.Build().Run();