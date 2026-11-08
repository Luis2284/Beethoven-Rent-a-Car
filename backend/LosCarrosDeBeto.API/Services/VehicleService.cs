using LosCarrosDeBeto.API.Data;
using LosCarrosDeBeto.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Services
{
    public class VehicleService : IVehicleService
    {
        private readonly ApplicationDbContext _context;

        public VehicleService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Vehicle>> GetAllVehiclesAsync()
        {
            return await _context.Vehicles.Include(v => v.Administrator).ToListAsync();
        }

        public async Task<Vehicle?> GetVehicleByIdAsync(int id)
        {
            return await _context.Vehicles.Include(v => v.Administrator).FirstOrDefaultAsync(v => v.Id == id);
        }

        public async Task<Vehicle> CreateVehicleAsync(Vehicle vehicle)
        {
            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
            return vehicle;
        }

        public async Task<Vehicle?> UpdateVehicleAsync(int id, Vehicle vehicle)
        {
            var existingVehicle = await _context.Vehicles.FindAsync(id);
            if (existingVehicle == null)
            {
                return null;
            }

            existingVehicle.Plate = vehicle.Plate;
            existingVehicle.Color = vehicle.Color;
            existingVehicle.Brand = vehicle.Brand;
            existingVehicle.Model = vehicle.Model;
            existingVehicle.Year = vehicle.Year;
            existingVehicle.Description = vehicle.Description;
            existingVehicle.ImageUrl = vehicle.ImageUrl;
            existingVehicle.CurrentMileage = vehicle.CurrentMileage;
            existingVehicle.AdministratorId = vehicle.AdministratorId;

            await _context.SaveChangesAsync();
            return existingVehicle;
        }

        public async Task<bool> DeleteVehicleAsync(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null)
            {
                return false;
            }

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<VehicleHistoryDto?> GetVehicleHistoryAsync(int id, DateTime? startDate = null, DateTime? endDate = null)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return null;

            var rentalsQuery = _context.Rentals
                .Include(r => r.Client)
                .Where(r => r.VehicleId == id);

            var expensesQuery = _context.Expenses
                .Where(e => e.VehicleId == id);

            if (startDate.HasValue)
            {
                rentalsQuery = rentalsQuery.Where(r => r.StartDate >= startDate.Value);
                expensesQuery = expensesQuery.Where(e => e.Date >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                rentalsQuery = rentalsQuery.Where(r => r.StartDate <= endDate.Value);
                expensesQuery = expensesQuery.Where(e => e.Date <= endDate.Value);
            }

            var rentals = await rentalsQuery.OrderByDescending(r => r.StartDate).ToListAsync();
            var expenses = await expensesQuery.OrderByDescending(e => e.Date).ToListAsync();

            var totalEarnings = rentals.Sum(r => r.TotalCost ?? 0);
            var totalExpenses = expenses.Sum(e => e.Amount);

            return new VehicleHistoryDto
            {
                Vehicle = vehicle,
                Rentals = rentals,
                Expenses = expenses,
                TotalEarnings = totalEarnings,
                TotalExpenses = totalExpenses,
                NetBalance = totalEarnings - totalExpenses,
                TotalTrips = rentals.Count(r => r.Status == "Completed")
            };
        }
    }
}
