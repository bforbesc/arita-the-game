# 🎮 Arita's Puppy Panic

> **Learning case study** · 🎮 Software prototyping · Building with AI tools · Rules and feedback
>
> A historical experiment with explanations, examples, and source code.

[📚 Learning hub](https://github.com/bforbesc/Data-AI-with-Forbes) · [🧭 Beginner guide](https://github.com/bforbesc/Data-AI-with-Forbes/blob/main/START_HERE.md) · [🌐 Build and deploy a data app](https://github.com/bforbesc/Data-AI-with-Forbes/tree/main/templates/streamlit-starter)

## The idea before the tools

**How do we turn an idea into behavior someone can try and question?**

**Idea → explicit rules → playable prototype → observe and revise**

| Tool in this project | What it does in the example |
|---|---|
| **HTML** | Defines the page structure and controls. |
| **CSS** | Controls appearance and layout. |
| **JavaScript** | Applies movement, scoring, and game rules. |

**A tiny browser game, and a playful experiment in turning an idea into something people can try.**

Move the dog, catch the good things, avoid the bad things, and unlock a puppy picture when you reach the target. This project is part of [Data & AI with Forbes](https://github.com/bforbesc/Data-AI-with-Forbes), a collection of learning content and experiments with data, software, and AI tools.

## What it does, and why

This is an experiment with gaming and building with AI tools. It makes software ideas visible: a rule changes a score, an action produces feedback, and a small change can make the game easier or harder. You can learn from playing and explaining those choices without writing code.

The game itself runs in the browser. It does not call an AI model during play and needs no paid API key. The reward image is a newly generated, fictional puppy photo; it contains no personal family photo.

## Start here: no coding

Download and run a copy using the local setup below. Once it is open in a browser:

1. Press **Start round** and wait for the countdown.
2. Move with the **left/right arrow keys**, or **tap and drag** on the game area.
3. Catch bones (**+3**), hearts (**+4**), and toys (**+5**).
4. Avoid poop and brooms (**−4** each), and baths (**−5**). Successfully avoiding a bad item adds **1** point. Missing a good item does not subtract points.
5. Reach **35 points** to reveal the generated puppy picture. Your score cannot go below zero. Your best score is saved in this browser.

## First activity: predict, play, explain

Before playing, calculate the score for this sequence: catch a bone, catch a heart, hit a bath, then avoid a broom. Then play a round and record one moment when the feedback helped you understand a rule.

<details>
<summary>Check the calculation</summary>

Start at 0: `0 + 3 + 4 − 5 + 1 = 3`. If a penalty would take the score below zero, the game keeps it at zero.

</details>

Now discuss:

- Is the target clear before you start?
- Do you understand why the score changed?
- Does the game feel different with a keyboard and with touch or drag controls?
- What one rule would you change, and what do you predict would happen?

## Optional: change just one number

Open [game.js](game.js) in a text editor and find:

```js
const winScore = 35;
```

Change **only `35` to `20`**, save the file, refresh the browser, and start another round. The displayed target should now be 20. Predict whether rounds will be shorter, then try it. Put the number back to 35 when you finish. You have changed a software rule without needing to understand the whole program.

For a paper-only version, invent five catches or dodges, calculate the score after each one, and explain whether the target would have been reached.

## Run locally

1. On GitHub, choose **Code → Download ZIP** and extract the folder.
2. With Python installed, open a terminal in that extracted folder and run:

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

On Windows, use `py -m http.server 4173 --bind 127.0.0.1` if `python3` is unavailable. Open [http://127.0.0.1:4173](http://127.0.0.1:4173) in your browser. Keep the terminal open while playing; press **Ctrl+C** there to stop the server. You do not need Node.js or npm to play.

## What is in the folder?

| File | Role |
|---|---|
| [index.html](index.html) | The page's structure: buttons, labels, and game area |
| [styles.css](styles.css) | Colors, layout, and appearance |
| [game.js](game.js) | Movement, falling objects, collisions, scoring, and rewards |
| [assets/](assets/) | Images used by the game |

A **collision** means the game decides two objects touch. A **game loop** repeatedly reads input, moves objects, checks collisions, and updates the screen.

## License and images

Source code and documentation use the [ISC License](LICENSE), matching the existing package metadata. That code license does **not** grant rights to the images in `assets/`; see [the asset notes](assets/README.md). Use your own appropriately licensed images when making a public derivative.

[Questions and suggestions](https://github.com/bforbesc/arita-the-game/issues) are welcome.
