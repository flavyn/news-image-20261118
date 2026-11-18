# GATE.md — news-image-20261118

Catatan gate untuk entri ini, semua diukur di mesin ini (Windows, Node v24.19.0, git 2.53.0.windows.3), 18 Nov 2026.
Kit: `D:\dipsik\makefun\forge\news-image-20261118\news-image-20261118-kit`.

## 1. Tiga lapis yang memutuskan entri

| lapis | dijalankan | memutuskan |
|---|---|---|
| intake + transcripts gate | lokal, `makefun check` | entri ditolak bila gagal |
| run gate (`run_completes`, `run_deterministic`) | server | `Valid` = 1/0 |
| image gate (PNG/JPEG utuh, ≤1 MiB, ≤1024×1024) | server | `Valid` = 1/0 |
| juri | server | peringkat (win rate) |

`check` hanya menjalankan lapis pertama. Lapis tengah tidak bisa dijalankan lokal — lihat §4.

## 2. Perintah persis dan hasilnya sekarang

```
cd D:\dipsik\makefun\forge\news-image-20261118\news-image-20261118-kit
node cli/makefun.mjs check --kit . --repo D:\dipsik\makefun\entries\news-image-20261118 --worktree
```

Hasil di worktree: `competition_open`, `snapshot`, `license_osi`, `entrypoint` pass;
`transcripts_present` FAIL karena bundle belum ada; 13 cek lain skip; 5 baris
"at submission".

`transcripts_present` baru bisa hijau setelah sesi builder selesai dan bundle dibuat:

```
node cli/makefun.mjs bundle --repo <repo> --system-prompt <file> --effort <effort> --out transcripts.tar.gz --redact "<detail>"
node cli/makefun.mjs check --kit . --repo <repo> --transcripts transcripts.tar.gz
```

## 3. Baris `check` yang harus pass

| baris | arti |
|---|---|
| `competition_open` | waktu pemeriksaan di antara opening `2026-11-18T00:00:00Z` (18 Nov 07:00 WIB) dan deadline `2026-11-20T00:00:00Z` (20 Nov 07:00 WIB) |
| `snapshot` | batas intake 100 MiB/berkas, 512 MiB/repo |
| `license_osi` | `LICENSE` memuat baris `SPDX-License-Identifier: MIT` |
| `entrypoint` | `main.ts` di root memilih runtime `node22` |
| `transcripts_present` | ada sesi yang bisa di-parse dari bundle |
| `thinking_*`, `transcripts_run_record` | 12 cek transkrip, lihat §3a |
| `repo_public`, `repo_owner`, `repo_created_after_open`, `commit_in_repo`, `duplicate_snapshot` | hanya dicek situs saat submit; dicetak sebagai "at submission" |

Tiga yang paling mudah menjatuhkan: repo harus publik dan dibuat **setelah** `2026-11-18T00:00:00Z`; `.makefun/owner.json` harus ikut commit pertama (ada di repo ini, wallet `3fDEba…yYy`); snapshot tidak boleh identik dengan entri akun lain.

### 3a. Transcript gate: 12 baris, non-strict tapi run record wajib

Tidak ada `strict_transcripts` di `competition.yaml` (bundle upload), tetapi `transcripts_required: true` dan `transcripts_run_record` aktif sejak 17 Nov 00:00Z. Baris yang terlihat di `check`: `transcripts_present`, `transcripts_recorded`, `thinking_wellformed`, `thinking_in_window`, `thinking_committed`, `thinking_reproduces` (min_authored 0,3; max_unwritten_share 0,4; entrypoint ≥1 baris authored), `thinking_on_task`, `thinking_turns` (≥5), `thinking_priced`, `thinking_revised` (≥2 write), `thinking_fresh`, `transcripts_run_record`.

Konsekuensi: `main.ts` di kerangka ini ditulis **di luar** sesi builder, jadi seluruh barisnya `absent`. Sesi terekam wajib menulis ≥1 baris `main.ts`; `entry.png` tidak dihitung sebagai baris transkrip.

## 4. Yang tidak bisa dijalankan lokal

```
node cli/makefun.mjs grade-local --kit . --bot <repo> --worktree --driver process
→ makefun grade-local: news-image-20261118 is a program/v1 competition: its scorer and
  reference data are not published in the kit, so the house grades it from its
  competition directory (--kit competitions/news-image-20261118)
```

