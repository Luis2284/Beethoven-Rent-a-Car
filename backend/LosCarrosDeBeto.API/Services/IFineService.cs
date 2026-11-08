using LosCarrosDeBeto.API.Models;

namespace LosCarrosDeBeto.API.Services
{
    public interface IFineService
    {
        Task<List<Fine>> GetFinesByVehicleAsync(int vehicleId);
        Task<Fine> RegisterFineAsync(Fine fine);
        Task<Fine?> MockCheckSimitAsync(string plate);
        Task PayFineAsync(int fineId);
    }
}
