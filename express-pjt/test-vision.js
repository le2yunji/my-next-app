const vision = require("@google-cloud/vision");

const client = new vision.ImageAnnotatorClient();

async function testVision() {
  const filePath = "./sample.jpg";

  const [labelResult] = await client.labelDetection(filePath);
  const labels = labelResult.labelAnnotations || [];

  console.log("\nLabels:");
  labels.forEach((label) => {
    console.log(`${label.description}: ${label.score}`);
  });

  const [safeResult] = await client.safeSearchDetection(filePath);
  const safeSearch = safeResult.safeSearchAnnotation;

  console.log("\nSafeSearch:");
  console.log(safeSearch);
}

testVision().catch((error) => {
  console.error("Vision API test failed:");
  console.error(error);
});
