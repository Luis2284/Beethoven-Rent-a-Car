using LosCarrosDeBeto.API.Data;
using LosCarrosDeBeto.API.Models;
using LosCarrosDeBeto.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LosCarrosDeBeto.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinesController : ControllerBase
    {
        private readonly IFineService _fineService;
        private readonly ApplicationDbContext _context;

        public FinesController(IFineService fineService, ApplicationDbContext context)
        {
            _fineService = fineService;
            _context = context;
        }

        [HttpGet("vehicle/{vehicleId}")]
        public async Task<ActionResult<List<Fine>>> GetByVehicle(int vehicleId)
        {
            return await _fineService.GetFinesByVehicleAsync(vehicleId);
        }

        [HttpPost]
        public async Task<ActionResult<Fine>> Create(Fine fine)
        {
            return await _fineService.RegisterFineAsync(fine);
        }

        [HttpPost("{id}/pay")]
        public async Task<IActionResult> Pay(int id)
        {
            await _fineService.PayFineAsync(id);
            return Ok();
        }

        [HttpGet("check-simit/{plate}")]
        public async Task<ActionResult<Fine?>> CheckSimit(string plate)
        {
            var fine = await _fineService.MockCheckSimitAsync(plate);
            if (fine == null) return NotFound("Sin multas registradas en SIMIT (Simulado)");
            
            // If found, find vehicle ID if exists in our DB
            var vehicle = _context.Vehicles.FirstOrDefault(v => v.Plate == plate);
            if (vehicle != null) fine.VehicleId = vehicle.Id;

            return Ok(fine);
        }
    }
}
