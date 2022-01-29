using Microsoft.AspNetCore.Mvc;
using System.Xml;

namespace API.Controllers;

[ApiController]
[Route("[controller]")]
public class ExampleController : ControllerBase
{

    private readonly ILogger<ExampleController> _logger;

    public ExampleController(ILogger<ExampleController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public ContentResult GetXml()
    {
        string xml =  System.IO.File.ReadAllText("input.xml");

        return new ContentResult
        {
            Content = xml,
            ContentType = "application/xml",
            StatusCode = 200
        };
    }
}