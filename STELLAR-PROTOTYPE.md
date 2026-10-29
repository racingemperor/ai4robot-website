# Stellar leaderboard studies

Four Overall leaderboard studies. The production leaderboard remains at `leaderboard.html`; this preview has no primary navigation entry.

Run `python -m http.server 4177 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:4177/leaderboard-prototype.html`.

| Variant parameter | Visual rule |
| --- | --- |
| `solar` | The leader occupies the center; other models orbit outward. |
| `andromeda` (default) | The colorful, tilted galaxy. Stronger models lie farther from the core. |
| `voyage` | A common origin with longer comet trails for stronger models. |
| `vault` | Higher positions form a constellation above a planetary horizon. |

The selected Andromeda direction restores the original colorful galaxy from `5dfe3df`: dark star field, blue-violet spiral arms, pink emission clouds and a warm core, with the original model positions. The surrounding website still follows its light/dark theme. The compact Overall heading and selected-model details remain; scene controls, explanatory captions and the variant switcher stay hidden. Select a model logo to update its identity and, where available, open its existing measured results. Other studies retain their comparison controls at their variant URLs.

Scene positions illustrate the proposed ordering, independent of measured results: no Overall percentages or new model rankings are calculated. Model details use the existing published results. All drawing uses local Canvas and the existing official model logos, with no image API or external graphics dependency. Reduced-motion preferences disable automatic animation.

Cloud textures, the dense star field, dust lanes and distant galaxies are cached; expensive generation runs only when the viewport or variant changes. The structural reference is [NASA's Messier 31 imagery](https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/). This is an artistic procedural rendering with no NASA images embedded.

This remains an independent preview. The production leaderboard has not been replaced.
