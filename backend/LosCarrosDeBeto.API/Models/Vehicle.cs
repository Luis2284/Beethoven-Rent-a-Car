using System.ComponentModel.DataAnnotations;

namespace LosCarrosDeBeto.API.Models
{
    public class Vehicle
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(10)]
        public string Plate { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Color { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Brand { get; set; } = string.Empty;

        [MaxLength(50)]
        public string Model { get; set; } = string.Empty;
        
        public int Year { get; set; }

        public string Description { get; set; } = string.Empty;
        
        public string? ImageUrl { get; set; } // Path to vehicle image

        [MaxLength(20)]
        public string Status { get; set; } = "Available"; // Available, Rented, Maintenance

        public int CurrentMileage { get; set; } = 0; // Tracks total mileage

        // Administrator / Owner
        public int? AdministratorId { get; set; }
        public Administrator? Administrator { get; set; }
    }
}
