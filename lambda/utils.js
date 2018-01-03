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
