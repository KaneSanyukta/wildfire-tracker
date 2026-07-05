using WildfireTracker.Api.Models;

namespace WildfireTracker.Api.Data;

public static class DbSeeder
{
    public static void Seed(AppDbContext context)
    {
        if (!context.Users.Any())
        {
            context.Users.Add(new User
            {
                Name = "System Admin",
                Email = "admin@wildfiretracker.io",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = UserRole.Admin,
                PreferredRegion = "California"
            });
        }

        if (!context.FireIncidents.Any())
        {
            context.FireIncidents.AddRange(
                new FireIncident
                {
                    LocationName = "Sierra Nevada Foothills, CA",
                    Latitude = 39.1612,
                    Longitude = -120.2560,
                    FireIntensity = 78,
                    RiskLevel = RiskLevel.Extreme,
                    Status = FireStatus.Active,
                    DetectedAt = DateTime.UtcNow.AddHours(-6),
                    Notes = "Fast-moving fire fueled by dry vegetation and high winds."
                },
                new FireIncident
                {
                    LocationName = "Willamette National Forest, OR",
                    Latitude = 44.1085,
                    Longitude = -122.1490,
                    FireIntensity = 52,
                    RiskLevel = RiskLevel.High,
                    Status = FireStatus.Active,
                    DetectedAt = DateTime.UtcNow.AddHours(-18),
                    Notes = "Crews actively building containment lines."
                },
                new FireIncident
                {
                    LocationName = "Sonoran Desert Edge, AZ",
                    Latitude = 33.4484,
                    Longitude = -112.0740,
                    FireIntensity = 24,
                    RiskLevel = RiskLevel.Moderate,
                    Status = FireStatus.Contained,
                    DetectedAt = DateTime.UtcNow.AddDays(-2),
                    Notes = "60% containment reached overnight."
                },
                new FireIncident
                {
                    LocationName = "Rocky Mountain Foothills, CO",
                    Latitude = 39.7392,
                    Longitude = -104.9903,
                    FireIntensity = 12,
                    RiskLevel = RiskLevel.Low,
                    Status = FireStatus.Controlled,
                    DetectedAt = DateTime.UtcNow.AddDays(-5),
                    Notes = "Minimal spread risk; monitoring only."
                },
                new FireIncident
                {
                    LocationName = "Angeles National Forest, CA",
                    Latitude = 34.2439,
                    Longitude = -118.0570,
                    FireIntensity = 91,
                    RiskLevel = RiskLevel.Extreme,
                    Status = FireStatus.Active,
                    DetectedAt = DateTime.UtcNow.AddHours(-2),
                    Notes = "Evacuation orders issued for nearby communities."
                }
            );
        }

        context.SaveChanges();
    }
}
