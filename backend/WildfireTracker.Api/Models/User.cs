using System.ComponentModel.DataAnnotations;

namespace WildfireTracker.Api.Models;

public enum UserRole
{
    User = 0,
    Admin = 1
}

public class User
{
    public int Id { get; set; }

    [Required, MaxLength(120)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.User;

    [MaxLength(120)]
    public string? PreferredRegion { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
