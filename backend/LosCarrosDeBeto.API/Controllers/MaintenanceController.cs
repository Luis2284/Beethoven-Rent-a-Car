using LosCarrosDeBeto.API.Models;
using LosCarrosDeBeto.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LosCarrosDeBeto.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MaintenanceController : ControllerBase
    {
        private readonly IMaintenanceService _service;

        public MaintenanceController(IMaintenanceService service)
        {
            _service = service;
        }

        [HttpGet("configs")]
        public async Task<ActionResult<IEnumerable<MaintenanceConfig>>> GetConfigs()
        {
            return Ok(await _service.GetConfigsAsync());
        }

        [HttpPost("configs")]
        public async Task<ActionResult<MaintenanceConfig>> CreateConfig(MaintenanceConfig config)
        {
            Console.WriteLine($"[API] Creating config: {config.Name}, Interval: {config.IntervalMileage}");
            var created = await _service.CreateConfigAsync(config);
            Console.WriteLine($"[API] Created config ID: {created.Id}");
            return Ok(created);
        }

        [HttpGet("pending")]
        public async Task<ActionResult<IEnumerable<object>>> GetPending()
        {
            return Ok(await _service.GetAllPendingMaintenancesAsync());
        }

        [HttpGet("vehicle/{id}")]
        public async Task<ActionResult<IEnumerable<object>>> GetVehicleStatus(int id)
        {
            return Ok(await _service.GetMaintenanceStatusAsync(id));
        }

        [HttpPost("register")]
        public async Task<ActionResult<VehicleMaintenance>> RegisterMaintenance(VehicleMaintenance maintenance)
        {
            var created = await _service.RegisterMaintenanceAsync(maintenance);
            return Ok(created);
        }
    }
}
