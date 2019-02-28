
using System;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace WebCAD
{
    
    public static class fooext
    {
        public object Coalesce(params object[] arguments)
        {
            int len = arguments.Length;
            for (int i = 0; i < len; i++)
            {
                if (arguments[i] != null)
                {
                    return arguments[i];
                }
            }

            return null;
        }

        public T Coalesce<T>(params T[] arguments)
        {
            int len = arguments.Length;
            for (int i = 0; i < len; i++)
            {
                if (arguments[i] != null)
                {
                    return arguments[i];
                }
            }

            return default(T);
        }


        public static T IsNull<T>(this T v1, T defaultValue)
        {
            return v1 == null ? defaultValue : v1;
        }


        public static T IsNull<T>(this T v1, System.Func<T> lambda)
        {
            return v1 == null ? lambda() : v1;
        }
        
        
        public static T IsNullExpression<T>(this T v1, System.Linq.Expressions.Expression<System.Func<T>> lambda)
        {
            return v1 == null ? lambda.Compile()() : v1;
        }
        
    }

    
    
    public class Program
    {

        public class FooObj
        {

            public FooObj()
            {
                System.Console.WriteLine("foo");
            }
        }



        public static void Main(string[] args)
        {
            FooObj foo = new FooObj();
            foo.IsNull(new FooObj());
            
            foo.IsNull(() => new FooObj());
            foo.IsNull(delegate(){ return new FooObj(); });
            foo.IsNullExpression(() => new FooObj());

            
            
            CreateWebHostBuilder(args).Build().Run();
        } // End Sub Main 
        
        
        public static IWebHostBuilder CreateWebHostBuilder(string[] args) 
        {
            return WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>();
        } // End Function CreateWebHostBuilder 
        
        
    } // End Class Program 
    
    
} // End Namespace WebCAD 
