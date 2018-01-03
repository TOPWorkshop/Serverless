export function createSuccessMessage(body) {
  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  };

  if (body) {
    response.body = JSON.stringify(body);
  }

  return response;
}

export function createErrorMessage(error) {
  return {
    statusCode: error.statusCode || 500,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(error),
  };
}

export function generatePolicy(principalId, effect, resource) {
  const authResponse = { principalId };

  if (effect && resource) {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      }],
    };

    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
}
