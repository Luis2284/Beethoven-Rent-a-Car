using System.ComponentModel.DataAnnotations;

namespace LosCarrosDeBeto.API.Models
{
    public class MaintenanceConfig
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty; // e.g., "Cambio de Aceite"

        public int IntervalMileage { get; set; } // e.g., 5000 (Repeat every 5000km)
        
        public int AlertThresholdKm { get; set; } = 500; // Warn when 500km remaining
    }
}
