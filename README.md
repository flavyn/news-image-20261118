# News image entry

An entry for make.fun's news-image-20261118 bounty.
[View the bounty](https://make.fun/bounty/news-image-20261118).

![competition](https://make.fun/badge/news-image-20261118.svg)
![rank](https://make.fun/badge/news-image-20261118/flavyn/news-image-20261118/rank.svg)
![reward](https://make.fun/badge/news-image-20261118/flavyn/news-image-20261118/reward.svg)

Requires Node.js 22 with ESM support; no dependencies or network access.
Place the complete PNG or JPEG image in `entry.png` beside `main.ts`.
Run: `MAKEFUN_OUTPUT_DIR=out node main.ts`.
In PowerShell: `$env:MAKEFUN_OUTPUT_DIR='out'; node main.ts`.
The output defaults to `/output` when the environment variable is unset.
Images must be at most 1,048,576 bytes; PNG dimensions must not exceed 1024.
The program creates the destination directory and writes the original bytes.
Invalid input or an export failure produces an error and a nonzero exit code.
