using Aspire.Hosting.Yarp;
using Aspire.Hosting.Yarp.Transforms;
using Microsoft.Extensions.Hosting;
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

IResourceBuilder<YarpResource>? gateway = builder.AddYarp("gateway")
    .WithConfiguration(yarp =>
    {
        yarp.AddRoute("/api/{**catch-all}", api)
            .WithTransformPathRemovePrefix("/api");
        yarp.AddRoute("/{**catch-all}", app);
    })
    .WithExternalHttpEndpoints();

#pragma warning disable ASPIREACADOMAINS001
if (builder.Environment.IsProduction())
{
    // Set ASPNETCORE_ENVIRONMENT to Production for all .NET projects
    // api.WithEnvironment("ASPNETCORE_ENVIRONMENT", "Production");
    // migration.WithEnvironment("ASPNETCORE_ENVIRONMENT", "Production");
    
    IResourceBuilder<ParameterResource> customDomain = builder.AddParameter("customDomain");
    IResourceBuilder<ParameterResource> certificateName = builder.AddParameter("certificateName");
    gateway.PublishAsAzureContainerApp((_, containerApp) => containerApp
        .ConfigureCustomDomain(customDomain, certificateName));
}
#pragma warning restore ASPIREACADOMAINS001

builder.Build().Run();