echo "Building with yarn"
rm -rf build/
yarn build

S3_DIR="s3://test-frontend/ncp/ncp-holder-web/"
echo "Deploying to $S3_DIR"

echo "Cleaning $S3_DIR"
aws s3 --profile=s3_test_frontend rm $S3_DIR --recursive

echo "Deploying build/ to $S3_DIR"
aws s3 --profile=s3_test_frontend cp build/ $S3_DIR --recursive --exclude "*.map"

git checkout package.json
