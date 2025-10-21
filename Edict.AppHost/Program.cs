using Aspire.Hosting.Azure;
using Aspire.Hosting.Yarp;
using Aspire.Hosting.Yarp.Transforms;
using Microsoft.Extensions.Hosting;
using Projects;

IDistributedApplicationBuilder builder = DistributedApplication.CreateBuilder(args);

IResourceBuilder<PostgresDatabaseResource> pg = builder
    .AddPostgres("postgres")
    .WithPgWeb()
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
    migration.WithEnvironment("ASPNETCORE_ENVIRONMENT", "Production");
    api.WithEnvironment("ASPNETCORE_ENVIRONMENT", "Production");
    gateway.WithEnvironment("ASPNETCORE_ENVIRONMENT", "Production");
    migration.WithEnvironment("DOTNET_ENVIRONMENT", "Production");
    api.WithEnvironment("DOTNET_ENVIRONMENT", "Production");
    gateway.WithEnvironment("DOTNET_ENVIRONMENT", "Production");
    
    IResourceBuilder<ParameterResource> customDomain = builder.AddParameter("customDomain");
    IResourceBuilder<ParameterResource> certificateName = builder.AddParameter("certificateName");
    gateway.PublishAsAzureContainerApp((_, containerApp) => containerApp
        .ConfigureCustomDomain(customDomain, certificateName));
    
    IResourceBuilder<AzureApplicationInsightsResource> insights = builder
        .AddAzureApplicationInsights("insights");

    api.WithReference(insights)
        .WaitFor(insights);
    app.WithReference(insights)
        .WaitFor(insights);
    gateway.WithReference(insights)
        .WaitFor(insights);

}
#pragma warning restore ASPIREACADOMAINS001

builder.Build().Run();