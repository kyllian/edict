using Edict.Application.Import;
using Edict.Application.Search;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Edict.Api.Controllers;

[Authorize, Route("import")]
public class ImportController(
    Importer importer,
    Indexer indexer) : BaseController
{
    [HttpPost("rules")]
    public async Task<IActionResult> PostRuleset([FromForm] IFormFile file)
    {
        if (file.Length == 0)
            return BadRequest("File is required.");

        using StreamReader reader = new(file.OpenReadStream());
        string content = await reader.ReadToEndAsync();

        await importer.Import(content);
        await indexer.Index();

        return Ok();
    }
}