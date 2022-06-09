echo "Building with yarn"
rm -rf build/
yarn build:qa

AWS_PROFILE=$1
S3_DIR="s3://qa.sound-rig.com"
CLOUDFRONT_DIST_ID="E2SGD5A7CO2757"

echo "Deploying to $S3_DIR"

echo "Cleaning $S3_DIR"
aws s3 --profile=$AWS_PROFILE rm $S3_DIR --recursive

echo "Deploying build/ to $S3_DIR"
aws s3 --profile=$AWS_PROFILE cp build/ $S3_DIR --recursive --exclude "*.map"

echo "Invalidate CDN"
# The charge to submit an invalidation path is the same regardless of the number of files, so it's better to invalidate everything for the peace of mind
aws cloudfront --profile=$AWS_PROFILE create-invalidation --distribution-id $CLOUDFRONT_DIST_ID --paths "/*"
