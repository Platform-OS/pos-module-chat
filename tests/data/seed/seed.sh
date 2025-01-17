set -eu

DEFAULT_ENV=""
POS_ENV="${1:-$DEFAULT_ENV}"

pos-cli data clean $POS_ENV --auto-confirm --include-schema

pos-cli deploy $POS_ENV

pos-cli data import --path=./tests/data/seed/data.zip --zip $POS_ENV