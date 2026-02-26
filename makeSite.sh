#!/usr/bin/env bash

SITEDIR="_site"

if [ -d "$SITEDIR" ]; then
  rm -rf "$SITEDIR"
fi
mkdir "$SITEDIR"

cp -r apps/vite/dist "$SITEDIR"/
cp -r apps/storybook/storybook-static "$SITEDIR"/storybook
