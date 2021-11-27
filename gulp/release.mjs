
import bump from "conventional-recommended-bump";
import releaser from "conventional-github-releaser";
import { execa } from "execa";
import fs from "fs";
import { promisify } from "util";
import dotenv from "dotenv";

// See: https://gulpjs.com/docs/en/recipes/automate-releases/
//

const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const preset = "angular";
const stdio = "inherit";

async function bumpVersion() {
  // get recommended version bump based on commits
  //
  const { releaseType } = await promisify(bump)({ preset });
  // bump version without committing and tagging
  //
  await execa("npm", ["version", releaseType, "--no-git-tag-version"], {
    stdio,
  });
}

async function changelog() {
  await execa(
    "npx",
    [
      "conventional-changelog",
      "--preset",
      preset,
      "--infile",
      "CHANGELOG.md",
      "--same-file",
    ],
    { stdio }
  );
}

async function commitTagPush() {
  const { version } = JSON.parse(await promisify(fs.readFile)("package.json"));
  const message = `chore: release ${version}`;
  await execa("git", ["add", "."], { stdio });
  await execa("git", ["commit", "--message", message], { stdio });
  await execa("git", ["tag", `v${version}`], { stdio });
  await execa("git", ["push", "--follow-tags"], { stdio });
}

function githubRelease(done) {
  const auth = { type: "oauth", token: process.env.GH_TOKEN };
  const options = { preset };
  releaser(
    auth, options, done
  );
}

export default {
  bumpVersion,
  changelog,
  commitTagPush,
  githubRelease
};
