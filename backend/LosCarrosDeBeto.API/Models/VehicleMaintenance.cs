using System.ComponentModel.DataAnnotations;

namespace LosCarrosDeBeto.API.Models
{
    public class VehicleMaintenance
    {
        public int Id { get; set; }

        public int VehicleId { get; set; }
        public Vehicle? Vehicle { get; set; }

        public int MaintenanceConfigId { get; set; }
        public MaintenanceConfig? MaintenanceConfig { get; set; }

        public DateTime DatePerformed { get; set; }
        
        public int MileageAtMaintenance { get; set; } // Odometer reading when performed

        [MaxLength(500)]
        public string Notes { get; set; } = string.Empty;
    }
}
