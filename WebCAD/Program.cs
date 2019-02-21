
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WebCAD
{
    
    
    public class Program
    {
        
        
        public static void Main(string[] args)
        {
            CreateWebHostBuilder(args).Build().Run();
        } // End Sub Main 
        
        
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) 
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
        } // End Function CreateWebHostBuilder 
        
        
    } // End Class Program 
    
    
} // End Namespace WebCAD 
