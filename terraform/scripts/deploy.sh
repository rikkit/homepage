#!/bin/bash
set -e

echo "✨ Syncing git..."
git push ssh://root@${ip}/~/homepage.git
