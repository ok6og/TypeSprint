using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TypeSprint.Server.Data;
using TypeSprint.Server.Models;
using TypeSprint.Server.Models.DTOs;

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
        public async Task<ActionResult<IEnumerable<SourceTypeDto>>> GetSourceTypes()
        {
            var sourceTypes = await _context.SourceTypes
            .Select(st => new SourceTypeDto
            {
                SourceTypeId = st.SourceTypeId,
                TypeName = st.TypeName
            })
            .ToListAsync();

            return Ok(sourceTypes);

            //var nz =  await _context.SourceTypes.ToListAsync();
            //return nz;
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
        public async Task<ActionResult<SourceType>> PostSourceType(SourceTypeCreateDto sourceTypeCreateDto)
        {
            // Validate input
            if (string.IsNullOrWhiteSpace(sourceTypeCreateDto.TypeName))
            {
                return BadRequest("Type Name is required.");
            }

            // Check if SourceType with the same TypeName already exists
            var existingSourceType = await _context.SourceTypes
                .Where(st => st.TypeName == sourceTypeCreateDto.TypeName)
                .FirstOrDefaultAsync();

            if (existingSourceType != null)
            {
                return Conflict("A source type with the same name already exists.");
            }

            // Create a new SourceType
            var sourceType = new SourceType
            {
                TypeName = sourceTypeCreateDto.TypeName
            };

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
