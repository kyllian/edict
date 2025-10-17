using Projects;
using Scalar.Aspire;

IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

IResourceBuilder<PostgresDatabaseResource> pg = builder
    .AddPostgres("postgres")
    .WithPgWeb(b =>
        b.WithLifetime(ContainerLifetime.Persistent))
    .WithLifetime(ContainerLifetime.Persistent)
    .WithDataVolume()
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
    .WaitFor(migration)
    .WaitFor(elasticsearch)
    .PublishAsDockerFile();

IResourceBuilder<ScalarResource> scalar = builder
    .AddScalarApiReference(options =>
    {
        options.WithProxyUrl("/scalar/scalar-proxy");
        options.WithCdnUrl("scalar/scalar.js");
    })
    .WithApiReference(api)
    .WithHttpEndpoint(targetPort: 5000, name: "scalar")
    .WaitFor(api)
    .PublishAsContainer();

IResourceBuilder<NodeAppResource> app = builder
    .AddNpmApp("app", "../app", "dev")
    .WithNpmPackageInstallation()
    .WithReference(api)
    .WaitFor(api)
    .WithHttpEndpoint(targetPort: 3000)
    .PublishAsDockerFile();

builder.AddProject<Edict_Gateway>("gateway")
    .WithReference(api)
    .WithReference(app)
    .WithReference(scalar)
    .WaitFor(api)
    .WaitFor(app)
    .WaitFor(scalar)
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.Build().Run();