using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TypeSprint.Server.Data;
using TypeSprint.Server.Models;

namespace TypeSprint.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SourceTypesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SourceTypesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/SourceTypes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SourceType>>> GetSourceTypes()
        {
            return await _context.SourceTypes.ToListAsync();
        }

        // GET: api/SourceTypes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SourceType>> GetSourceType(int id)
        {
            var sourceType = await _context.SourceTypes.FindAsync(id);

            if (sourceType == null)
            {
                return NotFound();
            }

            return sourceType;
        }

        // PUT: api/SourceTypes/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSourceType(int id, SourceType sourceType)
        {
            if (id != sourceType.SourceTypeId)
            {
                return BadRequest();
            }

            _context.Entry(sourceType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SourceTypeExists(id))
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

        // POST: api/SourceTypes
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SourceType>> PostSourceType(SourceType sourceType)
        {
            _context.SourceTypes.Add(sourceType);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSourceType", new { id = sourceType.SourceTypeId }, sourceType);
        }

        // DELETE: api/SourceTypes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSourceType(int id)
        {
            var sourceType = await _context.SourceTypes.FindAsync(id);
            if (sourceType == null)
            {
                return NotFound();
            }

            _context.SourceTypes.Remove(sourceType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SourceTypeExists(int id)
        {
            return _context.SourceTypes.Any(e => e.SourceTypeId == id);
        }
    }
}
