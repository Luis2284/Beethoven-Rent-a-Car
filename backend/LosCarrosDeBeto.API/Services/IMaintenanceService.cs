using LosCarrosDeBeto.API.Models;

namespace LosCarrosDeBeto.API.Services
{
    public interface IMaintenanceService
    {
        Task<IEnumerable<MaintenanceConfig>> GetConfigsAsync();
        Task<MaintenanceConfig> CreateConfigAsync(MaintenanceConfig config);
        
        // Returns DTOs or objects with alert info
        Task<IEnumerable<object>> GetMaintenanceStatusAsync(int vehicleId);
        Task<IEnumerable<object>> GetAllPendingMaintenancesAsync();

        Task<VehicleMaintenance> RegisterMaintenanceAsync(VehicleMaintenance maintenance);
    }
}
