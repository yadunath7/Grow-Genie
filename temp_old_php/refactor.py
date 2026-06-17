import os

directory = '/Users/yadunath/Desktop/grow geni'
php_header = "<?php\nsession_start();\ninclude 'api/db.php';\n?>\n"

# Files to update .html to .php links and prepend header
view_files = ['index.php', 'login.php', 'register.php', 'dashboard.php', 'ideas.php', 'marketing.php', 'invoices.php']

for file in view_files:
    filepath = os.path.join(directory, file)
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
        
        # Replace .html with .php
        content = content.replace('.html', '.php')
        
        # Prepend header
        content = php_header + content
        
        with open(filepath, 'w') as f:
            f.write(content)

# Update app.js
appjs_path = os.path.join(directory, 'assets/js/app.js')
if os.path.exists(appjs_path):
    with open(appjs_path, 'r') as f:
        content = f.read()
    content = content.replace('.html', '.php')
    with open(appjs_path, 'w') as f:
        f.write(content)

print("Refactored views and JS")
