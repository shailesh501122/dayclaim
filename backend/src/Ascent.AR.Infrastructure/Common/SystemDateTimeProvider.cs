using Ascent.AR.Application.Common.Interfaces;

namespace Ascent.AR.Infrastructure.Common;

public class SystemDateTimeProvider : IDateTimeProvider
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
