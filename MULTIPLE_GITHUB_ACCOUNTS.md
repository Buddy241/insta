# How to Manage Multiple GitHub Accounts (SSH Key Method)

If you have two accounts (e.g., `Personal` and `Work`, or `Rishi` and `Buddy`), the best way to switch between them is using **SSH Config**.

## Step 1: Generate SSH Keys for Each Account
Open your terminal and run these commands to create two different keys.

**For Account 1 (e.g., Main/Personal):**
```bash
ssh-keygen -t ed25519 -C "your-email-1@example.com" -f ~/.ssh/id_github_main
```

**For Account 2 (e.g., Buddy241/Work):**
```bash
ssh-keygen -t ed25519 -C "your-email-2@example.com" -f ~/.ssh/id_github_buddy
```

---

## Step 2: Add Keys to Your Mac
Tell your computer to remember these keys.
```bash
ssh-add --apple-use-keychain ~/.ssh/id_github_main
ssh-add --apple-use-keychain ~/.ssh/id_github_buddy
```

---

## Step 3: Add Keys to GitHub Website
1.  Copy the first key: `cat ~/.ssh/id_github_main.pub | pbcopy`
2.  Go to **GitHub (Account 1) -> Settings -> SSH Keys -> New SSH Key** and paste it.
3.  Copy the second key: `cat ~/.ssh/id_github_buddy.pub | pbcopy`
4.  Go to **GitHub (Account 2) -> Settings -> SSH Keys -> New SSH Key** and paste it.

---

## Step 4: Create the Config File (The Magic Part) 🪄
Create or edit the file `~/.ssh/config`.

```bash
nano ~/.ssh/config
```

Paste this text inside:

```text
# Account 1 (Default)
Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_github_main

# Account 2 (Buddy)
Host github-buddy
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_github_buddy
```
*(Press Ctrl+O to save, Ctrl+X to exit)*

---

## Step 5: How to Use Them

**For your Main Account:**
Clone normally:
```bash
git clone git@github.com:Rishikesavaninklidox/repo.git
```

**For the Buddy Account:**
You must change the domain from `github.com` to `github-buddy` in the URL.
```bash
git clone git@github-buddy:Buddy241/insta.git
```

**To fix your current folder:**
In your `insdow` folder, run:
```bash
git remote set-url origin git@github-buddy:Buddy241/insta.git
```
Now when you `git push`, it will automatically use the Buddy account key!
