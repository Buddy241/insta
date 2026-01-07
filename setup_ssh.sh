#!/bin/bash

# 1. Create .ssh directory if it doesn't exist
mkdir -p ~/.ssh

echo "----------------------------------------------------------------"
echo "      InsDow SSH Setup Wizard for Multiple Accounts"
echo "----------------------------------------------------------------"
echo ""

# 2. Ask for Emails
echo "We need to generate two SSH keys."
echo "For the MAIN account (Rishikesavaninklidox):"
read -p "Enter email address: " email_main

echo ""
echo "For the BUDDY account (Buddy241):"
read -p "Enter email address: " email_buddy

# 3. Generate Keys
echo ""
echo "Generating keys..."
# -N "" means no passphrase for simplicity in this script (safe for local dev)
ssh-keygen -t ed25519 -C "$email_main" -f ~/.ssh/id_github_main -N ""
ssh-keygen -t ed25519 -C "$email_buddy" -f ~/.ssh/id_github_buddy -N ""

# 4. Add to Apple Keychain (Mac specific)
echo "Adding to Keychain..."
eval "$(ssh-agent -s)"
ssh-add --apple-use-keychain ~/.ssh/id_github_main
ssh-add --apple-use-keychain ~/.ssh/id_github_buddy

# 5. Create the Config File
echo "Configuring ~/.ssh/config..."

# Create a backup if it exists
if [ -f ~/.ssh/config ]; then
    cp ~/.ssh/config ~/.ssh/config.bak
    echo "Backed up existing config to ~/.ssh/config.bak"
fi

# Write the config (Overwrite or Append? Let's Append to be safe, but typically for this setup we define specific blocks)
# We will append checking if it exists, but for this wizard let's clear and write new for valid setup if user agreed, 
# but simply appending is safer.
cat <<EOT >> ~/.ssh/config

# --- Added by InsDow Setup ---
# Account 1 (Default - Rishikesavaninklidox)
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_github_main
  UseKeychain yes
  AddKeysToAgent yes

# Account 2 (Buddy241)
Host github-buddy
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_github_buddy
  UseKeychain yes
  AddKeysToAgent yes
# -----------------------------
EOT

echo ""
echo "✅ SSH Configured successfully!"
echo ""
echo "IMPORTANT: You must now copy these keys to GitHub website."
echo "Go to Settings -> SSH and GPG Keys -> New SSH Key"
echo ""
echo "Key for Account 1 (First Account):"
echo "------------------------------------------------"
cat ~/.ssh/id_github_main.pub
echo "------------------------------------------------"
echo ""
echo "Key for Account 2 (Buddy241):"
echo "------------------------------------------------"
cat ~/.ssh/id_github_buddy.pub
echo "------------------------------------------------"
