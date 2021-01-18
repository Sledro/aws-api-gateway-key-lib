const AWS = require("aws-sdk");
const uuid = require("uuid");
AWS.config.credentials.accessKeyId = "AWS_ACCESS_KEY_ID";
AWS.config.credentials.secretAccessKey = "SECRET";
AWS.config.region = "eu-west-1";

const DAN_BASIC_API_USAGE_PLAN_ID = 'ibpnbd'
const DAN_API_KEY_ID = 'm4nffaedt8' // to test usage func

start()

async function start() {
  // Create API key
  let keyName = "keyName-" + uuid.v4();
  let key = await createApiKey(keyName, "This is a api key description");
  console.log("key", key);

  // Add API key to usage plan
  let planKey = await setApiKeyUsagePlan(key.id, DAN_BASIC_API_USAGE_PLAN_ID);
  console.log("planKey", planKey);

  // Get the API key usage data
  let keyUsage = await getApiKeyUsage("2021-01-18", "2021-01-10", DAN_BASIC_API_USAGE_PLAN_ID, DAN_API_KEY_ID, 25, "1");
  console.log("keyUsage", JSON.stringify(keyUsage, null, 2));

  // Delete API Key
  let deletedKey = await deleteApiKey(key.id);
  console.log("deletedKey", deletedKey);
}

async function createApiKey(keyName, keyDescription) {
  const params = {
    description: keyDescription,
    enabled: true,
    name: keyName,
    generateDistinctId: true,
  };
  const apigateway = new AWS.APIGateway();
  const apiKey = await apigateway.createApiKey(params).promise();
  return apiKey;
}

async function setApiKeyUsagePlan(keyId, usagePlanId) {
  const params = {
    keyId: keyId,
    keyType: "API_KEY",
    usagePlanId: usagePlanId,
  };
  const apigateway = new AWS.APIGateway();
  const keyUsagePlan = await apigateway.createUsagePlanKey(params).promise();
  return keyUsagePlan;
}

async function getApiKeyUsage(endDate, startDate, usagePlanId, keyId, limit, position) {
  var params = {
    endDate: endDate,
    startDate: startDate,
    usagePlanId: usagePlanId,
    keyId: keyId,
    limit: limit,
    position: position,
  };
  const apigateway = new AWS.APIGateway();
  const usagePlanKey = await apigateway.getUsage(params).promise();
  return usagePlanKey;
}

async function deleteApiKey(keyId) {
  var params = {
    apiKey: keyId,
  };
  const apigateway = new AWS.APIGateway();
  const key = await apigateway.deleteApiKey(params).promise();
  return key;
}