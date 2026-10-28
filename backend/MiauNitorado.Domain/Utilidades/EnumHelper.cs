using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace MiauNitorado.Domain.Utilidades
{
    public static class EnumHelper
    {
        public static string GetDisplayName<T>(T value) where T : Enum
        {
            var field = value.GetType().GetField(value.ToString());
            var attribute = field?.GetCustomAttribute<DisplayAttribute>();
            return attribute?.Name ?? value.ToString();
        }
    }
}
