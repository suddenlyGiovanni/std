#!/usr/bin/env sh

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Emojis
SUCCESS=$(echo "\xF0\x9F\x91\x8D")   # Thumbs Up Emoji
WARN=$(echo "\xE2\x9A\xA0")           # Warning Emoji
ERROR=$(echo "\xF0\x9F\x98\xB1")       # Panic Emoji
WIP=$(echo "\xF0\x9F\x9A\xA7")        # Construction Emoji

# Set up directories
HOOKS_DIR=$(pwd)/hooks
if [ ! -d "$HOOKS_DIR" ]; then
    echo "${ERROR} ${RED}Hooks directory $HOOKS_DIR not found. Please ensure it exists.${NC}"
    exit 1
fi

GIT_DIR=$(git rev-parse --git-dir 2>/dev/null)

if [ -z "$GIT_DIR" ]; then
    echo "${ERROR} ${RED}This directory is not a git repository.${NC}"
    exit 1
fi
GIT_HOOKS_DIR=$GIT_DIR/hooks

echo "${WIP} ${YELLOW}Setting up custom git-hooks${NC}"

# Create the git hooks directory if not exist.
mkdir -p $GIT_HOOKS_DIR

# Create symlinks for all hooks in the hooks directory
for hook in $HOOKS_DIR/*; do
    hook_name=$(basename $hook)
    if [ -e "$hook" ]; then
        echo "	${SUCCESS} ${GREEN}Symlink ${CYAN}$hook ${GREEN}to ${PURPLE}$GIT_HOOKS_DIR/$hook_name ${NC}"
        ln -sf $hook $GIT_HOOKS_DIR/$hook_name
    else
        echo "${WARN} ${YELLOW}Hook ($hook_name) not found in $HOOKS_DIR. Skipping.${NC}"
    fi
done
echo "${SUCCESS} ${GREEN}Git hooks setup correctly!${NC}"