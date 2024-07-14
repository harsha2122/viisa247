echo "switching to branch main"
git checkout main

echo "Building app.."
npm run build

echo "Deploying file to server..."
scp -r build/* root@159.65.159.84:/var/www/159.65.159.84/

echo "Done!"
