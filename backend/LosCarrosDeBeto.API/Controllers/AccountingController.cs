using LosCarrosDeBeto.API.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LosCarrosDeBeto.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountingController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("balance")]
        public async Task<ActionResult<BalanceSummary>> GetBalance(
            [FromQuery] DateTime? startDate, 
            [FromQuery] DateTime? endDate,
            [FromQuery] int? administratorId,
            [FromQuery] int? vehicleId)
        {
            var expensesQuery = _context.Expenses.Include(e => e.Vehicle).AsQueryable();
            var rentalsQuery = _context.Rentals.Include(r => r.Vehicle).Where(r => r.TotalCost != null).AsQueryable();

            if (startDate.HasValue)
            {
                expensesQuery = expensesQuery.Where(e => e.Date >= startDate.Value);
                rentalsQuery = rentalsQuery.Where(r => r.StartDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                var end = endDate.Value.Date.AddDays(1).AddTicks(-1);
                expensesQuery = expensesQuery.Where(e => e.Date <= end);
                rentalsQuery = rentalsQuery.Where(r => r.StartDate <= end);
            }

            if (vehicleId.HasValue)
            {
                expensesQuery = expensesQuery.Where(e => e.VehicleId == vehicleId.Value);
                rentalsQuery = rentalsQuery.Where(r => r.VehicleId == vehicleId.Value);
            }
            else if (administratorId.HasValue)
            {
                expensesQuery = expensesQuery.Where(e => e.Vehicle != null && e.Vehicle.AdministratorId == administratorId.Value);
                rentalsQuery = rentalsQuery.Where(r => r.Vehicle != null && r.Vehicle.AdministratorId == administratorId.Value);
            }

            var totalExpenses = await expensesQuery.SumAsync(e => e.Amount);
            var totalIncome = await rentalsQuery.SumAsync(r => r.TotalCost!.Value);

            return Ok(new BalanceSummary
            {
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                NetBalance = totalIncome - totalExpenses
            });
        }

        [HttpGet("transactions")]
        public async Task<ActionResult<List<TransactionItem>>> GetTransactions(
            [FromQuery] DateTime? startDate, 
            [FromQuery] DateTime? endDate,
            [FromQuery] int? administratorId,
            [FromQuery] int? vehicleId)
        {
            var expensesQuery = _context.Expenses.Include(e => e.Vehicle).AsQueryable();
            var rentalsQuery = _context.Rentals
                .Include(r => r.Vehicle) 
                .Where(r => r.TotalCost != null).AsQueryable();

            if (startDate.HasValue)
            {
                expensesQuery = expensesQuery.Where(e => e.Date >= startDate.Value);
                rentalsQuery = rentalsQuery.Where(r => r.StartDate >= startDate.Value);
            }

            if (endDate.HasValue)
            {
                var end = endDate.Value.Date.AddDays(1).AddTicks(-1);
                expensesQuery = expensesQuery.Where(e => e.Date <= end);
                rentalsQuery = rentalsQuery.Where(r => r.StartDate <= end);
            }

            if (vehicleId.HasValue)
            {
                expensesQuery = expensesQuery.Where(e => e.VehicleId == vehicleId.Value);
                rentalsQuery = rentalsQuery.Where(r => r.VehicleId == vehicleId.Value);
            }
            else if (administratorId.HasValue)
            {
                expensesQuery = expensesQuery.Where(e => e.Vehicle != null && e.Vehicle.AdministratorId == administratorId.Value);
                rentalsQuery = rentalsQuery.Where(r => r.Vehicle != null && r.Vehicle.AdministratorId == administratorId.Value);
            }

            var expenses = await expensesQuery.OrderByDescending(e => e.Date).Take(20)
                .Select(e => new TransactionItem
                {
                    Date = e.Date,
                    Description = e.Description,
                    Amount = e.Amount,
                    Type = "Gasto",
                    ReferenceId = e.Id
                }).ToListAsync();

            var rentals = await rentalsQuery.OrderByDescending(r => r.StartDate).Take(20)
                .Select(r => new TransactionItem
                {
                    Date = r.StartDate,
                    Description = $"Alquiler: {r.Vehicle!.Brand} {r.Vehicle.Model} ({r.Vehicle.Plate})",
                    Amount = r.TotalCost!.Value,
                    Type = "Ingreso",
                    ReferenceId = r.Id
                }).ToListAsync();

            var allTransactions = expenses.Concat(rentals)
                .OrderByDescending(t => t.Date)
                .Take(20)
                .ToList();

            return Ok(allTransactions);
        }
    }

    public class BalanceSummary
    {
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal NetBalance { get; set; }
    }

    public class TransactionItem
    {
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty; // "Ingreso" or "Gasto"
        public int ReferenceId { get; set; }
    }
}
