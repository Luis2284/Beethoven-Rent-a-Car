using System.ComponentModel.DataAnnotations;

namespace LosCarrosDeBeto.API.Models
{
    public class Administrator
    {
        public int Id { get; set; }
        
        [Required]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        public string Document { get; set; } = string.Empty; // CC / NIT
        
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = "Becerril"; // Default
        
        [MaxLength(20)]
        public string LicenseNumber { get; set; } = string.Empty;

        // An administrator owns many vehicles
        // An administrator owns many vehicles
        public List<Vehicle> Vehicles { get; set; } = new List<Vehicle>();

        public string? DocumentUrl { get; set; }
    }
}
