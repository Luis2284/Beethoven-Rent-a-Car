using LosCarrosDeBeto.API.Models;
using LosCarrosDeBeto.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LosCarrosDeBeto.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RentalsController : ControllerBase
    {
        private readonly IRentalService _rentalService;

        public RentalsController(IRentalService rentalService)
        {
            _rentalService = rentalService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Rental>>> GetRentals()
        {
            return Ok(await _rentalService.GetAllRentalsAsync());
        }

        [HttpGet("active")]
        public async Task<ActionResult<IEnumerable<Rental>>> GetActiveRentals()
        {
            return Ok(await _rentalService.GetActiveRentalsAsync());
        }

        [HttpPost]
        public async Task<ActionResult<Rental>> CreateRental(Rental rental)
        {
            try
            {
                var newRental = await _rentalService.CreateRentalAsync(rental);
                return Ok(newRental);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteRental(int id, [FromBody] CompleteRentalRequest request)
        {
            var rental = await _rentalService.CompleteRentalAsync(id, request.FinalMileage, request.ReturnDate);
            if (rental == null) return NotFound();
            return Ok(rental);
        }

        [HttpGet("history")]
        public async Task<ActionResult<IEnumerable<Rental>>> GetRentalHistory([FromQuery] string plate, [FromQuery] DateTime? date)
        {
            var rentalHistory = await _rentalService.GetRentalHistoryAsync(plate, date);
            // Return empty list if none found, usually better than 404 for search results
            return Ok(rentalHistory);
        }
    }

    public class CompleteRentalRequest
    {
        public int FinalMileage { get; set; }
        public DateTime ReturnDate { get; set; }
    }

    public class RentalHistoryRequest
    {
        public string Plate { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}
