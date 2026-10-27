#!/bin/sh
# Runs the packed library behind SAM CLI's local API Gateway and Lambda runtime.
# Requires Docker and AWS SAM CLI.
# Usage: sh test/sam/run.sh [runtime] [handler]
#   sh test/sam/run.sh nodejs22.x handler.handler       # LambdaHandler (callback)
#   sh test/sam/run.sh nodejs24.x handler.asyncHandler  # LambdaAsyncHandler
set -e

RUNTIME=${1:-nodejs22.x}
HANDLER=${2:-handler.handler}
PORT=${PORT:-3000}
DIR=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$DIR/../.." && pwd)

command -v sam >/dev/null || { echo "AWS SAM CLI is required: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"; exit 1; }
command -v docker >/dev/null || { echo "Docker is required"; exit 1; }

# Build and install the package the same way users get it from npm
cd "$ROOT" && sh build.sh
rm -rf "$DIR/.build" && mkdir -p "$DIR/.build"
(cd "$ROOT/dist" && npm pack --silent --pack-destination "$DIR/.build" >/dev/null)
cd "$DIR/.build"
echo '{"private": true}' > package.json
npm install --silent --no-package-lock ./lambda-phi-*.tgz
cp "$DIR/handler.ts" .
"$ROOT/node_modules/.bin/tsc" --ignoreConfig --strict false --experimentalDecorators --module nodenext --target es2022 \
    --types node --typeRoots "$ROOT/node_modules/@types" --outDir . handler.ts
rm handler.ts lambda-phi-*.tgz

cd "$DIR"
sam local start-api --template template.yaml --port "$PORT" --parameter-overrides "Runtime=$RUNTIME Handler=$HANDLER" --warm-containers EAGER &
SAM_PID=$!
trap 'kill $SAM_PID 2>/dev/null' EXIT

echo "Waiting for sam local start-api on port $PORT ($RUNTIME, $HANDLER)..."
i=0
until curl -s -o /dev/null "http://127.0.0.1:$PORT/rest/books"; do
    i=$((i + 1))
    [ $i -gt 120 ] && { echo "sam local start-api did not start"; exit 1; }
    sleep 1
done

BASE_URL="http://127.0.0.1:$PORT" node --test "$DIR/sam.test.mjs"
