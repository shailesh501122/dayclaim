using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Ascent.AR.Infrastructure.Persistence;

/// <summary>
/// Lets `dotnet ef migrations add/update-database` construct the DbContext
/// without spinning up the full web host (and its RabbitMQ/Redis/JWT
/// dependencies). Only used at design time; the running app gets its
/// DbContextOptions from DependencyInjection.AddInfrastructure instead.
/// </summary>
public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        var connectionString = Environment.GetEnvironmentVariable("ASCENT_AR_MIGRATIONS_CONNECTION")
            ?? "Host=localhost;Port=5432;Database=ascent_ar;Username=ascent_ar;Password=ascent_ar_dev_password";
        optionsBuilder.UseNpgsql(connectionString);
        return new AppDbContext(optionsBuilder.Options);
    }
}
