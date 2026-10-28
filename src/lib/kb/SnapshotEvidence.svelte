<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { causeOf, groupByCause, uniqueById, type Report } from '#lib/kb/causes';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  const unique = uniqueById(reports as Report[]);
  const merged = $derived(unique.filter((r) => r.mergedInto === ticket));
  const raw = $derived(reports.filter((r) => r.mergedInto === ticket));
  const groups = $derived(groupByCause(merged, tenantOf));
  const disagreements = $derived(merged.filter((r) => r.meta.intakeTag !== causeOf(r, tenantOf(r))));
</script>

<p>
  The export has <strong>{raw.length}</strong> rows for #{ticket}, representing
  <strong>{merged.length}</strong> distinct report IDs.
  <strong>{raw.length - merged.length}</strong> repeated rows are export overlap,
  not additional reports. All counts below use distinct IDs, keeping the last
  exported record for each ID.
</p>
<p>
  Intake's tag disagrees with the tenant-based classification on
  <strong>{disagreements.length}</strong> reports. Neither the tag nor the
  reporter's browser locale is the source of truth for the cause.
</p>

<h3>Examples from the snapshot</h3>
<p>These reports illustrate the groups; their wording is not the classification rule.</p>
{#each groups as group (group.cause)}
  {@const report = group.reports[0]}
  {@const tenant = tenantOf(report)}
  <h4><code>{group.cause}</code> · {report.id}</h4>
  <p>
    <code>{report.tenant}</code> · locale <code>{tenant?.locale}</code> ·
    <code>{tenant?.form}</code> · channel <code>{report.channel}</code>
  </p>
  <blockquote>{report.body}</blockquote>
{/each}
