# Security

## Scope and limitations

The CLI copies bundled Markdown locally. It does not execute skill instructions, contact APIs, install project dependencies or change agent permissions. Loading a skill into an agent can influence that agent's later actions: review instructions before use and retain normal tool approvals.

Version 0.1.x is the initial development line. There is no promised response SLA or independent security certification.

## File safety

- IDs and source file names are allowlisted by the manifest schema.
- Symbolic links and Windows junctions in source/destination paths are rejected.
- Installations carry a receipt with hashes of the exact owned files.
- Existing installations require `--force` for replacement. Modified files require `--force` for removal.
- Unknown directories, unexpected extra files and invalid receipts are refused even with `--force`.
- Writes use a local preset lock and a staged directory. Replacement keeps the previous directory until the new one has been renamed into place.
- Removal deletes only known leaf files. It does not recursively delete the target project.

These checks protect ordinary local use. They are not an operating-system sandbox against another process racing filesystem changes. Receipts detect edits; they are not cryptographic proof of authorship. Do not use the installer on directories writable by an untrusted concurrent user.

Operations are atomic per skill where directory rename is supported, not across an entire batch. A disk/permission failure can leave earlier skills committed or a backup/staging directory retained. See [recovery](docs/architecture.md#failure-and-recovery). Removal is not transactional; interruption may leave a partial owned folder.

## Reporting a vulnerability

Once a GitHub repository is published and private vulnerability reporting is enabled, use its **Security → Report a vulnerability** form. Include the version, OS, minimal reproduction, expected behavior and impact. Use synthetic data and redact credentials.

This local starter has no configured private reporting address. If the private form is unavailable, do not post exploit details or secrets publicly. Ask the maintainer for a private channel using a non-sensitive issue, then share details only through that channel.

Maintainer release action: enable GitHub private vulnerability reporting and add a verified contact channel before inviting public security reports.
