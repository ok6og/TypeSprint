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
    public class QuotesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public QuotesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Quotes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Quote>>> GetQuotes()
        {
            return await _context.Quotes.ToListAsync();
        }

        // GET: api/Quotes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Quote>> GetQuote(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);

            if (quote == null)
            {
                return NotFound();
            }

            return quote;
        }

        // PUT: api/Quotes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutQuote(int id, Quote quote)
        {
            if (id != quote.QuoteId)
            {
                return BadRequest();
            }

            _context.Entry(quote).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuoteExists(id))
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

        // POST: api/Quotes
        [HttpPost]
        public async Task<ActionResult<Quote>> PostQuote(QuoteCreateDto quoteCreateDto)
        {
            var quote = new Quote
            {
                QuoteText = quoteCreateDto.QuoteText,
                SourceId = quoteCreateDto.SourceId
            };
            _context.Quotes.Add(quote);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetQuote", new { id = quote.QuoteId }, quote);
        }

        // DELETE: api/Quotes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteQuote(int id)
        {
            var quote = await _context.Quotes.FindAsync(id);
            if (quote == null)
            {
                return NotFound();
            }

            _context.Quotes.Remove(quote);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool QuoteExists(int id)
        {
            return _context.Quotes.Any(e => e.QuoteId == id);
        }

        // GET: api/Quotes/random
        [HttpGet("random")]
        public async Task<ActionResult<QuoteDto>> GetRandomQuote()
        {
            var quoteCount = await _context.Quotes.CountAsync();

            if (quoteCount == 0)
            {
                return NotFound("No quotes available.");
            }

            
            var randomIndex = new Random().Next(0, quoteCount);

            
            var randomQuote = await _context.Quotes.Skip(randomIndex).Include(q => q.Source).FirstOrDefaultAsync();

            var quoteDto = new QuoteDto
            {
                QuoteId = randomQuote.QuoteId, 
                QuoteText = randomQuote.QuoteText,
                SourceId = randomQuote.Source?.SourceId,
                TimesUsed = randomQuote.TimesUsed,
                Source =  new SourceDto
                {
                    SourceId = randomQuote.Source.SourceId,
                    SourceName = randomQuote.Source.SourceName
                }
            };

            return Ok(quoteDto);
        }
    }
}
