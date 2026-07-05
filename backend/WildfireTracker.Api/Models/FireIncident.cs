using System.ComponentModel.DataAnnotations;

namespace WildfireTracker.Api.Models;

public enum RiskLevel
{
    Low = 0,
    Moderate = 1,
    High = 2,
    Extreme = 3
}

public enum FireStatus
{
    Active = 0,
    Contained = 1,
    Controlled = 2,
    Extinguished = 3
}

public class FireIncident
{
    public int Id { get; set; }

    [Required, MaxLength(150)]
    public string LocationName { get; set; } = string.Empty;

    [Range(-90, 90)]
    public double Latitude { get; set; }

    [Range(-180, 180)]
    public double Longitude { get; set; }

    [Range(0, 100)]
    public double FireIntensity { get; set; }

    public RiskLevel RiskLevel { get; set; } = RiskLevel.Low;

    public FireStatus Status { get; set; } = FireStatus.Active;

    public DateTime DetectedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}
