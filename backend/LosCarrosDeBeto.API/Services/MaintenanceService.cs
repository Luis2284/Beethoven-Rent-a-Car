using LosCarrosDeBeto.API.Data;
using LosCarrosDeBeto.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Services
{
    public class MaintenanceService : IMaintenanceService
    {
        private readonly ApplicationDbContext _context;

        public MaintenanceService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<MaintenanceConfig>> GetConfigsAsync()
        {
            return await _context.MaintenanceConfigs.ToListAsync();
        }

        public async Task<MaintenanceConfig> CreateConfigAsync(MaintenanceConfig config)
        {
            _context.MaintenanceConfigs.Add(config);
            await _context.SaveChangesAsync();
            return config;
        }

        public async Task<IEnumerable<object>> GetAllPendingMaintenancesAsync()
        {
            var vehicles = await _context.Vehicles.ToListAsync();
            var configs = await _context.MaintenanceConfigs.ToListAsync();
            var history = await _context.VehicleMaintenances.ToListAsync();

            var alerts = new List<object>();

            foreach (var vehicle in vehicles)
            {
                foreach (var config in configs)
                {
                    // Find last maintenance of this type for this vehicle
                    var lastMaint = history
                        .Where(m => m.VehicleId == vehicle.Id && m.MaintenanceConfigId == config.Id)
                        .OrderByDescending(m => m.MileageAtMaintenance)
                        .FirstOrDefault();

                    var lastKm = lastMaint?.MileageAtMaintenance ?? 0;
                    var nextDueKm = lastKm + config.IntervalMileage;
                    var remainingKm = nextDueKm - vehicle.CurrentMileage;

                    // If alert threshold reached or overdue
                    if (remainingKm <= config.AlertThresholdKm)
                    {
                        alerts.Add(new 
                        {
                            VehicleId = vehicle.Id,
                            Plate = vehicle.Plate,
                            Brand = vehicle.Brand,
                            Model = vehicle.Model,
                            MaintenanceType = config.Name,
                            LastPerformedKm = lastKm,
                            CurrentMileage = vehicle.CurrentMileage,
                            NextDueKm = nextDueKm,
                            RemainingKm = remainingKm,
                            Status = remainingKm < 0 ? "Overdue" : "Warning"
                        });
                    }
                }
            }

            return alerts;
        }

        public async Task<IEnumerable<object>> GetMaintenanceStatusAsync(int vehicleId)
        {
            var vehicle = await _context.Vehicles.FindAsync(vehicleId);
            if (vehicle == null) return new List<object>();

            var configs = await _context.MaintenanceConfigs.ToListAsync();
            var history = await _context.VehicleMaintenances
                .Where(m => m.VehicleId == vehicleId)
                .ToListAsync();

            var statusList = new List<object>();

            foreach (var config in configs)
            {
                var lastMaint = history
                    .Where(m => m.MaintenanceConfigId == config.Id)
                    .OrderByDescending(m => m.MileageAtMaintenance)
                    .FirstOrDefault();

                var lastKm = lastMaint?.MileageAtMaintenance ?? 0;
                var nextDueKm = lastKm + config.IntervalMileage;
                var remainingKm = nextDueKm - vehicle.CurrentMileage;

                string status = "OK";
                if (remainingKm < 0) status = "Overdue";
                else if (remainingKm <= config.AlertThresholdKm) status = "Warning";

                statusList.Add(new
                {
                    MaintenanceConfigId = config.Id,
                    MaintenanceName = config.Name,
                    LastPerformedDate = lastMaint?.DatePerformed,
                    LastPerformedKm = lastKm,
                    NextDueKm = nextDueKm,
                    RemainingKm = remainingKm,
                    Status = status
                });
            }

            return statusList;
        }

        public async Task<VehicleMaintenance> RegisterMaintenanceAsync(VehicleMaintenance maintenance)
        {
            _context.VehicleMaintenances.Add(maintenance);
            await _context.SaveChangesAsync();
            return maintenance;
        }
    }
}
