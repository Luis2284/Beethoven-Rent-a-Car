using LosCarrosDeBeto.API.Data;
using LosCarrosDeBeto.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Services
{
    public class FineService : IFineService
    {
        private readonly ApplicationDbContext _context;

        public FineService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Fine>> GetFinesByVehicleAsync(int vehicleId)
        {
            return await _context.Fines
                .Include(f => f.Vehicle)
                .Where(f => f.VehicleId == vehicleId)
                .OrderByDescending(f => f.Date)
                .ToListAsync();
        }

        public async Task<Fine> RegisterFineAsync(Fine fine)
        {
            _context.Fines.Add(fine);
            await _context.SaveChangesAsync();
            return fine;
        }

        public async Task PayFineAsync(int fineId)
        {
            var fine = await _context.Fines.FindAsync(fineId);
            if (fine != null)
            {
                fine.IsPaid = true;
                fine.PaidDate = DateTime.Now;
                await _context.SaveChangesAsync();
            }
        }

        public async Task<Fine?> MockCheckSimitAsync(string plate)
        {
            // MOCK LOGIC: 
            // If plate ends in '9', return a fake fine.
            if (plate.EndsWith("9")) 
            {
                // Simulate delay
                await Task.Delay(1000);
                
                return new Fine
                {
                    ReferenceCode = "SIMIT-" + new Random().Next(100000, 999999),
                    Reason = "C02 - Estacionar en sitios prohibidos",
                    Amount = 522000,
                    Date = DateTime.Now.AddDays(-5),
                    IsPaid = false
                };
            }
            return null; // No fines found
        }
    }
}
