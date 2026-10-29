# Stellar leaderboard studies

Four visual studies of the Overall leaderboard, saved on `codex/prototype-stellar-board`. The production leaderboard remains at `leaderboard.html`; this preview has no primary navigation entry.

Run `python -m http.server 4177 --bind 127.0.0.1` from this directory, then open `http://127.0.0.1:4177/leaderboard-prototype.html`.

| Variant parameter | Visual rule |
| --- | --- |
| `solar` | The leader occupies the center; the other models orbit outward. |
| `andromeda` (default) | The leader anchors the core; seven other models occupy seven arms, with stronger models closer to the center. |
| `voyage` | A common origin with longer comet trails for stronger models. |
| `vault` | Higher positions form a constellation above a planetary horizon. |

The Andromeda view is a transparent particle galaxy on the page background. It omits scene controls, the variant switcher and explanatory captions. Select a model logo to update the selected identity and, where results exist, open its existing result details. The other three studies remain available through their variant URLs and retain their original comparison controls. Reduced-motion preferences disable automatic animation.

Scene positions illustrate the proposed visual ordering. They are independent of measured results: no Overall percentages or new model rankings are calculated. Model details use the existing published results. All drawing is local Canvas plus the existing model logos; no image API or external graphics dependency is required.

The colorful revision uses cached cloud textures, a warm core, blue stellar arms and pink emission regions. Andromeda layers transparent blue, violet and pink cloud textures behind the seven particle arms, with a distant star field and sparse, slowly twinkling highlights. A golden solar core, fine corona rays and gold dust surround the central logo; its gold styling remains on selection and focus. All layers blend into the page without a rectangular background. Its desktop and mobile layouts both preserve strictly increasing distances from the leader in display order. The other studies retain dark skies, dust lanes and small distant galaxies. The structural reference is [NASA's Messier 31 imagery](https://science.nasa.gov/mission/hubble/science/explore-the-night-sky/hubble-messier-catalog/messier-31/); the scene is an artistic procedural rendering, with no NASA images embedded. Expensive cloud generation runs only when the scene or viewport changes.

The selected direction combines Andromeda's spiral structure with a central leader and a white background. It remains a preview; the production leaderboard has not been replaced.
