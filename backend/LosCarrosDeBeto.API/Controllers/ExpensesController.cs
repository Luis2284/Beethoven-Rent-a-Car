using LosCarrosDeBeto.API.Models;
using LosCarrosDeBeto.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LosCarrosDeBeto.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ExpensesController : ControllerBase
    {
        private readonly IExpenseService _expenseService;

        public ExpensesController(IExpenseService expenseService)
        {
            _expenseService = expenseService;
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<ActionResult<IEnumerable<Expense>>> GetByVehicle(int vehicleId)
        {
            return Ok(await _expenseService.GetExpensesByVehicleIdAsync(vehicleId));
        }

        [HttpPost]
        public async Task<ActionResult<Expense>> Create(Expense expense)
        {
            var created = await _expenseService.CreateExpenseAsync(expense);
            return CreatedAtAction(nameof(GetByVehicle), new { vehicleId = created.VehicleId }, created);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _expenseService.DeleteExpenseAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
