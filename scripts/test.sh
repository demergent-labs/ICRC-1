# TODO add no-setup command-line arg

scripts/dfx_install.sh
dfx generate
scripts/modify_last_line.sh test/dfx_generated
ts-node --transpile-only --ignore=false test/test.ts
