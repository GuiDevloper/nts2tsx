# nts2tsx

Utility to rename NTS files to TSX in the current directory.

> 💡 It avoids some mess not messing with messed up **node_modules**, **webpack.config.js** and dot files/directories

## Args

The simplest use searches for NTS files and rename them:

```bash
npx nts2tsx
```

Together with renaming, it cleans up any use of `.nts` extension in paths.

> ✨ It stores the relative paths of renamed files at **./nts2tsx-save.txt**

To restore to original filenames, just run:

```bash
npx nts2tsx --restore
```

You would like to rename TSX to NTS files? Okay then, just run:

```bash
npx nts2tsx --invert
```

and to restore:

```bash
npx nts2tsx --invert --restore
```

## License

[MIT](LICENSE) © 2022 Guilherme Correia