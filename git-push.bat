@echo off
cd /d "F:\Desktop\Prompt Picker"
git add .
git diff --cached --quiet
if %errorlevel%==0 (
    echo No changes to commit.
) else (
    git commit -m "Update project"
    git push
)
pause