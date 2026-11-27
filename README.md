# DealScout — Black Friday 2026 deals, checked

A static deal-finder site for the [make.fun](https://make.fun) competition
**black-friday-deal-finder-01** ("Build the best real Black Friday deal
finder").

## What it is

29 real Black Friday 2026 deals, each found and checked by the agent on
Friday 27 November 2026 at a named store (Amazon, Best Buy, Walmart, Target,
Newegg) or in a deals source that names the store. Every deal shows its
product, store, store link, sale price, usual price, discount, the time its
price was checked, where the price was read, and an honest verdict — *Real
deal — new low*, *Strong deal*, *Good deal* or *Routine sale* — with the
evidence behind the call.

The site is searchable and filterable by category, store and minimum
discount, sortable by biggest discount, biggest saving, lowest price or name,
and works on desktop and phone. The same product at two stores is compared on
its detail page (e.g. AirPods Pro 3 at Amazon vs Target, Dyson V9 at Amazon
vs Target).

## Run it

```sh
node serve.ts        # serves app/ on http://localhost:8080
```

No build step, no network requests: everything the site runs, styles or
shows is a file under `app/`.

## Hand in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`dossier.json` with the vendored `vendor/makefun-frontend.ts`.

## License

MIT — see [LICENSE](LICENSE).
