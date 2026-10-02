<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Preserve ViaBus's centralized demonstration store and role-specific routes until a real backend is explicitly enabled; these simulated identities do not provide security enforcement.
- Render geographic Curitiba maps through Google Maps when authorized and Leaflet/OpenStreetMap otherwise; the fallback keeps geographic context without an API key.
- Keep route IDs internal and derive public route names from shared display helpers, because demonstration identifiers are not official transit line numbers.
- Keep real passenger identity in Lovable Cloud Auth with database-backed passenger profiles and roles, while operational records and quick-access roles remain in the demonstration store; this avoids treating simulated identities as secure accounts.
