using Microsoft.EntityFrameworkCore;
using WildfireTracker.Api.Data;
using WildfireTracker.Api.DTOs;
using WildfireTracker.Api.Models;

namespace WildfireTracker.Api.Services;

public interface IFireIncidentService
{
    Task<List<FireIncidentResponse>> GetAllAsync(FireQueryParams query);
    Task<FireIncidentResponse?> GetByIdAsync(int id);
    Task<FireIncidentResponse> CreateAsync(CreateFireIncidentRequest request);
    Task<FireIncidentResponse?> UpdateAsync(int id, UpdateFireIncidentRequest request);
    Task<bool> DeleteAsync(int id);
}

public class FireIncidentService : IFireIncidentService
{
    private readonly AppDbContext _db;

    public FireIncidentService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<List<FireIncidentResponse>> GetAllAsync(FireQueryParams query)
    {
        var incidents = _db.FireIncidents.AsQueryable();

        if (!string.IsNullOrWhiteSpace(query.Search))
        {
            var term = query.Search.Trim().ToLower();
            incidents = incidents.Where(f => f.LocationName.ToLower().Contains(term));
        }

        if (query.RiskLevel.HasValue)
            incidents = incidents.Where(f => f.RiskLevel == query.RiskLevel.Value);

        if (query.Status.HasValue)
            incidents = incidents.Where(f => f.Status == query.Status.Value);

        var results = await incidents
            .OrderByDescending(f => f.DetectedAt)
            .ToListAsync();

        return results.Select(ToResponse).ToList();
    }

    public async Task<FireIncidentResponse?> GetByIdAsync(int id)
    {
        var incident = await _db.FireIncidents.FindAsync(id);
        return incident is null ? null : ToResponse(incident);
    }

    public async Task<FireIncidentResponse> CreateAsync(CreateFireIncidentRequest request)
    {
        var incident = new FireIncident
        {
            LocationName = request.LocationName,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            FireIntensity = request.FireIntensity,
            RiskLevel = request.RiskLevel,
            Status = request.Status,
            Notes = request.Notes,
            DetectedAt = DateTime.UtcNow
        };

        _db.FireIncidents.Add(incident);
        await _db.SaveChangesAsync();

        return ToResponse(incident);
    }

    public async Task<FireIncidentResponse?> UpdateAsync(int id, UpdateFireIncidentRequest request)
    {
        var incident = await _db.FireIncidents.FindAsync(id);
        if (incident is null) return null;

        incident.LocationName = request.LocationName;
        incident.Latitude = request.Latitude;
        incident.Longitude = request.Longitude;
        incident.FireIntensity = request.FireIntensity;
        incident.RiskLevel = request.RiskLevel;
        incident.Status = request.Status;
        incident.Notes = request.Notes;
        incident.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return ToResponse(incident);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var incident = await _db.FireIncidents.FindAsync(id);
        if (incident is null) return false;

        _db.FireIncidents.Remove(incident);
        await _db.SaveChangesAsync();
        return true;
    }

    private static FireIncidentResponse ToResponse(FireIncident f) => new()
    {
        Id = f.Id,
        LocationName = f.LocationName,
        Latitude = f.Latitude,
        Longitude = f.Longitude,
        FireIntensity = f.FireIntensity,
        RiskLevel = f.RiskLevel,
        Status = f.Status,
        DetectedAt = f.DetectedAt,
        UpdatedAt = f.UpdatedAt,
        Notes = f.Notes
    };
}
