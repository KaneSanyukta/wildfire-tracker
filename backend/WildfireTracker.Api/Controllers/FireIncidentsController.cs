using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WildfireTracker.Api.DTOs;
using WildfireTracker.Api.Models;
using WildfireTracker.Api.Services;

namespace WildfireTracker.Api.Controllers;

[ApiController]
[Route("api/fires")]
public class FireIncidentsController : ControllerBase
{
    private readonly IFireIncidentService _fireService;

    public FireIncidentsController(IFireIncidentService fireService)
    {
        _fireService = fireService;
    }

    // Publicly viewable so anonymous visitors can see active risk data.
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search, [FromQuery] RiskLevel? riskLevel, [FromQuery] FireStatus? status)
    {
        var query = new FireQueryParams { Search = search, RiskLevel = riskLevel, Status = status };
        var results = await _fireService.GetAllAsync(query);
        return Ok(results);
    }

    [AllowAnonymous]
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _fireService.GetByIdAsync(id);
        return result is null ? NotFound(new { message = $"Fire incident {id} was not found." }) : Ok(result);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFireIncidentRequest request)
    {
        var created = await _fireService.CreateAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateFireIncidentRequest request)
    {
        var updated = await _fireService.UpdateAsync(id, request);
        return updated is null ? NotFound(new { message = $"Fire incident {id} was not found." }) : Ok(updated);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _fireService.DeleteAsync(id);
        return deleted ? NoContent() : NotFound(new { message = $"Fire incident {id} was not found." });
    }
}
