using System.ComponentModel.DataAnnotations;
using WildfireTracker.Api.Models;

namespace WildfireTracker.Api.DTOs;

public class FireIncidentResponse
{
    public int Id { get; set; }
    public string LocationName { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public double FireIntensity { get; set; }
    public RiskLevel RiskLevel { get; set; }
    public FireStatus Status { get; set; }
    public DateTime DetectedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public string? Notes { get; set; }
}

public class CreateFireIncidentRequest
{
    [Required, MaxLength(150)]
    public string LocationName { get; set; } = string.Empty;

    [Range(-90, 90)]
    public double Latitude { get; set; }

    [Range(-180, 180)]
    public double Longitude { get; set; }

    [Range(0, 100)]
    public double FireIntensity { get; set; }

    public RiskLevel RiskLevel { get; set; }

    public FireStatus Status { get; set; } = FireStatus.Active;

    public string? Notes { get; set; }
}

public class UpdateFireIncidentRequest
{
    [Required, MaxLength(150)]
    public string LocationName { get; set; } = string.Empty;

    [Range(-90, 90)]
    public double Latitude { get; set; }

    [Range(-180, 180)]
    public double Longitude { get; set; }

    [Range(0, 100)]
    public double FireIntensity { get; set; }

    public RiskLevel RiskLevel { get; set; }

    public FireStatus Status { get; set; }

    public string? Notes { get; set; }
}

public class FireQueryParams
{
    public string? Search { get; set; }
    public RiskLevel? RiskLevel { get; set; }
    public FireStatus? Status { get; set; }
}
