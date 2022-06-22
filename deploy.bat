echo "Building with yarn"

set AWS_PROFILE=%1
set S3_DIR="s3://sound-rig-web"
set CLOUDFRONT_DIST_ID="EW6DUEBWUWNY2"

if [%2]==[no-build] (GOTO:no-build)
if [%2]==[clear-cache] (GOTO:clear-cache)

rm -rf build/
yarn build:qa

:no-build

echo "Deploying to %S3_DIR%"

echo "Cleaning %S3_DIR%"
aws s3 --profile=%AWS_PROFILE% rm %S3_DIR% --recursive

echo "Deploying build/ to $S3_DIR"
aws s3 --profile=%AWS_PROFILE% cp build/ %S3_DIR% --recursive --exclude "*.map"

:clear-cache
echo "Invalidate CDN"
The charge to submit an invalidation path is the same regardless of the number of files, so it's better to invalidate everything for the peace of mind
aws cloudfront --profile=%AWS_PROFILE% create-invalidation --distribution-id=%CLOUDFRONT_DIST_ID% --paths "/*"