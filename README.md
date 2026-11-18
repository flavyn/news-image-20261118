# news-image-20261118 - Sum up 18 November's world news in one image

An entry for make.fun's news-image-20261118 bounty.
[View the bounty](https://make.fun/bounty/news-image-20261118).

[![make.fun · news-image-20261118](https://make.fun/badge/news-image-20261118.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![rank](https://make.fun/badge/news-image-20261118/flavyn/news-image-20261118/rank.svg)](https://make.fun/bounty/news-image-20261118/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)
[![reward](https://make.fun/badge/news-image-20261118/flavyn/news-image-20261118/reward.svg)](https://make.fun/bounty/news-image-20261118?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261118)

Requires Node.js 22 with ESM support; no dependencies or network access.
Place the complete PNG or JPEG image in `entry.png` beside `main.ts`.
Run: `MAKEFUN_OUTPUT_DIR=out node main.ts`.
In PowerShell: `$env:MAKEFUN_OUTPUT_DIR='out'; node main.ts`.
The output defaults to `/output` when the environment variable is unset.
Images must be at most 1,048,576 bytes; PNG dimensions must not exceed 1024.
The program creates the destination directory and writes the original bytes.
Invalid input or an export failure produces an error and a nonzero exit code.
