# Random Names

A team dashboard that shuffles names into a random order, displays them as color-coded initials circles, and shows a motivational quote over a random background photo.

## Live

| | |
|---|---|
| **Default** | https://roach0123.github.io/RandomNames/ |
| **Example with names** | https://roach0123.github.io/RandomNames/index.html?names=Mickey%20Mouse,Donald%20Duck,Goofy%20Goof,Minnie%20Mouse,Simba%20Lion,Belle%20French,Ariel%20Ocean,Elsa%20Ice,Tiana%20Frog |

## Usage

Open the app and paste in a list of names (comma or newline separated). Hit **Shuffle Names** (or `Cmd+Enter`) to display the shuffled grid.

To share a shuffled view, click the **link icon** in the top-right corner of the card. It copies a URL with the names encoded as a query parameter:

```
https://roach0123.github.io/RandomNames/?names=First+Last,First+Last,...
```

## Running locally

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

A local server is required; `fetch()` is blocked over `file://`.
