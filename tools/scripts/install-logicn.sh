#!/usr/bin/env bash

set -e

LogicN_DIR="packages-logicn/logicn-core"
LogicN_REPO="https://github.com/phillbooth/LogicN.git"

if [ -d "$LogicN_DIR/.git" ]; then
  echo "LogicN is already installed at $LogicN_DIR"
  echo "No changes made."
  exit 0
fi

if [ -d "$LogicN_DIR" ] && [ "$(ls -A "$LogicN_DIR")" ]; then
  echo "Error: $LogicN_DIR already exists and is not empty."
  echo "No changes made."
  exit 1
fi

echo "Installing LogicN into $LogicN_DIR..."
git submodule add "$LogicN_REPO" "$LogicN_DIR"

echo "LogicN installed."
echo "Commit the change with:"
echo "git add .gitmodules $LogicN_DIR"
echo "git commit -m \"Add LogicN submodule\""
