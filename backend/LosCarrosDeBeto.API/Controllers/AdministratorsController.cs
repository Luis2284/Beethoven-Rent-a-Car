using LosCarrosDeBeto.API.Models;
using LosCarrosDeBeto.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace LosCarrosDeBeto.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministratorsController : ControllerBase
    {
        private readonly IAdministratorService _service;

        public AdministratorsController(IAdministratorService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Administrator>>> GetAdministrators()
        {
            return Ok(await _service.GetAllAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Administrator>> GetAdministrator(int id)
        {
            var admin = await _service.GetByIdAsync(id);
            if (admin == null)
            {
                return NotFound();
            }
            return admin;
        }

        [HttpPost]
        public async Task<ActionResult<Administrator>> PostAdministrator(Administrator administrator)
        {
            var createdAdmin = await _service.CreateAsync(administrator);
            return CreatedAtAction(nameof(GetAdministrator), new { id = createdAdmin.Id }, createdAdmin);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutAdministrator(int id, Administrator administrator)
        {
            if (id != administrator.Id)
            {
                return BadRequest();
            }

            try
            {
                await _service.UpdateAsync(administrator);
            }
            catch (Exception)
            {
                if (await _service.GetByIdAsync(id) == null)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAdministrator(int id)
        {
            await _service.DeleteAsync(id);
            return NoContent();
        }
    }
}
