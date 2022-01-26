using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MediatR;
using Domain;
using Persistence;

namespace Application.Jobs
{
    public class Details
    {
        public class Query : IRequest<Job>{
           public Guid Id {get ; set;} 
        }

        public class Handler : IRequestHandler<Query,Job>
        {
        public DataContext _context { get; }
            public Handler(DataContext context)
            {
                _context = context;
                
            }

            public async Task<Job> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Jobs.FindAsync(request.Id);
                
            }
        }
    }
}