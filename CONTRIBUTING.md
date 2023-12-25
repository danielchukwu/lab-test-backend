# Contribution Guidelines

When contributing to `LabTest`, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/tarzann419/lab-test/issues) for known issues or fixes.
- If you want to make code changes based on your personal opinion(s), make sure you open an issue first describing the changes you want to make, and open a pull request only when your suggestions gets approved by maintainers.

## How to Contribute

### Prerequisites

In order to not waste your time implementing a change that has already been declined, or is not needed, start by [opening an issue](https://github.com/tarzann419/lab-test/issues/new) describing the problem you would like to solve.

### Setup your environment locally

_Some commands will assume you have the Github CLI installed, if you haven't, consider [installing it](https://github.com/cli/cli#installation), but you can always use the Web UI if you prefer that instead._

In order to contribute to this project, you will need to fork the repository:

```bash
gh repo fork tarzann419/lab-test
```

then, clone it to your local machine:

```bash
gh repo clone <your-github-name>/lab-test
```

This project uses npm as its package manager. It comes with the [Node.js](https://nodejs.org/en/download) installation:

Then, install the project's dependencies:

```bash
npm install
```

### Implement your changes

Here are some useful scripts for when you are developing:

| Command              | Description                                             |
| ----------------     | ------------------------------------------------------- |
| `npm db:push`        | Builds and starts the CLI in watch-mode                 |
| `npm db:generate`    | Starts the development server for the docs with HMR     |
| `npm db:studio`      | Builds the CLI                                          |
| `npm dev`            | Run development server                                  |
| `npm build`          | Builds the app (compiling .ts to .js)                   |
| `npm server`         | Run compiled .js server                                 |

When making commits and creating pull requests, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending commit messages with `feat:`, `fix:`, `chore:`, `docs:`, etc... You can use `git status` to double check which files have not yet been staged for commit:

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

## Credits

This documented was inspired by the contributing guidelines for [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app/CONTRIBUTING.md).