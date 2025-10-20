using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace Edict.Api.Filters;

public class AuthorizeIfNotDevelopmentAttribute() : TypeFilterAttribute(typeof(RequireAuthIfNotDevFilter))
{
    private class RequireAuthIfNotDevFilter(IHostEnvironment env) : IAsyncAuthorizationFilter
    {
        public Task OnAuthorizationAsync(AuthorizationFilterContext context)
        {
            // If we're in Development, skip authorization
            if (env.IsDevelopment())
                return Task.CompletedTask;

            ClaimsPrincipal? user = context.HttpContext.User;
            if (user?.Identity?.IsAuthenticated == true)
                return Task.CompletedTask;

            context.Result = new UnauthorizedResult();
            return Task.CompletedTask;
        }
    }
}

