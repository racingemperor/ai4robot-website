# Stellar leaderboard studies

Four visual studies of the Overall leaderboard, saved on `codex/prototype-stellar-board`. The production leaderboard remains at `leaderboard.html`; this preview has no primary navigation entry.

Run `python -m http.server 4177 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:4177/leaderboard-prototype.html`.

| Variant parameter | Visual rule |
| --- | --- |
| `solar` | The leader occupies the center; the other models orbit outward. |
| `andromeda` | Models advance outward from a luminous galactic core. |
| `voyage` | A common origin with longer comet trails for stronger models. |
| `vault` | Higher positions form a constellation above a planetary horizon. |

Use the bottom switcher or Left/Right keys to change scenes. Select a model logo to inspect its measured task coverage and open its existing result details. The cycle button rotates the preview order; the play/pause button controls motion. Reduced-motion preferences disable automatic animation.

Scene positions illustrate the proposed visual ordering. They are independent of measured results: no Overall percentages or new model rankings are calculated. Model details use the existing published results. All drawing is local Canvas plus the existing model logos; no image API or external graphics dependency is required.

The colorful revision uses cached fractal cloud textures, dark dust lanes, a warm core, blue stellar arms, pink emission regions, dense multicolor stars and small distant galaxies. The structural reference is [NASA's Messier 31 imagery](https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/); the scene is an artistic procedural rendering, with no NASA images embedded. Each concept has a separate nebula palette. Expensive cloud generation runs only when the scene or viewport changes.

Question for the next design decision: prioritize the first-place model (Solar), a galaxy identity (Andromeda), readable advancement (Deep Space), or a celestial landscape (Vault). No winning direction has been selected yet.
