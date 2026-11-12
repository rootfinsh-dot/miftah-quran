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

- Keep existing URLs and use validated, retained root `lang` search state so translated content and SSR page metadata share the same language.
- Public page metadata is centralized in `pageHead`; private, checkout and password-reset pages must be noindex.
- Advertising remains inert until a verified publisher and certified CMP are integrated; the privacy dialog is not a certified CMP.
