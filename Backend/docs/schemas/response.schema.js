module.exports = {
    SuccessResponse: {
        description: 'Generic success response',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        data: { type: 'object' }
                    }
                }
            }
        }
    },
    ErrorResponse: {
        description: 'Generic error response',
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        message: { type: 'string' },
                        errors: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    path: { type: 'string' },
                                    message: { type: 'string' }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};