Jadi satu-satunya verifikasi lokal adalah `check`.

`run_completes`: "The entry must build and run to completion in the grader's sandbox within the harness's limits."
`run_deterministic`: "Two runs of the entry on the same data must produce the same action log." — untuk `program/v1` artinya dua run menulis byte yang sama; fix resminya: hapus jam dinding, randomness tanpa seed, panggilan jaringan, iterasi tak berurut.

## 5. Catatan Windows

**5a. `check --worktree` + EPERM.** Bila working tree memuat **dua berkas berbyte identik** (`entry.png` + salinan hasil build di `out1/entry.png`), `check --worktree` gagal:

```
makefun check: EPERM: operation not permitted, rename
  '...\Temp\makefun-check-XXXX\blobs\tmp\<id>.part' -> '...\blobs\<xx>\<sha256>'
```

Sebabnya blob store: dua berkas berisi sama di-stage bersamaan, rename kedua menabrak blob read-only. Diuji: `out1/`+`out2/` → EPERM; `out/` (di-.gitignore) → pass. **Aturan: hasil build hanya di `out/`.**

**5b. `check` mode commit gagal karena URL `file:///D:/`.** Tanpa flag, `check` membaca commit lewat `git fetch file:///D:/...`, dan git-for-windows 2.53.0 menolaknya:

```
fatal: '/C:/Users/.../makefun-check-XXXX/repo' does not appear to be a git repository
```

Diuji terpisah: `git fetch file:///D:/path` gagal, `git fetch file://D:/path` berhasil. Workaround (env git, bukan config global):

```powershell
$env:GIT_CONFIG_COUNT='1'
$env:GIT_CONFIG_KEY_0='url.file://D:/.insteadOf'
$env:GIT_CONFIG_VALUE_0='file:///D:/'
node cli/makefun.mjs check --kit . --repo <repo>
```

**5c. CRLF.** `core.autocrlf` aktif, jadi commit mencetak `LF will be replaced by CRLF`; blob yang tersimpan tetap LF dan gate membaca blob, jadi aman — jangan bandingkan byte teks antara worktree dan `git show`.

**5d. Path.** Semua perintah menerima path Windows absolut; `--repo` boleh di luar kit.

## 6. Gambar: apa yang wajib, dan apakah butuh library

Kontrak (`RULES.txt:5-7`): satu berkas `/output/entry.png`, PNG **atau** JPEG dari byte pertamanya, ≤1.048.576 B, ≤1024×1024 px, gambar utuh.

- **SVG/HTML tidak diterima** — gate membaca PNG/JPEG dari magic bytes.
- **Tidak butuh library pihak ketiga.** PNG bisa ditulis dengan `node:zlib` + CRC32; `forge\news-image-20261118\tools\make-placeholder.mjs` membuktikannya (1.496 B, dua run sha256 identik). Tidak ada `npm install` saat grade, jadi `sharp`/`canvas` tidak mungkin.
- **Jalur yang dipakai lane ini:** gambar dirender di luar (oleh operator), di-commit, `main.ts` hanya memvalidasi + menyalin → dua run byte-identik.
- `main.ts` tidak mengasumsikan dimensi: satu-satunya batas adalah batas gate (`> 1024` gagal, `= 1024` lolos), dan tidak ada asumsi rasio atau ukuran kanvas.

## 7. Checklist sebelum submit

1. `entry.png` final: PNG/JPEG utuh, ≤1 MiB, ≤1024×1024, **bukan** berkas kit dan bukan gambar lane 1117.
2. `node main.ts` dua kali ke direktori berbeda → sha256 sama.
3. `main.ts` punya ≥1 baris yang ditulis di sesi builder.
4. `check --worktree` hijau kecuali baris "at submission"; lalu `bundle` + `check --transcripts`.
5. Repo GitHub dibuat setelah `2026-11-18T00:00:00Z`, publik, LICENSE ber-SPDX, `.makefun/owner.json` di commit pertama.
6. Submit dengan `--bundle transcripts.tar.gz --keypair wallet.json`; batas 10 submit/UTC-hari, 20 total; entri final = submit terakhir sebelum `2026-11-20T00:00Z`.
