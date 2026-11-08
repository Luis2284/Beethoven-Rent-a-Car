using LosCarrosDeBeto.API.Models;

namespace LosCarrosDeBeto.API.Services
{
    public interface IVehicleService
    {
        Task<IEnumerable<Vehicle>> GetAllVehiclesAsync();
        Task<Vehicle?> GetVehicleByIdAsync(int id);
        Task<Vehicle> CreateVehicleAsync(Vehicle vehicle);
        Task<Vehicle?> UpdateVehicleAsync(int id, Vehicle vehicle);
        Task<bool> DeleteVehicleAsync(int id);
        Task<VehicleHistoryDto?> GetVehicleHistoryAsync(int id, DateTime? startDate = null, DateTime? endDate = null);
    }

    public class VehicleHistoryDto
    {
        public Vehicle Vehicle { get; set; }
        public List<Rental> Rentals { get; set; }
        // We will add expenses (Maintenance, Fines, etc can be generalized as Expenses)
        // For now, assuming Expense model exists.
        public List<Expense> Expenses { get; set; } 
        
        public decimal TotalEarnings { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetBalance { get; set; }
        public int TotalTrips { get; set; }
    }
}
