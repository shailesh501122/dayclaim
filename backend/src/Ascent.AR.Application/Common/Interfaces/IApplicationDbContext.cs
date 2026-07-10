using Ascent.AR.Domain.ClaimEntries;
using Ascent.AR.Domain.Identity;
using Ascent.AR.Domain.Importer;
using Ascent.AR.Domain.Masters;
using Ascent.AR.Domain.Notes;
using Ascent.AR.Domain.RuleEngine;
using Ascent.AR.Domain.Wfm;
using Microsoft.EntityFrameworkCore;

namespace Ascent.AR.Application.Common.Interfaces;

/// <summary>
/// Application-layer view of the EF Core DbContext. The Application layer
/// depends only on this interface (Dependency Inversion) — Infrastructure
/// provides the real Npgsql-backed implementation, and tests can provide an
/// in-memory one.
/// </summary>
public interface IApplicationDbContext
{
    DbSet<ClientOrganization> ClientOrganizations { get; }
    DbSet<Role> Roles { get; }
    DbSet<Permission> Permissions { get; }
    DbSet<RolePermission> RolePermissions { get; }
    DbSet<User> Users { get; }
    DbSet<UserRole> UserRoles { get; }
    DbSet<UserOrganization> UserOrganizations { get; }
    DbSet<RefreshToken> RefreshTokens { get; }

    DbSet<ImporterConfig> ImporterConfigs { get; }
    DbSet<ImporterFieldMapping> ImporterFieldMappings { get; }
    DbSet<DataImportSourceReference> DataImportSourceReferences { get; }

    DbSet<PatientMaster> PatientMasters { get; }
    DbSet<EnterprisePatientIndex> EnterprisePatientIndexes { get; }
    DbSet<PayerMaster> PayerMasters { get; }
    DbSet<CptMaster> CptMasters { get; }
    DbSet<PracticeMaster> PracticeMasters { get; }
    DbSet<StateMaster> StateMasters { get; }
    DbSet<ProviderMaster> ProviderMasters { get; }

    DbSet<RcmReportEntry> RcmReportEntries { get; }
    DbSet<RcmReportDataEntrySyncRequest> RcmReportDataEntrySyncRequests { get; }
    DbSet<AgeingSlaHistory> AgeingSlaHistories { get; }

    DbSet<Rule> Rules { get; }
    DbSet<RuleExecutionRun> RuleExecutionRuns { get; }
    DbSet<RuleExecutionResult> RuleExecutionResults { get; }

    DbSet<Team> Teams { get; }
    DbSet<TeamMember> TeamMembers { get; }
    DbSet<WfmAllocationRule> WfmAllocationRules { get; }
    DbSet<Allocation> Allocations { get; }

    DbSet<ScenarioMaster> ScenarioMasters { get; }
    DbSet<ClaimNote> ClaimNotes { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
