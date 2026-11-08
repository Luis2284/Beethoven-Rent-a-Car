using LosCarrosDeBeto.API.Data;
using LosCarrosDeBeto.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Services
{
    public class RentalService : IRentalService
    {
        private readonly ApplicationDbContext _context;

        public RentalService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Rental>> GetAllRentalsAsync()
        {
            return await _context.Rentals
                .Include(r => r.Client)
                .Include(r => r.Vehicle)
                    .ThenInclude(v => v!.Administrator)
                .OrderByDescending(r => r.StartDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Rental>> GetActiveRentalsAsync()
        {
            return await _context.Rentals
                .Include(r => r.Client)
                .Include(r => r.Vehicle)
                    .ThenInclude(v => v!.Administrator)
                .Where(r => r.Status == "Active")
                .ToListAsync();
        }

        public async Task<Rental> CreateRentalAsync(Rental rental)
        {
            // Simple validation: Check if vehicle is already rented
            var isRented = await _context.Rentals
                .AnyAsync(r => r.VehicleId == rental.VehicleId && r.Status == "Active");

            if (isRented)
            {
                throw new InvalidOperationException("Vehicle is already rented.");
            }

            rental.Status = "Active";
            _context.Rentals.Add(rental);

            // Update Vehicle Status
            var vehicle = await _context.Vehicles.FindAsync(rental.VehicleId);
            if(vehicle != null) vehicle.Status = "Rented";

            await _context.SaveChangesAsync();
            return rental;
        }

        public async Task<Rental?> CompleteRentalAsync(int id, int finalMileage, DateTime returnDate)
        {
            var rental = await _context.Rentals.FindAsync(id);
            if (rental == null) return null;

            rental.FinalMileage = finalMileage;
            rental.EndDate = returnDate; // Update actual return date
            rental.Status = "Completed";

            // Calculate cost (Simple: Days * DailyRate)
            var days = (returnDate - rental.StartDate).Days;
            if (days < 1) days = 1; // Minimum 1 day
            rental.TotalCost = days * rental.DailyRate;

            // Update Vehicle Status
            // Update Vehicle Status
            var v = await _context.Vehicles.FindAsync(rental.VehicleId);
            if (v != null)
            {
                v.Status = "Available";
                v.CurrentMileage = finalMileage;
            }
            else if (rental.Vehicle != null)
            {
                 rental.Vehicle.Status = "Available";
                 rental.Vehicle.CurrentMileage = finalMileage;
            }

            await _context.SaveChangesAsync();
            return rental;
        }

        public async Task<IEnumerable<Rental>> GetRentalHistoryAsync(string plate, DateTime? date)
        {
            var query = _context.Rentals
                .Include(r => r.Client)
                .Include(r => r.Vehicle)
                .ThenInclude(v => v!.Administrator)
                .Where(r => r.Vehicle!.Plate == plate)
                .AsQueryable();

            if (date.HasValue)
            {
                // Check if the rental was active during the specified date
                query = query.Where(r => r.StartDate.Date <= date.Value.Date && 
                                       (r.Status == "Active" || r.EndDate.Date >= date.Value.Date));
            }

            return await query.OrderByDescending(r => r.StartDate).ToListAsync();
        }

        public async Task<Rental?> GetRentalByVehicleAndDateAsync(string plate, DateTime date)
        {
            // Normalize date
            var searchDate = date.Date;

            return await _context.Rentals
                .Include(r => r.Client)
                .Include(r => r.Vehicle)
                .ThenInclude(v => v!.Administrator) // Include Administrator (Owner)
                .Where(r => r.Vehicle!.Plate == plate)
                .Where(r => r.StartDate.Date <= searchDate && 
                           (r.Status == "Active" || r.EndDate.Date >= searchDate))
                .FirstOrDefaultAsync();
        }
    }
}
