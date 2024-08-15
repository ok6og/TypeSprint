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
    public class SourcesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SourcesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SourceDto>>> GetSources([FromQuery] int? sourceTypeId)
        {
            IQueryable<Source> query = _context.Sources;

            if (sourceTypeId.HasValue)
            {
                query = query.Where(s => s.SourceTypeId == sourceTypeId.Value);
            }

            var sources = await query
                .Select(s => new SourceDto
                {
                    SourceId = s.SourceId,
                    SourceName = s.SourceName,
                    SourceTypeId = s.SourceTypeId,
                    SourceType = new SourceTypeDto
                    {
                        SourceTypeId = s.SourceType.SourceTypeId,
                        TypeName = s.SourceType.TypeName
                    }
                })
                .ToListAsync();

            return Ok(sources);
        }

        // GET: api/Sources/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Source>> GetSource(int id)
        {
            var source = await _context.Sources.FindAsync(id);

            if (source == null)
            {
                return NotFound();
            }

            return source;
        }

        // PUT: api/Sources/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSource(int id, Source source)
        {
            if (id != source.SourceId)
            {
                return BadRequest();
            }

            _context.Entry(source).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SourceExists(id))
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

        // POST: api/Sources
        [HttpPost]
        public async Task<ActionResult<SourceDto>> PostSource([FromBody] SourceCreateDto sourceCreateDto)
        {
            //Validate SourceTypeId
            var sourceType = await _context.SourceTypes.FindAsync(sourceCreateDto.SourceTypeId);
            if (sourceType == null)
            {
                return BadRequest("Invalid SourceTypeId");
            }

            //Check if Source already exists
            var existingSource = await _context.Sources
               .Where(s => s.SourceName == sourceCreateDto.SourceName && s.SourceTypeId == sourceCreateDto.SourceTypeId)
               .FirstOrDefaultAsync();

            if (existingSource != null)
            {
                return Conflict("A source with the same name and type already exists.");
            }

            //Create new source object
            var source = new Source
            {
                SourceName = sourceCreateDto.SourceName,
                SourceTypeId = sourceCreateDto.SourceTypeId
            };

            //Add and save to database
            _context.Sources.Add(source);
            await _context.SaveChangesAsync();

            //Map the newly created Source to DTO
            var sourceDto = new SourceDto
            {
                SourceId = source.SourceId,
                SourceName = source.SourceName,
                SourceTypeId = source.SourceTypeId,
                SourceType = new SourceTypeDto
                {
                    SourceTypeId = sourceType.SourceTypeId,
                    TypeName = sourceType.TypeName
                }
            };


            return CreatedAtAction("GetSource", new { id = source.SourceId }, sourceDto);
        }

        // DELETE: api/Sources/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSource(int id)
        {
            var source = await _context.Sources.FindAsync(id);
            if (source == null)
            {
                return NotFound();
            }

            _context.Sources.Remove(source);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SourceExists(int id)
        {
            return _context.Sources.Any(e => e.SourceId == id);
        }
    }
}
