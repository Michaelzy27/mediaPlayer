echo "Building with yarn"

BUILD_DIR=dist/
AWS_PROFILE=${1:-sound-rig}
S3_DIR="s3://sound-rig-web" 
CLOUDFRONT_DIST_ID="E2OUHR5H6S5GRU"

echo AWS_PROFILE=$AWS_PROFILE

rm -rf $BUILD_DIR
yarn build-raw

echo "Deploying to $S3_DIR"

echo "Cleaning $S3_DIR"
aws s3 --profile=$AWS_PROFILE rm $S3_DIR --recursive

echo "Deploying $BUILD_DIR to $S3_DIR"
aws s3 --profile=$AWS_PROFILE cp $BUILD_DIR $S3_DIR --recursive --exclude "*.map"

echo "Invalidate CDN"
# The charge to submit an invalidation path is the same regardless of the number of files, so it's better to invalidate everything for the peace of mind
aws cloudfront --profile=$AWS_PROFILE create-invalidation --distribution-id=$CLOUDFRONT_DIST_ID --paths "/*"