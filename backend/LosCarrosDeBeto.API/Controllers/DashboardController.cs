using LosCarrosDeBeto.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<DashboardData>> GetDashboardData([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            // Default to current month if not specified
            var now = DateTime.Now;
            var start = startDate ?? new DateTime(now.Year, now.Month, 1);
            var end = endDate ?? start.AddMonths(1);

            // 1. Vehicle Stats (Snapshot - Realtime)
            var vehicleStats = new VehicleStats
            {
                Total = await _context.Vehicles.CountAsync(),
                Available = await _context.Vehicles.CountAsync(v => v.Status == "Available" || v.Status == null || v.Status == ""),
                Rented = await _context.Vehicles.CountAsync(v => v.Status == "Rented"), // Use Vehicle status for consistency
                Maintenance = await _context.Vehicles.CountAsync(v => v.Status == "Maintenance")
            };

            // 2. Financials (Filtered by Date Range)
            var income = await _context.Rentals
                .Where(r => r.EndDate >= start && r.EndDate < end && r.Status == "Completed" && r.TotalCost != null)
                .SumAsync(r => r.TotalCost!.Value);

            var expenses = await _context.Expenses
                .Where(e => e.Date >= start && e.Date < end)
                .SumAsync(e => e.Amount);

            // 3. Top 5 Clients (Filtered by Date Range)
            var topClients = await _context.Rentals
                .Where(r => r.EndDate >= start && r.EndDate < end && r.Status == "Completed")
                .GroupBy(r => r.ClientId)
                .Select(g => new
                {
                    ClientId = g.Key,
                    Count = g.Count(),
                    TotalSpent = g.Sum(r => r.TotalCost ?? 0)
                })
                .OrderByDescending(x => x.Count)
                .Take(5)
                .Join(_context.Clients, 
                      stat => stat.ClientId, 
                      client => client.Id, 
                      (stat, client) => new TopClientDto 
                      { 
                          Name = client.Name, 
                          RentalsCount = stat.Count, 
                          TotalSpent = stat.TotalSpent 
                      })
                .ToListAsync();

            return Ok(new DashboardData
            {
                VehicleStats = vehicleStats,
                FinancialStats = new FinancialStats
                {
                    Income = income,
                    Expenses = expenses,
                    Balance = income - expenses
                },
                TopClients = topClients
            });
        }
    }

    public class DashboardData
    {
        public VehicleStats VehicleStats { get; set; } = new();
        public FinancialStats FinancialStats { get; set; } = new();
        public List<TopClientDto> TopClients { get; set; } = new();
    }

    public class VehicleStats
    {
        public int Total { get; set; }
        public int Available { get; set; }
        public int Rented { get; set; }
        public int Maintenance { get; set; }
    }

    public class FinancialStats
    {
        public decimal Income { get; set; }
        public decimal Expenses { get; set; }
        public decimal Balance { get; set; }
    }

    public class TopClientDto
    {
        public string Name { get; set; } = string.Empty;
        public int RentalsCount { get; set; }
        public decimal TotalSpent { get; set; }
    }
}
