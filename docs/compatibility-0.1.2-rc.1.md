# DSH 0.1.2-rc.1 compatibility

Verified on Windows with DSH `0.1.2-rc.1` on 2026-09-05.

## Verified

- The plugin package installed and its Host and Client entries activated in a real DSH Web Profile.
- The existing local session history remained readable after the DSH upgrade.
- The Agent Skyline entry appeared in the real `127.0.0.1:3080` profile.
- A separate `127.0.0.1:3081` QA Profile loaded the upgraded plugin inventory without a pending service dependency.
- The package uses the DSH 0.1.2 UI renderer instead of the removed `dsh-client-runtime` package.

## Preserved behavior

- Existing `midnight`, `aurora`, `sunset`, and `paper` theme IDs still select the four daylight city designs.
- Session, today, seven-day, and all-history ranges keep their original meaning.
- The visualization continues to store only coarse local activity summaries. Prompts, replies, commands, file paths, and tool arguments do not enter the city history or share output.

## Compatibility boundary

`compatible` means the plugin installs, activates, reads existing DSH history, and exposes its Client entry on DSH `0.1.2-rc.1`. Agent Skyline does not call a model Provider, so Provider authentication and model-request success are outside this plugin's compatibility claim.
