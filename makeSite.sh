#!/usr/bin/env bash

SITEDIR="_site"

if [ -d "$SITEDIR" ]; then
  rm -rf "$SITEDIR"
fi
mkdir "$SITEDIR"

cp -r apps/web/.next "$SITEDIR"/next
cp -r apps/cra/build "$SITEDIR"/cra
cp -r apps/storybook/storybook-static "$SITEDIR"/storybook
